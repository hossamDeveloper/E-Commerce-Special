import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  X,
  ArrowRight,
  Menu,
  Heart,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const cart = useSelector((state) => state.cart.items);
  const { language, toggleLanguage, translations } = useLanguage();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartRef = useRef(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-blue-600"
            >
              ShopEase
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              {translations.home}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              {translations.products.title}
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              {translations.about}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              {translations.contact}
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Favorites Button */}
            <Link
              to="/favorites"
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart
                size={20}
                className="text-gray-700"
              />
            </Link>

            {/* Cart Button */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart
                  size={20}
                  className="text-gray-700"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed sm:absolute right-0 sm:right-auto left-0 sm:left-auto top-16 sm:top-auto sm:mt-2 w-full sm:w-72 md:w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {translations.cart}
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-4">
                      {cart.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          {translations.emptyCart}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-800">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {item.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} × ${item.price}
                                </p>
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {cart.length > 0 && (
                      <div className="p-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium text-gray-800">
                            {translations.total}
                          </span>
                          <span className="font-semibold text-gray-800">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <Link
                          to="/cart"
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={() => setIsCartOpen(false)}
                        >
                          <span>{translations.viewCart}</span>
                          <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2 sm:px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              {language === "ar" ? "English" : "عربي"}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                {translations.home}
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                {translations.products.title}
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                {translations.about}
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                {translations.contact}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
