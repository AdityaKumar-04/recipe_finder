export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200 hover:from-amber-400 hover:to-orange-400 focus:ring-amber-400',
    secondary:
      'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    danger:
      'bg-rose-500 text-white shadow-sm hover:bg-rose-600 focus:ring-rose-400',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
