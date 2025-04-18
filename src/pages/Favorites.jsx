import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-100 p-8 rounded-xl shadow-md max-w-md mx-auto">
            <div className="animate-pulse">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {translations.loading}
              </h2>
              <p className="text-gray-600 mb-6">
                {translations.pleaseWait}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {translations.noFavorites}
            </h1>
            <p className="text-gray-600 mt-2">
              {translations.startBrowsing}
            </p>
            <Link
              to="/products"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translations.browseProducts}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {translations.favorites}
          </h1>
          <p className="text-gray-600 mt-2">
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