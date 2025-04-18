import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(id => id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (state, productId) => state.favorites.items.includes(productId);

export default favoritesSlice.reducer; 