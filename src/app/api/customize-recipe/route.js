import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { recipe, prompt } = await request.json();

    if (!recipe || !prompt) {
      return Response.json(
        { error: 'Recipe and prompt are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return Response.json(
        { error: 'AI service not configured. Please add your GEMINI_API_KEY to .env.local and restart the dev server.' },
        { status: 503 }
      );
    }

    // Build ingredient list from TheMealDB format
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure   = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
      }
    }

    const systemPrompt = `You are a professional chef and nutritionist. A user wants to customize a recipe.

Recipe Name: ${recipe.strMeal}
Cuisine: ${recipe.strArea || 'Unknown'}
Category: ${recipe.strCategory || 'Unknown'}
Original Ingredients: ${ingredients.join(', ')}
Original Instructions (excerpt): ${(recipe.strInstructions || '').substring(0, 600)}...

User Request: "${prompt}"

Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text. Use this exact schema:
{
  "summary": "2-3 sentence explanation of what you changed and why",
  "modifiedIngredients": ["full ingredient string with quantity", "..."],
  "modifiedInstructions": ["Step 1: full instruction", "Step 2: ...", "..."],
  "nutritionChanges": "1-2 sentence note on how the nutritional profile changed"
}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    // Strip possible markdown fences and parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed);

  } catch (error) {
    console.error('[customize-recipe] Error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate customization. Please try again.' },
      { status: 500 }
    );
  }
}
