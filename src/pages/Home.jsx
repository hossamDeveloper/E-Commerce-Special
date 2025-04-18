import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { selectAllProducts, fetchProducts } from '../redux/productsSlice';
import { ShoppingBag, Truck, Shield, Clock, RefreshCw, Star, Package, CreditCard, Headphones, ArrowRight, ShoppingCart, Smartphone, Laptop, Camera, Headphones as HeadphonesIcon, Watch, Tablet } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/slider.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const { translations, language } = useLanguage();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products on component mount
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

    if (!products || products.length === 0) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  // Load favorites
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleToggleFavorite = (product) => {
    const storedFavorites = localStorage.getItem('favorites');
    let updatedFavorites = [];
    
    if (storedFavorites) {
      updatedFavorites = JSON.parse(storedFavorites);
    }
    
    const isFavorite = updatedFavorites.includes(product.id);
    
    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter(id => id !== product.id);
      toast.error(translations.removedFromFavorites);
    } else {
      updatedFavorites = [...updatedFavorites, product.id];
      toast.success(translations.addedToFavorites);
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Get top 6 rated products with loading state
  const topRatedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [products]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };


  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(translations.addedToCart, {
      duration: 2000,
      position: 'top-right',
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200"></div>
        </div>
        
        {/* Categories Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="container mx-auto px-4 py-12">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-[60vh] bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {translations.welcome}
              </motion.h1>
              <motion.p 
                className={`text-lg sm:text-xl mb-6 text-white/90 max-w-2xl mx-auto lg:mx-0 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {translations.aboutDescription}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link
                  to="/products"
                  className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {translations.shopNow}
                  <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
                </Link>
                <Link
                  to="/about"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {translations.discoverMore}
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2 flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative w-full max-w-lg">
                <img 
                  src="https://img.freepik.com/free-vector/online-shopping-concept-landing-page_52683-22153.jpg"
                  alt="Modern Store Experience"
                  className="w-full h-[400px] object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Welcome to Our Store</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-6">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{translations.features}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">{translations.brandDescription}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              variants={fadeIn}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="bg-blue-100 p-2.5 sm:p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{translations.feature1}</h3>
              <p className="text-sm sm:text-base text-gray-600">{translations.feature1Desc}</p>
            </motion.div>

            <motion.div 
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              variants={fadeIn}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="bg-green-100 p-2.5 sm:p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{translations.feature2}</h3>
              <p className="text-sm sm:text-base text-gray-600">{translations.feature2Desc}</p>
            </motion.div>

            <motion.div 
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              variants={fadeIn}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="bg-purple-100 p-2.5 sm:p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{translations.feature3}</h3>
              <p className="text-sm sm:text-base text-gray-600">{translations.feature3Desc}</p>
            </motion.div>

            <motion.div 
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              variants={fadeIn}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="bg-red-100 p-2.5 sm:p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{translations.feature4}</h3>
              <p className="text-sm sm:text-base text-gray-600">{translations.feature4Desc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">{translations.featuredProducts}</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              {translations.viewAll}
              <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="featured-products-slider"
          >
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {topRatedProducts.map((product) => (
                  <div key={product.id} className="px-2 sm:px-3">
                    <ProductCard
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={() => handleToggleFavorite(product)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </div>
                ))}
              </Slider>
            )}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{translations.testimonials}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{translations.brandDescription}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{translations.testimonial1}</p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 1"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold">{translations.customerName1}</h4>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{translations.testimonial2}</p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 2"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold">{translations.customerName2}</h4>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{translations.testimonial3}</p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 3"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold">{translations.customerName3}</h4>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{translations.brands}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{translations.brandDescription}</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/apple-11.svg"
                  alt="Apple"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/lenovo-1.svg"
                  alt="Lenovo"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/hp-1.svg"
                  alt="HP"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/lg-1.svg"
                  alt="LG"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/intel-1.svg"
                  alt="Intel"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-full h-24 flex items-center justify-center">
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/samsung-2.svg"
                  alt="Samsung"
                  className="h-16 object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-12 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative w-full px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{translations.newsletter}</h2>
            <p className="text-xl mb-8 text-white/90">{translations.newsletterDesc}</p>
            
            <motion.form 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <input 
                type="email" 
                placeholder={translations.emailPlaceholder}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
              />
              <button 
                type="submit"
                className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {translations.subscribe}
                  <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
