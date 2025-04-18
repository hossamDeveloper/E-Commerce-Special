import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from "framer-motion";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import toast from 'react-hot-toast';
import { Plus, Minus, Trash2, ArrowLeft, CreditCard, ShoppingCart, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { translations, language } = useLanguage();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    toast.error(translations.removedFromCart, {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-full shadow-inner">
                <ShoppingCart className="w-20 h-20 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{translations.cartEmpty}</h2>
            <p className="text-gray-600 mb-8 text-lg">{translations.cartEmptyMessage}</p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className={`w-5 h-5 mr-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
              {translations.continueShopping}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {cartItems.length}
              </div>
              <span className="text-gray-600 font-medium">{translations.itemsInCart}</span>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 group hover:bg-white/50 transition-colors duration-300 rounded-xl px-4 gap-4 sm:gap-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl shadow-lg relative z-10 hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg z-20">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`} className="group">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-indigo-700 transition-colors break-words">{item.name}</h3>
                      </Link>
                      <p className="text-sm sm:text-base text-gray-600">{translations.price}: ${item.price}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {translations.subtotal}: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center bg-white/50 rounded-xl p-1 sm:p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 sm:p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <Minus size={16} className="sm:size-5 text-gray-600" />
                      </button>
                      <span className="w-8 sm:w-10 text-center font-medium text-sm sm:text-lg">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 sm:p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <Plus size={16} className="sm:size-5 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 sm:p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 group-hover:scale-110"
                    >
                      <Trash2 size={20} className="sm:size-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">{translations.subtotal}</span>
              <span className="font-semibold text-gray-800">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">{translations.shipping}</span>
              <span className="font-semibold text-green-600 flex items-center">
                <span className="mr-1">✓</span> {translations.freeShipping}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">{translations.shippingInfo}</span>
              <span className="font-semibold text-green-600">
                {translations.shippingDetails}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">{translations.total}</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {translations.checkout}
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-white/50 text-gray-700 py-4 rounded-xl font-semibold hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft className={`w-5 h-5 mr-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
              {translations.continueShopping}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart; 