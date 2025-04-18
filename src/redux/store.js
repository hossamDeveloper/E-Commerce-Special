import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import favoritesReducer from './favoritesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configure persist for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'] // Only persist the items array
};

// Configure persist for favorites
const favoritesPersistConfig = {
  key: 'favorites',
  storage,
  whitelist: ['items'] // Only persist the items array
};

// Create persisted reducers
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, favoritesReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    products: productsReducer,
    favorites: persistedFavoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);