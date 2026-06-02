'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_PROMPTS = [
  { label: '🥗 Vegetarian',   prompt: 'Make this recipe completely vegetarian' },
  { label: '💪 High Protein', prompt: 'Increase the protein content significantly' },
  { label: '🔥 Low Calories', prompt: 'Reduce the calories and make it lighter' },
  { label: '🌶️ Make Spicy',   prompt: 'Make it spicy with bold Indian-style spices' },
  { label: '👶 Kid Friendly', prompt: 'Make this kid-friendly and mild in flavour' },
  { label: '⚡ Quick Version', prompt: 'Create a quick 15-minute version of this recipe' },
];

export default function AICustomizer({ recipe }) {
  const [loading,      setLoading]      = useState(false);
  const [aiResponse,   setAiResponse]   = useState(null);
  const [error,        setError]        = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [copied,       setCopied]       = useState(false);

  const handleCustomize = async (prompt) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setAiResponse(null);
    setActivePrompt(prompt);

    try {
      const res = await fetch('/api/customize-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to customize recipe.');
      setAiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResponse) return;
    const text =
      `Modified: ${recipe.strMeal}\n\n` +
      `Ingredients:\n${(aiResponse.modifiedIngredients || []).join('\n')}\n\n` +
      `Instructions:\n${(aiResponse.modifiedInstructions || []).join('\n')}\n\n` +
      `Nutrition Note: ${aiResponse.nutritionChanges || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-sm leading-none">✨</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">AI Recipe Customizer</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Transform this recipe to match your dietary needs or cooking style.
        </p>
      </div>

      <div className="px-6 pb-6 space-y-4">
        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map(({ label, prompt }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCustomize(prompt)}
              disabled={loading}
              className={`
                px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border
                disabled:opacity-50 disabled:cursor-not-allowed
                ${activePrompt === prompt && !loading && aiResponse
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-900/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20'}
              `}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Custom text input */}
        <div className="flex gap-2">
          <input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomize(customPrompt)}
            placeholder="Or describe your own customization…"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white
                       placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500
                       focus:bg-white/8 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => handleCustomize(customPrompt)}
            disabled={loading || !customPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold
                       hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                       flex-shrink-0"
          >
            Ask AI
          </button>
        </div>

        {/* Loading dots */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                    className="w-2 h-2 rounded-full bg-amber-400"
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm">AI is customizing your recipe…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm leading-relaxed"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-2"
            >
              {/* Summary */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-200 text-sm leading-relaxed">{aiResponse.summary}</p>
              </div>

              {/* Ingredients */}
              {aiResponse.modifiedIngredients?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                    Modified Ingredients
                  </h4>
                  <div className="space-y-1.5">
                    {aiResponse.modifiedIngredients.map((ing, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {aiResponse.modifiedInstructions?.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                    Modified Instructions
                  </h4>
                  <div className="space-y-3">
                    {aiResponse.modifiedInstructions.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 border border-slate-600
                                          text-amber-400 text-[11px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition */}
              {aiResponse.nutritionChanges && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-300">Nutrition Note: </span>
                    {aiResponse.nutritionChanges}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs
                             font-semibold hover:text-white hover:bg-white/10 transition-all"
                >
                  {copied ? '✓ Copied!' : 'Copy Recipe'}
                </button>
                <button
                  onClick={() => handleCustomize(activePrompt)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs
                             font-semibold hover:text-white hover:bg-white/10 transition-all"
                >
                  ↻ Regenerate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
