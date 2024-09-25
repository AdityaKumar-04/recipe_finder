import React from 'react'

const Input = React.forwardRef(function Input({
    type = 'text',
    className='',
    ...props
},ref){
  return (
    
      <input 
      type={type}
      className={`w-[40rem] py-2 bg-transparent border outline-none rounded-lg px-2 text-[#9296b0] text-xl`+{className}}
      ref={ref}
      {...props}
      
      />
    
  )
})

export default Input
