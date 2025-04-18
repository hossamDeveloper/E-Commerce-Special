import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-white text-gray-900">
              <Navbar />
              <div className="container mx-auto px-2 sm:px-4 lg:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </div>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </Router>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}
