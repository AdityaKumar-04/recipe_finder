'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/recipesSlice';
import { FiSearch } from 'react-icons/fi';

export default function Navbar() {
  const pathname  = usePathname();
  const isHome    = pathname === '/';
  const dispatch  = useDispatch();
  const searchQuery = useSelector((state) => state.recipes.searchQuery);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <span className="text-base leading-none">🍴</span>
          </div>
          <span className="font-bold text-slate-900 text-base tracking-tight hidden sm:block">
            Recipe<span className="text-amber-500">Finder</span>
          </span>
        </Link>

        {/* Search — only shown on non-home pages */}
        {!isHome && (
          <div className="flex-1 max-w-xl relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search recipes…"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400
                         text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>
        )}

        {/* Spacer on home so link is right-aligned */}
        {isHome && <div className="flex-1" />}

        {/* Nav link */}
        <Link
          href="/"
          className="flex-shrink-0 text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    </header>
  );
}
