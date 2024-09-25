'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedRecipe } from '../store/recipesSlice';
export default function Card(props) {
  console.log(props)
  const dispatch = useDispatch();
  const router = useRouter();
  const handleClick = () => {
    dispatch(setSelectedRecipe(props)); // Store selected recipe in Redux
    router.push(`/recipe/${props.id}`); // Navigate to detail page
    
  };
  return (
    <div className='px-2 w-[19rem] flex flex-col justify-center items-center rounded-md shadow-md shadow-[#9296b0]' key={props.id}>
      <div className="w-[18rem] h-[12rem]">
        <img className='w-full h-full object-cover '
          src={props.image} alt={props.name} />
      </div>
      <div className="px-2 pb-2 flex flex-col pt-3">
        <h3 className="text-[#9296b0] font-mono text-lg">{props.name}</h3>
        <p className="text-[#9296b0] font-mono text-sm w-[17rem] line-clamp-3">{props.description}</p>
        <h3 className='text-[#9296b0] font-mono text-lg mt-1'>ingredients</h3>
        <div className="flex gap-x-3 flex-wrap">
          {props.ingredients?.map((items, index) => {
            return (<p className="text-[#9296b0] font-mono text-sm" key={index}>{items}</p>)
          })}
        </div>
        <h3 className='text-[#9296b0] font-mono text-lg mt-3'>rating: {props.rating}</h3>
        <div className="flex justify-end items-center w-full">
          <button className="text-blue-500 hover:underline font-mono text-sm" onClick={handleClick} >
            View Recipe Details
          </button>
        </div>
      </div>
    </div>
  )
}
