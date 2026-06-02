import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Input = React.forwardRef(function Input(
  { type = 'text', className = '', showIcon = false, ...props },
  ref
) {
  const base =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 ' +
    'placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ' +
    'focus:border-transparent transition-all';

  if (showIcon) {
    return (
      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type={type}
          ref={ref}
          className={`${base} pl-10 ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      ref={ref}
      className={`${base} ${className}`}
      {...props}
    />
  );
});

export default Input;
