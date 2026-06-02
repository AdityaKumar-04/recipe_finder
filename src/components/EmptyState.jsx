'use client'
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/recipesSlice';

const SUGGESTIONS = ['Chicken', 'Pasta', 'Salad'];

export default function EmptyState({ query }) {
  const dispatch = useDispatch();

  if (query) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="text-6xl mb-5 select-none">🔍</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No recipes found</h2>
        <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
          We couldn&apos;t find any recipes for{' '}
          <span className="font-semibold text-slate-700">&quot;{query}&quot;</span>.
          Try a different ingredient or cuisine below.
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setSearchQuery(s))}
              className="px-5 py-2 rounded-full border border-amber-300 bg-amber-50 text-amber-700
                         text-sm font-semibold hover:bg-amber-100 transition-colors shadow-sm"
            >
              Try &quot;{s}&quot;
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="text-6xl mb-5 select-none">🍽️</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Start exploring recipes</h2>
      <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
        Search for your favourite dish above, or pick a category or cuisine from the filter bar.
      </p>
      <button
        onClick={() => dispatch(setSearchQuery('Chicken'))}
        className="px-7 py-2.5 rounded-full bg-amber-500 text-white font-semibold
                   hover:bg-amber-600 transition-colors shadow-md shadow-amber-200"
      >
        Try &quot;Chicken&quot; →
      </button>
    </div>
  );
}
