'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedRecipe } from '../store/recipesSlice';
import Image from 'next/image';
export default function Card(props) {
  console.log(props)
  const dispatch = useDispatch();
  const router = useRouter();
  const handleClick = () => {
    dispatch(setSelectedRecipe(props)); // Store selected recipe in Redux
    router.push(`/recipe/${props.id}`); // Navigate to detail page

  };
  return (
    <div className='px-2 w-[19rem] h-full flex flex-col justify-center items-center rounded-md shadow-md shadow-[#9296b0]' key={props.id}>
      <div className="w-[18rem] h-[12rem] pt-2">
        {/* <img className='w-full h-full object-cover 'src={props.image} alt={props.name} /> */}
        <Image
          src='https://plus.unsplash.com/premium_photo-1734275012690-6d3006fba036?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt={props.name}
          width={500} // Replace with the desired width
          height={500} // Replace with the desired height
          className="w-full h-full object-cover rounded"
        />
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
