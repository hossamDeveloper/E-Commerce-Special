import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any field is empty
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error(translations.fillAllFields, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(translations.invalidEmail, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        'service_w7ovzyi',
        'template_7v32o09',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'IPUENCr3JNbGTeCHL'
      );

      if (result.status === 200) {
        toast.success(translations.messageSentSuccess, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(translations.messageSentError, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white ">
        <div className="w-full">
          {/* Simplified loading skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200  rounded animate-pulse"></div>
          </div>

          {/* Hero Section Skeleton */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden">
            <div className="text-center px-6">
              <div className="h-12 w-3/4 mx-auto bg-blue-500/20 rounded animate-pulse mb-6"></div>
              <div className="h-6 w-1/2 mx-auto bg-blue-500/20 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Simplified Contact Info Section Skeleton */}
          <section className="py-16">
            <div className="px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white  p-6 rounded-xl shadow-md">
                      <div className="bg-gray-200  p-3 rounded-full w-14 h-14 mb-4 animate-pulse"></div>
                      <div className="h-6 w-32 bg-gray-200  rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-full bg-gray-200  rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form Section Skeleton */}
          <section className="py-16 bg-gray-50 ">
            <div className="px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <div className="h-8 w-48 bg-gray-200  rounded animate-pulse mb-4"></div>
                      <div className="h-4 w-full bg-gray-200  rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-12 bg-gray-200  rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-32 bg-gray-200  rounded animate-pulse"></div>
                    <div className="h-12 w-48 bg-gray-200  rounded animate-pulse"></div>
                  </div>
                  <div className="h-96 bg-gray-200  rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">
      <div className="w-full  ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">{translations.contactUs}</h1>
          <p className="text-gray-600 ">{translations.contactDescription}</p>
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
              {translations.contactTitle}
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {translations.contactSubtitle}
            </motion.p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">{translations.contactHeroTitle}</h2>
                <p className="text-gray-600 mb-8">{translations.contactHeroDesc}</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">{translations.namePlaceholder}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={translations.namePlaceholder}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">{translations.emailPlaceholder}</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={translations.emailPlaceholder}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">{translations.subjectPlaceholder}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={translations.subjectPlaceholder}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">{translations.messagePlaceholder}</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder={translations.messagePlaceholder}
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? translations.sending : translations.submitButton}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">{translations.contactInfo}</h2>
                
                <motion.div variants={fadeIn} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{translations.address}</h3>
                      <p className="text-gray-600">{translations.addressValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{translations.phone}</h3>
                      <p className="text-gray-600">{translations.phoneValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{translations.email}</h3>
                      <p className="text-gray-600">{translations.emailValue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{translations.workingHours}</h3>
                      <p className="text-gray-600">{translations.workingHoursValue}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Map */}
                <motion.div 
                  variants={fadeIn}
                  className="mt-8 rounded-lg overflow-hidden shadow-lg"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043435129!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="px-6">
            <motion.div 
              className="text-center mb-16"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">{translations.faqTitle}</h2>
            </motion.div>

            <motion.div 
              className="max-w-3xl mx-auto space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -2, transition: { duration: 0.3 } }}
              >
                <h3 className="text-xl font-semibold mb-2">{translations.faq1}</h3>
                <p className="text-gray-600">{translations.faq1Answer}</p>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -2, transition: { duration: 0.3 } }}
              >
                <h3 className="text-xl font-semibold mb-2">{translations.faq2}</h3>
                <p className="text-gray-600">{translations.faq2Answer}</p>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -2, transition: { duration: 0.3 } }}
              >
                <h3 className="text-xl font-semibold mb-2">{translations.faq3}</h3>
                <p className="text-gray-600">{translations.faq3Answer}</p>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md"
                variants={fadeIn}
                whileHover={{ y: -2, transition: { duration: 0.3 } }}
              >
                <h3 className="text-xl font-semibold mb-2">{translations.faq4}</h3>
                <p className="text-gray-600">{translations.faq4Answer}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
