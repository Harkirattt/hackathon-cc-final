"use client";

import React, { useState } from 'react';
import { MapPin, Search, TrendingUp, Home, Mail, ChevronDown } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Sample property data for Mumbai locations
const popularProperties = [
  {
    id: 1,
    title: "Luxurious Malad Apartment",
    price: "₹2.7 Crore",
    location: "Malad West, Mumbai",
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/image1.webp",
    color: "bg-gradient-to-br from-teal-500 to-green-600"
  },
  {
    id: 2,
    title: "Beachfront Juhu Penthouse",
    price: "₹6.8 Crore",
    location: "Juhu, Mumbai", 
    bedrooms: 4,
    bathrooms: 3,
    image: "/images/image3.png",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    title: "Modern Andheri West Flat",
    price: "₹3.4 Crore",
    location: "Andheri West, Mumbai",
    bedrooms: 3,
    bathrooms: 2,
    image: "/images/image4.jpeg",
    color: "bg-gradient-to-br from-purple-500 to-pink-600"
  }
];

// Market trends data for Mumbai locations
const marketTrendsData = [
  { name: 'Jan', 'Malad': 400, 'Juhu': 500, 'Andheri': 450 },
  { name: 'Feb', 'Malad': 420, 'Juhu': 550, 'Andheri': 480 },
  { name: 'Mar', 'Malad': 390, 'Juhu': 600, 'Andheri': 520 },
  { name: 'Apr', 'Malad': 450, 'Juhu': 580, 'Andheri': 500 },
  { name: 'May', 'Malad': 480, 'Juhu': 620, 'Andheri': 540 },
  { name: 'Jun', 'Malad': 500, 'Juhu': 650, 'Andheri': 570 }
];

const RealEstateLandingPage = () => {
  const [location, setLocation] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    alert(`Enquiry Submitted!\nName: ${enquiryName}\nEmail: ${enquiryEmail}\nMessage: ${enquiryMessage}`);
    
    // Reset form
    setEnquiryName("");
    setEnquiryEmail("");
    setEnquiryMessage("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Hero Section */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-20 px-4 overflow-hidden"
      >
        <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:w-1/2"
          >
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200">
              Mumbai Real Estate Insights
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Discover Your Perfect Home in Mumbai
            </p>
            
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-2">
              <MapPin className="text-white mr-2" />
              <input 
                type="text" 
                placeholder="Search Mumbai Locations" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-grow bg-transparent text-white placeholder-gray-200 outline-none"
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/30 text-white rounded-full p-2 hover:bg-white/40 transition"
              >
                <Search />
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="md:w-1/2 mt-8 md:mt-0"
          >
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              
            />
          </motion.div>
        </div>
      </motion.header>

      {/* Market Trends Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
          <TrendingUp className="mr-3 text-green-600" /> Mumbai Market Performance
        </h2>
        
        {/* Tabs for Graph View */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 rounded-full p-1 flex">
            {['overview', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tab === 'overview' ? 'Overview' : 'Detailed Analysis'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Malad" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Juhu" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Andheri" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {['Malad', 'Juhu', 'Andheri'].map((location) => (
                <div 
                  key={location} 
                  className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                >
                  <h3 className="text-xl font-semibold mb-4">{location}</h3>
                  <div className="flex justify-around">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Price</p>
                      <p className="text-green-600 font-bold">
                        {location === 'Malad' ? '₹2.5 Cr' : 
                         location === 'Juhu' ? '₹7.5 Cr' : 
                         '₹3.2 Cr'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className="text-green-600 font-bold">
                        {location === 'Malad' ? '+4.5%' : 
                         location === 'Juhu' ? '+6.2%' : 
                         '+5.1%'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Popular Properties Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
          <Home className="mr-3 text-green-600" /> Popular Properties
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularProperties.map((property) => (
            <motion.div 
              key={property.id} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl shadow-lg overflow-hidden ${property.color} text-white`}
            >
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="opacity-80">{property.location}</p>
                <div className="flex justify-between mt-4">
                  <span className="font-bold">{property.price}</span>
                  <span>{property.bedrooms} BD | {property.bathrooms} BA</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
          <Mail className="mr-3 text-green-600" /> Contact Us
        </h2>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl"
        >
          <form onSubmit={handleSubmitEnquiry} className="space-y-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              value={enquiryName}
              onChange={(e) => setEnquiryName(e.target.value)}
              required
              className="w-full p-3 border-2 border-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={enquiryEmail}
              onChange={(e) => setEnquiryEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea 
              placeholder="Your Message" 
              value={enquiryMessage}
              onChange={(e) => setEnquiryMessage(e.target.value)}
              required
              rows={4}
              className="w-full p-3 border-2 border-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-md hover:from-green-700 hover:to-teal-700 transition"
            >
              Send Enquiry
            </motion.button>
          </form>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default RealEstateLandingPage;