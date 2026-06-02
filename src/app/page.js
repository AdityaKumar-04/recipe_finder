'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipes, setLoading } from '../store/recipesSlice';
import HeroSection from '../components/HeroSection';
import FilterChips from '../components/FilterChips';
import Card from '@/components/Card';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

export default function Home() {
  const dispatch       = useDispatch();
  const { list: recipes, searchQuery, activeCategory, activeArea, loading } =
    useSelector((state) => state.recipes);

  /* ── Data fetching ── */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        let meals = [];

        if (activeCategory) {
          /* Category filter — returns partial data (id, name, thumb) */
          const res  = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(activeCategory)}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          if (data.meals) {
            meals = data.meals.map((m) => ({
              id:       m.idMeal,
              name:     m.strMeal,
              image:    m.strMealThumb,
              category: activeCategory,
            }));
          }
          /* Client-side text filter on top */
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            meals = meals.filter((m) => m.name.toLowerCase().includes(q));
          }

        } else if (activeArea) {
          /* Area filter — returns partial data */
          const res  = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(activeArea)}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          if (data.meals) {
            meals = data.meals.map((m) => ({
              id:    m.idMeal,
              name:  m.strMeal,
              image: m.strMealThumb,
              area:  activeArea,
            }));
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            meals = meals.filter((m) => m.name.toLowerCase().includes(q));
          }

        } else {
          /* Text search — returns full data */
          const query = searchQuery.trim();
          const res   = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          if (data.meals) {
            meals = data.meals.map((m) => ({
              id:          m.idMeal,
              name:        m.strMeal,
              description: m.strInstructions,
              image:       m.strMealThumb,
              category:    m.strCategory,
              area:        m.strArea,
            }));
          }
        }

        dispatch(setRecipes(meals));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[Home] fetch error:', err);
          dispatch(setRecipes([]));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    /* Debounce text search; fire immediately for filter changes */
    const delay = (activeCategory || activeArea) ? 0 : 420;
    const timer = setTimeout(fetchData, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, activeCategory, activeArea, dispatch]);

  const isEmpty = !loading && recipes.length === 0;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero with big search */}
      <HeroSection />

      {/* Sticky filter bar */}
      <FilterChips />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Results count */}
        {!loading && recipes.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{recipes.length}</span> recipe
              {recipes.length !== 1 ? 's' : ''} found
              {searchQuery && (
                <> for <span className="font-semibold text-slate-800">&quot;{searchQuery}&quot;</span></>
              )}
              {activeCategory && (
                <> in <span className="font-semibold text-amber-600">{activeCategory}</span></>
              )}
              {activeArea && (
                <> · <span className="font-semibold text-orange-600">{activeArea} cuisine</span></>
              )}
            </p>
          </div>
        )}

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyState query={searchQuery} />}

        {/* Recipe grid */}
        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recipes.map((recipe) => (
              <Card key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
