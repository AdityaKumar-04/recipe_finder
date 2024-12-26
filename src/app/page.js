'use client'
import Input from '../components/input';
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import { setRecipes } from '../store/recipesSlice';

export default function Home() {
  const dispatch = useDispatch();
  const recipes = useSelector(state => state.recipes.list);
  const [recipe, setRecipe] = useState([])
  const [loader, setloader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/c/1c0b-e284-4433-8a65');
        const data = await response.json();
        setRecipe(data); // Assuming the data is an array of recipes
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setloader(false);
      }
    };

    fetchData();
  }, [dispatch])
  useEffect(() => {
    // Filter recipes based on the search query
    if (searchQuery) {
      const filtered = recipe.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipe);
    }
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, recipe]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(recipe.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  return (
    <>
      <div className={`w-full pb-2 bg-[#1a1b28] overflow-hidden ${loader ? 'h-screen' : null} `} >
        <div className="w-full py-6 text-center bg-[#31354e]">
          <h1 className="text-6xl font-serif font-semibold text-[#9296b0] tracking-widest">Food recipe finder🍔</h1>
        </div>
        <div className="input-box">
          <div className="w-full py-3 px-7 flex flex-wrap justify-center items-center gap-3">
            <Input
              placeholder="Enter food items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            
          </div>
          
          {loader ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap w-full px-[5rem] mt-5 justify-center gap-4 min-h-screen">
                {/* Rendering the current page items */}
                {currentItems.map((recipe, index) => (
                  <Card key={recipe.id} {...recipe} />
                ))}
              </div>
              <div className="flex justify-center  gap-x-5 mt-3">
                <Button className="bg-gray-500 mx-2" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Button className="bg-gray-500 mx-2" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
