import { createSlice } from '@reduxjs/toolkit';

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    list: [],
    selectedRecipe: null,
    searchQuery: '',
    activeCategory: null,
    activeArea: null,
    loading: false,
  },
  reducers: {
    setRecipes: (state, action) => {
      state.list = action.payload;
    },
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      // Toggle: clicking active category clears it
      state.activeCategory = action.payload;
      // Category and Area are mutually exclusive
      if (action.payload !== null) state.activeArea = null;
    },
    setActiveArea: (state, action) => {
      state.activeArea = action.payload;
      if (action.payload !== null) state.activeCategory = null;
    },
    clearFilters: (state) => {
      state.activeCategory = null;
      state.activeArea = null;
      state.searchQuery = '';
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setRecipes,
  setSelectedRecipe,
  setSearchQuery,
  setActiveCategory,
  setActiveArea,
  clearFilters,
  setLoading,
} = recipesSlice.actions;

export default recipesSlice.reducer;
