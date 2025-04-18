import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Users, Target, Lightbulb, Shield } from "lucide-react";

const About = () => {
  const { translations } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading with a shorter time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); // Reduced from 1000ms to 500ms
    return () => clearTimeout(timer);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="w-full">
          {/* Simplified loading skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Hero Section Skeleton */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden">
            <div className="text-center px-6">
              <div className="h-12 w-3/4 mx-auto bg-blue-500/20 rounded animate-pulse mb-6"></div>
              <div className="h-6 w-1/2 mx-auto bg-blue-500/20 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Simplified Story Section Skeleton */}
          <section className="py-16">
            <div className="px-6">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <div className="h-8 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {translations.aboutUs}
          </h1>
        </div>

        {/* Hero Section */}
        <motion.section
          className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
          </div>
          <div className="text-center px-6">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {translations.aboutTitle}
            </motion.h1>
            <motion.p
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {translations.aboutSubtitle}
            </motion.p>
          </div>
        </motion.section>

        {/* Story Section */}
        <section className="py-16">
          <div className="px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-16"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {translations.aboutHeroTitle}
              </h2>
              <p className="text-gray-600">{translations.aboutHeroDesc}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80"
                  alt="About Us"
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeIn} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {translations.missionTitle}
                  </h3>
                  <p className="text-gray-600">{translations.missionDesc}</p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <h3 className="text-2xl font-bold mb-4">
                    {translations.visionTitle}
                  </h3>
                  <p className="text-gray-600">{translations.visionDesc}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="px-6">
            <motion.div
              className="text-center mb-16"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {translations.valuesTitle}
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {translations.value1}
                </h3>
                <p className="text-gray-600">{translations.value1Desc}</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {translations.value2}
                </h3>
                <p className="text-gray-600">{translations.value2Desc}</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Lightbulb className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {translations.value3}
                </h3>
                <p className="text-gray-600">{translations.value3Desc}</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {translations.value4}
                </h3>
                <p className="text-gray-600">{translations.value4Desc}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="px-6">
            <motion.div
              className="text-center mb-16"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {translations.teamTitle}
              </h2>
              <p className="text-gray-600">{translations.teamDesc}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt={translations.teamMember1}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {translations.teamMember1}
                  </h3>
                  <p className="text-gray-600">
                    {translations.teamMember1Role}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt={translations.teamMember2}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {translations.teamMember2}
                  </h3>
                  <p className="text-gray-600">
                    {translations.teamMember2Role}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
                  alt={translations.teamMember3}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {translations.teamMember3}
                  </h3>
                  <p className="text-gray-600">
                    {translations.teamMember3Role}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
                  alt={translations.teamMember4}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {translations.teamMember4}
                  </h3>
                  <p className="text-gray-600">
                    {translations.teamMember4Role}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 text-white py-16 overflow-hidden"
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

          <div className="relative w-full px-6">
            <motion.div
              className="text-center mb-16"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {translations.statsTitle}
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="text-center" variants={fadeIn}>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <p className="text-white/80">{translations.statsCustomers}</p>
              </motion.div>

              <motion.div className="text-center" variants={fadeIn}>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <p className="text-white/80">{translations.statsOrders}</p>
              </motion.div>

              <motion.div className="text-center" variants={fadeIn}>
                <div className="text-4xl font-bold mb-2">1K+</div>
                <p className="text-white/80">{translations.statsProducts}</p>
              </motion.div>

              <motion.div className="text-center" variants={fadeIn}>
                <div className="text-4xl font-bold mb-2">30+</div>
                <p className="text-white/80">{translations.statsCountries}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
