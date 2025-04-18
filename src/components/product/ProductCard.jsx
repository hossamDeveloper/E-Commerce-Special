import React, { useState } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { addToFavorites, removeFromFavorites, selectIsFavorite } from '../../redux/favoritesSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductCard = ({ product }) => {
  const { translations, language } = useLanguage();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const isFavorite = useSelector(state => selectIsFavorite(state, product?.id));

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(translations.addedToCart);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
      toast.error(translations.removedFromFavorites);
    } else {
      dispatch(addToFavorites(product.id));
      toast.success(translations.addedToFavorites);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (!product) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <Skeleton height={200} />
          <Skeleton height={24} className="mt-4" />
          <Skeleton height={20} className="mt-2" />
          <Skeleton height={20} className="mt-2" width="50%" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton height={200} width="100%" />
          </div>
        )}
        <Link to={`/product/${product.id}`}>
          <img
            src={imageError ? '/placeholder.jpg' : product.image}
            alt={language === 'ar' ? product.nameAr : product.name}
            className={`w-full h-48 object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </Link>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'
            }`}
          />
        </button>
     
       
      </div>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {language === 'ar' ? product.nameAr : product.name}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {language === 'ar' ? product.descriptionAr : product.description}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold">
                  ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              </div>
              {product.discountPercentage > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span className="text-sm">{translations.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 