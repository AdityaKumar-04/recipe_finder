'use client'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/recipesSlice';
import { FiSearch } from 'react-icons/fi';

const TRENDING = ['Chicken', 'Pasta', 'Vegetarian', 'Dessert', 'Indian', 'Seafood', 'Breakfast'];

export default function HeroSection() {
  const dispatch    = useDispatch();
  const searchQuery = useSelector((state) => state.recipes.searchQuery);

  return (
    <section className="relative bg-white border-b border-slate-100 overflow-hidden">

      {/* Decorative background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-amber-50/80 via-orange-50/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-gradient-to-tr from-stone-100/60 to-transparent" />
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-orange-100/40 blur-2xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200
                        text-amber-700 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          AI-Powered Recipe Discovery
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
          Discover Recipes<br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            You&apos;ll Actually Cook
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-500 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Search by ingredient, cuisine, or meal type — then let AI customize any recipe
          to fit your diet, time, and taste.
        </p>

        {/* Search input */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder='Try "Chicken Tikka", "Pasta Carbonara", or "Vegan Salad"…'
            className="w-full pl-14 pr-6 py-4 text-base sm:text-lg rounded-2xl border-2 border-slate-200 bg-white
                       shadow-xl shadow-slate-100/80 text-slate-900 placeholder-slate-400
                       focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
          />
        </div>

        {/* Trending chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-slate-400 text-sm font-medium mr-1">Trending:</span>
          {TRENDING.map((item) => (
            <button
              key={item}
              onClick={() => dispatch(setSearchQuery(item))}
              className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium
                         shadow-sm hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 hover:shadow-amber-100
                         transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
