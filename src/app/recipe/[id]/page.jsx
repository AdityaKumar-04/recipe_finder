'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';
import { FiYoutube, FiTag, FiMapPin, FiLayers } from 'react-icons/fi';
import AICustomizer from '@/components/AICustomizer';
import Card from '@/components/Card';

/* ─── Loading skeleton ─────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-4 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="w-full h-80 rounded-2xl shimmer-animation opacity-20" />
          <div className="h-48 rounded-2xl shimmer-animation opacity-20" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="h-10 w-3/4 rounded-xl shimmer-animation opacity-20" />
          <div className="h-64 rounded-2xl shimmer-animation opacity-20" />
          <div className="h-48 rounded-2xl shimmer-animation opacity-20" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────── */
export default function RecipePage() {
  const { id } = useParams();
  const [recipe,         setRecipe]         = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(false);
  const [relatedRecipes, setRelatedRecipes] = useState([]);

  /* Fetch recipe detail */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.meals?.length) setRecipe(data.meals[0]);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  /* Fetch related recipes by category */
  useEffect(() => {
    if (!recipe?.strCategory) return;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(recipe.strCategory)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.meals) {
          const related = data.meals
            .filter((m) => m.idMeal !== id)
            .slice(0, 4)
            .map((m) => ({
              id:       m.idMeal,
              name:     m.strMeal,
              image:    m.strMealThumb,
              category: recipe.strCategory,
            }));
          setRelatedRecipes(related);
        }
      })
      .catch(() => {});
  }, [recipe, id]);

  /* ── States ── */
  if (loading) return <DetailSkeleton />;

  if (error || !recipe) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-950">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-3xl font-bold text-slate-200 mb-3">Recipe not found</h1>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-amber-500 text-white font-semibold
                     hover:bg-amber-400 transition-colors shadow-md"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  /* ── Parse ingredients ── */
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing  = recipe[`strIngredient${i}`];
    const meas = recipe[`strMeasure${i}`];
    if (ing?.trim()) {
      ingredients.push({ ingredient: ing.trim(), measure: meas?.trim() || '' });
    }
  }

  /* ── Parse instructions ── */
  const steps = (recipe.strInstructions || '')
    .split(/\r\n|\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  /* ── Tags ── */
  const tags = recipe.strTags
    ? recipe.strTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">

      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-600/8 blur-3xl" />
      </div>

      {/* Close / back button */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex justify-end">
        <Link href="/">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm
                       flex items-center justify-center text-slate-300 hover:bg-white/20 hover:text-white
                       transition-colors cursor-pointer"
          >
            <RxCross1 size={16} />
          </motion.div>
        </Link>
      </div>

      {/* ── Main grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Hero image */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl group"
            >
              <Image
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                {recipe.strCategory && (
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-semibold
                                   text-white border border-white/15">
                    {recipe.strCategory}
                  </span>
                )}
                {recipe.strArea && (
                  <span className="px-3 py-1 bg-amber-500/80 backdrop-blur-md rounded-full text-xs font-semibold
                                   text-white border border-amber-400/30">
                    {recipe.strArea}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Quick info pills */}
            <div className="grid grid-cols-2 gap-3">
              {recipe.strCategory && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/8">
                  <FiLayers className="text-amber-400 w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Category</p>
                    <p className="text-sm font-semibold text-slate-200">{recipe.strCategory}</p>
                  </div>
                </div>
              )}
              {recipe.strArea && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/8">
                  <FiMapPin className="text-amber-400 w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cuisine</p>
                    <p className="text-sm font-semibold text-slate-200">{recipe.strArea}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 mb-3">
                  <FiTag className="text-amber-400 w-4 h-4" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300
                                              border border-amber-500/25 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube link */}
            {recipe.strYoutube && (
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl
                           bg-rose-500/10 border border-rose-500/20 text-rose-400
                           hover:bg-rose-500/20 hover:text-rose-300 transition-all font-semibold text-sm"
              >
                <FiYoutube className="w-5 h-5" />
                Watch Video Tutorial
              </a>
            )}

            {/* AI Customizer */}
            <AICustomizer recipe={recipe} />
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-3 flex flex-col gap-8">

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight
                             text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 mb-2">
                {recipe.strMeal}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-sm ${s <= 4 ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                  ))}
                </div>
                <span className="text-slate-500 text-sm">4.0 · {ingredients.length} ingredients · {steps.length} steps</span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full inline-block" />
                Ingredients
                <span className="ml-auto text-xs font-normal text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                  {ingredients.length} items
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ingredients.map(({ ingredient, measure }, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-200 text-sm font-medium">{ingredient}</span>
                      {measure && (
                        <span className="text-slate-500 text-xs ml-1.5">— {measure}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-400 to-rose-500 rounded-full inline-block" />
                Instructions
                <span className="ml-auto text-xs font-normal text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                  {steps.length} steps
                </span>
              </h2>
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 border border-white/10
                                    text-amber-400 flex items-center justify-center text-xs font-bold
                                    group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500
                                    transition-all mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed pt-1 pb-4 border-b border-white/5
                                  last:border-0 group-hover:text-slate-100 transition-colors flex-1">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Related Recipes ── */}
        {relatedRecipes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              More <span className="text-amber-400">{recipe.strCategory}</span> Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedRecipes.map((r) => (
                <Card key={r.id} {...r} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
