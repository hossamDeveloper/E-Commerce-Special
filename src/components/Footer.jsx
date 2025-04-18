import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { translations } = useLanguage();
  
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p className="text-gray-300">
        &copy; 2025 {translations.allRightsReserved}
      </p>
    </footer>
  );
};

export default Footer;
