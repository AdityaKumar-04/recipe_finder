'use client'
import React from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const { id } = router.query;

  const recipe = useSelector(state => state.recipes.selectedRecipe);

  // useEffect(() => {
  //   if (id) {
  //     setLoading(false);
  //   }
  // }, [id]);

  // if (loading) {
  //   return <div className="flex justify-center items-center h-[50vh]">
  //     <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  //   </div>;
  // }

  if (!recipe) {
    return <div className='w-full h-screen  flex justify-center items-center text-6xl font-mono font-extrabold text-[#6a6e8a] bg-[#1a1b28]'>Recipe not found</div>;
  }
  return (
    <div className="w-full bg-[#1a1b28] relative flex flex-col justify-center items-center pt-28 px-4">
      <div className="w-full py-6 text-center bg-[#31354e] absolute top-0">
        <h1 className="text-4xl font-serif font-semibold text-[#9296b0]">Recipe Details</h1>
      </div>
      <div className=" absolute font-semibold text-white top-36 right-8 text-2xl">
        <Link href="/"><RxCross1 /></Link>

      </div>
      <div className="w-full  mx-auto bg-[#31354e] p-6 rounded-lg mt-5 flex justify-between flex-col md:flex-row md:items-start items-center gap-x-5 ">
        <div className="w-full  my-4 ">
          {/* <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} /> */}
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full py-5">
          <h2 className="text-3xl font-serif font-semibold text-[#9296b0]">{recipe.name}</h2>
          <p className="text-[#9296b0] font-mono text-sm">{recipe.description}</p>
          <h3 className='text-[#9296b0] font-mono text-lg mt-3'>Ingredients</h3>
          <ul className="list-disc list-inside text-[#9296b0] font-mono">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h3 className='text-[#9296b0] font-mono text-lg mt-3'>instructions</h3>
          <ul className="list-disc list-inside text-[#9296b0] font-mono">
            {recipe.instructions.map((instructions, index) => (
              <li key={index}>{instructions}</li>
            ))}
          </ul>
          <h3 className='text-[#9296b0] font-mono text-lg mt-3'>Rating: {recipe.rating}</h3>
          <div className="flex flex-col">
            <h1 className="text-[#9296b0] font-mono text-lg mt-3 ">Reviews</h1>
            {recipe.reviews.length === 0 ? (
              <p className="text-[#9296b0] font-mono ml-4 mt-2">No reviews yet.</p>
            ) : (
              recipe.reviews.map((review, index) => (
                <div key={index} className="ml-4 mt-2">
                  <h4 className="text-[#9296b0] font-mono">{review.user}</h4>
                  <p className="text-[#9296b0] font-mono">{review.comment}</p>
                  <p className="text-[#9296b0] font-mono">Rating: {review.rating}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
