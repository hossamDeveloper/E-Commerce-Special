import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/ProductCard';
import { selectAllProducts, fetchProducts } from '../redux/productsSlice';
import { selectFavorites } from '../redux/favoritesSlice';

const Favorites = memo(() => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const allProducts = useSelector(selectAllProducts);
  const [loading, setLoading] = useState(true);
  const productsLoading = useSelector((state) => state.products.loading);

  // Load products if they are not available in the store
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await dispatch(fetchProducts()).unwrap();
      } catch (err) {
        console.error('Error loading products:', err);
        toast.error(translations.errorLoadingProducts);
      } finally {
        setLoading(false);
      }
    };

    if (!allProducts || allProducts.length === 0) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [dispatch, translations, allProducts]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    toast.success(translations.addedToCart);
  }, [dispatch, translations]);

  // Memoize favorite products
  const favoriteProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    return allProducts.filter(product => favorites.includes(product.id));
  }, [allProducts, favorites]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="mt-2 h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
                <div className="mt-4 space-y-2">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {translations.noFavorites}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {translations.noFavoritesDescription}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translations.browseProducts}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {translations.favorites}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {translations.favoritesDescription}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
});

Favorites.displayName = 'Favorites';

export default Favorites; 