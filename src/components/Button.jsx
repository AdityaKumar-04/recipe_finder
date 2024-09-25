import React from 'react'

export default function Button({
  children,
  type = 'button',
  className = '',
  ...props

}) {
  return (
    <button
      type={type}
      className={`w-[10rem] text-md py-[0.3rem] rounded-lg bg-[#31354e] text-[#9296b0] font-serif font-semibold shadow-sm shadow-[#31354e]`}
      {...props}>
      {children}
    </button>
  )
}
