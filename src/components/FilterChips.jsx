'use client'
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCategory, setActiveArea, clearFilters } from '../store/recipesSlice';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Lamb',
  'Pasta', 'Pork', 'Dessert', 'Starter', 'Breakfast',
  'Vegan', 'Side', 'Miscellaneous',
];

const AREAS = [
  'Indian', 'Italian', 'Chinese', 'Mexican', 'Japanese',
  'Thai', 'American', 'British', 'French', 'Greek',
  'Spanish', 'Turkish', 'Moroccan',
];

export default function FilterChips() {
  const dispatch        = useDispatch();
  const activeCategory  = useSelector((state) => state.recipes.activeCategory);
  const activeArea      = useSelector((state) => state.recipes.activeArea);
  const hasFilters      = activeCategory || activeArea;

  return (
    <div className="bg-white border-b border-slate-100 sticky top-[57px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="filter-scroll flex items-center gap-2 overflow-x-auto">

          {/* ── Category chips ── */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pr-1 flex-shrink-0">
            Category
          </span>

          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.93 }}
              onClick={() => dispatch(setActiveCategory(activeCategory === cat ? null : cat))}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                transition-all border
                ${activeCategory === cat
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50'}
              `}
            >
              {cat}
            </motion.button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

          {/* ── Cuisine chips ── */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pr-1 flex-shrink-0">
            Cuisine
          </span>

          {AREAS.map((area) => (
            <motion.button
              key={area}
              whileTap={{ scale: 0.93 }}
              onClick={() => dispatch(setActiveArea(activeArea === area ? null : area))}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                transition-all border
                ${activeArea === area
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50'}
              `}
            >
              {area}
            </motion.button>
          ))}

          {/* Clear all */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => dispatch(clearFilters())}
                className="flex-shrink-0 ml-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                           text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all"
              >
                ✕ Clear
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
