import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { selectProducts, selectCategories, fetchProducts, fetchProductsByCategory, searchProducts } from '../redux/productsSlice';
import {  Search, ArrowLeft,  ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import {  Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { useTranslation } from 'react-i18next';



const Products = memo(() => {
  const { translations, language } = useLanguage();
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("default");
  const [favorites, setFavorites] = useState([]);
  const productsPerPage = 12;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingNewProducts, setIsLoadingNewProducts] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([
    'smartphones',
    'laptops',
    'cameras',
    'headphones',
    'watches',
    'tablets'
  ]);
  

  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  // Reset selected categories when route changes
  useEffect(() => {
    setSelectedCategory('all');
    setSelectedCategories([
      'smartphones',
      'laptops',
      'cameras',
      'headphones',
      'watches',
      'tablets'
    ]);
    dispatch(fetchProducts());
  }, [location.pathname, dispatch]);

  // Initial load with error handling
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Check if products are already in Redux store
        if (products.length === 0) {
          await dispatch(fetchProducts()).unwrap();
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading initial products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch, products.length]);

  // Load favorites
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  // Handle category change
  useEffect(() => {
    const fetchProductsData = async () => {
      if (selectedCategory === 'all') return;
      
      try {
        setIsLoadingNewProducts(true);
        await dispatch(fetchProductsByCategory(selectedCategory)).unwrap();
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products by category:', err);
      } finally {
        setIsLoadingNewProducts(false);
      }
    };

    fetchProductsData();
  }, [dispatch, selectedCategory]);

  // Handle search
  useEffect(() => {
    if (!searchQuery) return;

    const searchProductsData = async () => {
      try {
        setIsLoadingNewProducts(true);
        await dispatch(searchProducts(searchQuery)).unwrap();
      } catch (err) {
        setError(err.message);
        console.error('Error searching products:', err);
      } finally {
        setIsLoadingNewProducts(false);
      }
    };

    const debounceTimer = setTimeout(searchProductsData, 500);
    return () => clearTimeout(debounceTimer);
  }, [dispatch, searchQuery]);

  const handleToggleFavorite = useCallback((productId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(productId);
      const newFavorites = isFavorite
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      if (isFavorite) {
        toast.error(translations.removedFromFavorites);
      } else {
        toast.success(translations.addedToFavorites);
      }
      
      return newFavorites;
    });
  }, [translations]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    toast.success(translations.addedToCart);
  }, [dispatch, translations]);

  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (categoryId === 'all') {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProductsByCategory(categoryId));
    }
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === '') {
      setSelectedCategory('all');
      dispatch(fetchProducts());
    }
  };

  // Memoize filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "default":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortOption]);

  // Memoize pagination calculations
  const { currentProducts, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    return { currentProducts, totalPages };
  }, [filteredAndSortedProducts, currentPage, productsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortOption]);

  // Memoize product card to prevent unnecessary re-renders
  const MemoizedProductCard = useMemo(() => {
    return React.memo(({ product }) => (
      <ProductCard
        product={product}
        isFavorite={favorites.includes(product.id)}
        onToggleFavorite={() => handleToggleFavorite(product.id)}
        onAddToCart={() => handleAddToCart(product)}
      />
    ));
  }, [favorites, handleToggleFavorite, handleAddToCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
              <div className="mt-4 h-10 w-64 bg-gray-200 rounded"></div>
              <div className="mt-2 h-4 w-96 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                      <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6">
        {/* Header */}
        <div className="mb-8 pt-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
            {translations.back}
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {translations.products.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {translations.products.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder={translations.searchProducts}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Categories and Sort */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{language === 'ar' ? 'الكل' : 'All'}</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{language === 'ar' ? category.nameAr : category.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">{translations.products.sort.default}</option>
                  <option value="price-low-high">{translations.products.sort.priceLowHigh}</option>
                  <option value="price-high-low">{translations.products.sort.priceHighLow}</option>
                  <option value="rating">{translations.products.sort.rating}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
          {currentProducts.map((product) => (
            <MemoizedProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 pb-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and 2 pages around current page
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                // Show dots for skipped pages
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Products.displayName = 'Products';

export default Products;
