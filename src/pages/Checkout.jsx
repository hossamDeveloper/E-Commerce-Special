import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';

const Checkout = () => {
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [step, setStep] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    setSubtotal(calculatedSubtotal);
  }, [cartItems]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsProcessing(true);
    try {
      // Here you would typically:
      // 1. Save the order to your database
      // 2. Clear the cart
      // 3. Send confirmation email
      // 4. Stay on the order summary page
      
      // Do not navigate away
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{translations.emptyCart}</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {translations.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {translations.checkoutTitle}
        </h1>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}>
                1
              </div>
              <span className="ml-2 text-sm sm:text-base">{translations.shippingInfo}</span>
            </div>
            <div className="hidden sm:block w-16 h-1 bg-gray-200"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}>
                2
              </div>
              <span className="ml-2 text-sm sm:text-base">{translations.paymentInfo}</span>
            </div>
            <div className="hidden sm:block w-16 h-1 bg-gray-200"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}>
                3
              </div>
              <span className="ml-2 text-sm sm:text-base">{translations.orderSummary}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {step === 1 && translations.shippingInfo}
                {step === 2 && translations.paymentInfo}
                {step === 3 && translations.orderSummary}
              </h2>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.firstName}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.lastName}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 mb-2">
                        {translations.email}
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 mb-2">
                        {translations.address}
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.city}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.country}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.postalCode}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 mb-2">
                        {translations.cardNumber}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base pl-10 sm:pl-12"
                        />
                        <CreditCard className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.expiryDate}
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base text-gray-700 mb-2">
                          {translations.cvv}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 mb-2">
                        {translations.nameOnCard}
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                        {translations.orderSummary}
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                              />
                              <div className="ml-3 sm:ml-4">
                                <h4 className="text-sm sm:text-base text-gray-900 font-medium">
                                  {item.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {translations.quantity}: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm sm:text-base text-gray-900 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{translations.subtotal}</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{translations.shipping}</span>
                          <span>{translations.free}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold text-gray-900">
                          <span>{translations.total}</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-900"
                    >
                      {translations.backToCart}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    {step === 3 ? translations.placeOrder : translations.next}
                    <ArrowRight className={`ml-2 w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {translations.orderSummary}
              </h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {translations.quantity}: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{translations.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{translations.shipping}</span>
                    <span>{translations.free}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-gray-900 mt-2">
                    <span>{translations.total}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 