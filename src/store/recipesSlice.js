
import { createSlice } from '@reduxjs/toolkit';

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    list: [],
    selectedRecipe: null
  },
  reducers: {
    setRecipes: (state, action) => {
      state.list = action.payload;
    },
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    }
  }
});

export const { setRecipes, setSelectedRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
