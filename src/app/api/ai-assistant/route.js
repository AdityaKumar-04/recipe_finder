import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { message, recipe, history = [] } = await request.json();

    if (!message?.trim()) {
      return Response.json(
        { success: false, message: 'Message is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return Response.json(
        { success: false, message: 'AI service not configured. Please add GEMINI_API_KEY to .env.local and restart the dev server.' },
        { status: 503 }
      );
    }

    /* ── Build recipe context ── */
    let recipeContext = 'No specific recipe is currently open.';
    if (recipe) {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing  = recipe[`strIngredient${i}`];
        const meas = recipe[`strMeasure${i}`];
        if (ing?.trim()) ingredients.push(`${meas?.trim() || ''} ${ing.trim()}`.trim());
      }
      recipeContext = `
Current Recipe: ${recipe.strMeal || recipe.name || 'Unknown'}
Category: ${recipe.strCategory || recipe.category || 'N/A'}
Cuisine: ${recipe.strArea || recipe.area || 'N/A'}
Ingredients: ${ingredients.length ? ingredients.join(', ') : 'N/A'}
Instructions (excerpt): ${(recipe.strInstructions || '').slice(0, 400)}
      `.trim();
    }

    /* ── Build conversation history ── */
    const historyText = history.length
      ? history
          .slice(-6) // last 6 exchanges to stay within token limits
          .map((h) => `${h.role === 'user' ? 'User' : 'ChefAI'}: ${h.content}`)
          .join('\n')
      : '';

    /* ── Full prompt ── */
    const prompt = `You are ChefAI — a warm, expert cooking assistant for an Indian audience. You naturally understand Hindi-English (Hinglish) queries.

${recipeContext}

${historyText ? `Conversation so far:\n${historyText}\n` : ''}User: ${message}

Your rules:
- If a recipe is open: explain, customize, or adjust it as asked.
- If no recipe: suggest recipes from knowledge OR generate a brand-new one.
- Keep steps simple, clear, and numbered.
- For new recipes include: Ingredients, Instructions, Tips, and estimated Nutrition.
- Tone: warm, friendly, slightly conversational.
- Understand Hinglish naturally, reply in English.
- Format in clean Markdown.

When generating a recipe use this format:
## 🍽️ [Recipe Name]

**⏱️ Time:** X mins | **👥 Serves:** X | **🔥 Difficulty:** Easy/Medium/Hard

### 🛒 Ingredients
- item with quantity

### 👨‍🍳 Instructions
1. Step

### 💡 Tips
- tip

### 📊 Nutrition (per serving)
- Calories: ~X kcal | Protein: Xg | Carbs: Xg | Fat: Xg
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    return Response.json({ success: true, answer: text });

  } catch (error) {
    console.error('[ai-assistant] Error:', error);

    const msg = error?.message?.includes('API_KEY') || error?.message?.includes('API key')
      ? 'Invalid Gemini API key. Check your .env.local file.'
      : error?.message || 'AI assistant failed. Please try again.';

    return Response.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
