import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice'; // Adjust the path as needed

const store = configureStore({
  reducer: {
    recipes: recipesReducer,
  },
});

export default store;
