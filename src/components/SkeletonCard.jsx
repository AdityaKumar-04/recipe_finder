export default function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
      {/* Image placeholder */}
      <div className="w-full h-52 shimmer-animation" />

      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="h-4 w-20 rounded-full shimmer-animation" />

        {/* Title line 1 */}
        <div className="h-5 w-4/5 rounded-lg shimmer-animation" />
        {/* Title line 2 (shorter) */}
        <div className="h-4 w-3/5 rounded-lg shimmer-animation" />

        {/* Divider */}
        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          <div className="h-4 w-12 rounded shimmer-animation" />
          <div className="h-7 w-24 rounded-full shimmer-animation" />
        </div>
      </div>
    </div>
  );
}
