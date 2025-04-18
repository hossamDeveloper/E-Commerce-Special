import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLanguage } from "../context/LanguageContext";
import { addToCart } from "../redux/cartSlice";
import { fetchProducts } from "../redux/productsSlice";
import { addToFavorites, removeFromFavorites, selectIsFavorite } from "../redux/favoritesSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Package,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import ShareOptions from "../components/product/ShareOptions";
import Modal from "../components/common/Modal";
import ProductCard from "../components/product/ProductCard";

const ProductDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translations, language } = useLanguage();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const products = useSelector((state) => state.products.products);
  const productsLoading = useSelector((state) => state.products.loading);
  const isFavorite = useSelector(state => selectIsFavorite(state, product?.id));

  const relatedProducts = useMemo(() => {
    if (!products || !product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, showAllRelated ? undefined : 3);
  }, [products, product, showAllRelated]);

  const totalRelatedProducts = useMemo(() => {
    if (!products || !product) return 0;
    return products.filter(p => p.category === product.category && p.id !== product.id).length;
  }, [products, product]);

  const handleAddToCart = useCallback((productToAdd = null) => {
    const targetProduct = productToAdd || product;
    if (!targetProduct) return;

    // Ensure price is a valid number
    const price = parseFloat(targetProduct.price);
    if (isNaN(price)) {
      toast.error(translations.errorAddingToCart);
      return;
    }

    const cartItem = {
      id: targetProduct.id,
      name: language === 'ar' ? targetProduct.nameAr : targetProduct.name,
      price: price,
      image: targetProduct.image,
      quantity: quantity,
      total: (price * quantity).toFixed(2)
    };

    // Validate cart item
    if (!cartItem.id || !cartItem.name || !cartItem.price || !cartItem.image) {
      toast.error(translations.errorAddingToCart);
      return;
    }

    dispatch(addToCart(cartItem));
    toast.success(translations.addedToCart, {
      duration: 2000,
      position: "top-right",
    });
  }, [product, quantity, dispatch, translations, language]);

  const toggleFavorite = useCallback((productToToggle = null) => {
    const targetProduct = productToToggle || product;
    if (!targetProduct) return;
    
    if (isFavorite) {
      dispatch(removeFromFavorites(targetProduct.id));
      toast.error(translations.removedFromFavorites, {
        duration: 2000,
        position: "top-right",
      });
    } else {
      dispatch(addToFavorites(targetProduct.id));
      toast.success(translations.addedToFavorites, {
        duration: 2000,
        position: 'top-right',
      });
    }
  }, [isFavorite, product, dispatch, translations]);

  // Memoize product card for related products
  const MemoizedProductCard = useMemo(() => {
    return React.memo(({ product }) => (
      <ProductCard
        product={product}
        onToggleFavorite={() => toggleFavorite(product)}
        onAddToCart={() => handleAddToCart(product)}
      />
    ));
  }, [toggleFavorite, handleAddToCart]);

  // Memoize product images
  const MemoizedProductImage = useMemo(() => {
    return React.memo(({ src, alt }) => (
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    ));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        
        const transformedProduct = {
          id: data.id,
          name: data.title,
          nameAr: data.title,
          description: data.description,
          descriptionAr: data.description,
          price: parseFloat(data.price), // Convert price to number
          image: data.thumbnail,
          images: data.images,
          category: data.category,
          rating: data.rating,
          inStock: data.stock > 0,
          isNew: true,
          isFeatured: data.rating >= 4.5,
          brand: data.brand,
          discountPercentage: data.discountPercentage
        };
        
        setProduct(transformedProduct);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch products if they are not available in the store
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }

    fetchProduct();
  }, [id, dispatch, products]);

  const getDetailedDescription = useCallback(() => {
    return language === "en" ? product.description : product.descriptionAr;
  }, [language, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Product Details Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-[400px]"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-12">
            <div className="bg-gray-200 h-8 w-1/4 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, index) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="relative">
            <motion.div
              className="aspect-square rounded-xl overflow-hidden bg-white shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MemoizedProductImage
                src={product.image}
                alt={language === "ar" ? product.nameAr : product.name}
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            className="space-y-6 bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? product.nameAr : product.name}
                </h1>
                <div className="flex items-center mt-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-gray-600 dark:text-gray-300 ml-2">
                    {product.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price}
                  </div>
                  {product.discountPercentage > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 line-through">
                        ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                      </div>
                      <div className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                        -{product.discountPercentage}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{translations.description}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {getDetailedDescription()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{translations.freeShipping}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{translations.fastDelivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{translations.securePayment}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{translations.easyReturns}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <motion.button
                onClick={() => toggleFavorite()}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </motion.button>
              <motion.button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </motion.button>
              <motion.button
                onClick={() => handleAddToCart()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!product || !product.inStock}
              >
                <ShoppingCart className="w-5 h-5" />
                {product?.inStock ? translations.addToCart : translations.outOfStock}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {translations.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
            {totalRelatedProducts > 3 && !showAllRelated && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllRelated(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {translations.showMore}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Options Modal */}
      <Modal
        isOpen={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        title={translations.share}
      >
        <ShareOptions product={product} />
      </Modal>
    </div>
  );
});

ProductDetails.displayName = "ProductDetails";

export default ProductDetails;
