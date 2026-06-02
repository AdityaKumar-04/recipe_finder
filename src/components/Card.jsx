'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Card(props) {
  const router = useRouter();

  const goToRecipe = () => router.push(`/recipe/${props.id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={goToRecipe}
      className="w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100
                 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group"
    >
      {/* ── Image ── */}
      <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
        <Image
          src={props.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
          alt={props.name || 'Recipe image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge — top left */}
        {props.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm
                          rounded-full text-[11px] font-semibold text-slate-700 shadow-sm">
            {props.category}
          </div>
        )}

        {/* Area badge — top right */}
        {props.area && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm
                          rounded-full text-[11px] font-semibold text-white shadow-sm">
            {props.area}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-4 flex flex-col flex-grow">
        <h3 className="text-slate-900 font-semibold text-base leading-snug mb-1.5 line-clamp-2
                       group-hover:text-amber-600 transition-colors">
          {props.name}
        </h3>

        {props.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">
            {props.description}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-sm leading-none">★</span>
            <span className="text-xs font-semibold text-slate-500">4.5</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goToRecipe(); }}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold
                       hover:bg-amber-500 transition-colors"
          >
            View Recipe →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
