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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-lg"
                />
                <button
                  onClick={() => toggleFavorite()}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isFavorite
                      ? 'bg-red-100 text-red-500'
                      : 'bg-gray-100 text-gray-500'
                  } hover:scale-110 transition-transform`}
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product.rating} {translations.rating})
                  </span>
                </div>

                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{translations.addToCart}</span>
                  </button>
                </div>

                {/* Product Features */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
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
