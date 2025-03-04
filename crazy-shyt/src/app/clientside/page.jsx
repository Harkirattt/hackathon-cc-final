"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RealEstateLandingPage() {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyType: ''
  });

  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Real Estate Assistant. How can I help you today?", sender: 'bot' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  const popularProperties = [
    {
      id: 1,
      title: 'Modern Downtown Loft',
      price: '$450,000',
      location: 'Downtown',
      bedrooms: 2,
      bathrooms: 2,
      imageUrl: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 2,
      title: 'Suburban Family Home',
      price: '$650,000',
      location: 'Oakwood Estates',
      bedrooms: 4,
      bathrooms: 3,
      imageUrl: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: 3,
      title: 'Luxury Waterfront Condo',
      price: '$1,200,000',
      location: 'Riverside',
      bedrooms: 3,
      bathrooms: 3,
      imageUrl: 'https://picsum.photos/400/300?random=3'
    }
  ];

  const marketTrendData = [
    { name: 'Jan', Downtown: 350000, Suburbs: 450000, Waterfront: 750000 },
    { name: 'Feb', Downtown: 355000, Suburbs: 460000, Waterfront: 770000 },
    { name: 'Mar', Downtown: 360000, Suburbs: 465000, Waterfront: 790000 },
    { name: 'Apr', Downtown: 365000, Suburbs: 470000, Waterfront: 810000 },
    { name: 'May', Downtown: 370000, Suburbs: 475000, Waterfront: 830000 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    console.log('Enquiry Submitted:', enquiryForm);
    alert('Thank you for your enquiry! We will get back to you soon.');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { 
      id: chatMessages.length + 1, 
      text: newMessage, 
      sender: 'user' 
    };
    setChatMessages(prev => [...prev, userMessage]);

    const botResponse = { 
      id: chatMessages.length + 2, 
      text: simulateBotResponse(newMessage), 
      sender: 'bot' 
    };
    
    setNewMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const simulateBotResponse = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase();
    if (lowercaseMessage.includes('property')) {
      return "I can help you find the perfect property. What type of property are you interested in?";
    }
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
      return "Our current market trends show varying prices across different locations. Would you like to see our price trends?";
    }
    if (lowercaseMessage.includes('location')) {
      return "We have properties in Downtown, Suburban, and Waterfront areas. Which area are you most interested in?";
    }
    return "Interesting! I'm always ready to help you with real estate queries.";
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Dream Property Awaits
        </h1>
        <p className="text-xl text-white-800">
          Discover, Explore, and Find Your Perfect Home
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Enquiry Form - First Column */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Property Enquiry</h2>
            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-600"
                value={enquiryForm.name}
                onChange={handleInputChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-600"
                value={enquiryForm.email}
                onChange={handleInputChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone Number"
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-600"
                value={enquiryForm.phone}
                onChange={handleInputChange}
              />
              <select
                name="propertyType"
                className="w-full p-2 border rounded text-gray-900"
                value={enquiryForm.propertyType}
                onChange={handleInputChange}
              >
                <option value="">Select Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="investment">Investment</option>
              </select>
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-600"
                rows={4}
                value={enquiryForm.message}
                onChange={handleInputChange}
                required
              />
              <button 
                type="submit" 
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* Market Trends - Second Column */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Market Price Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Price']} />
                <Legend />
                <Line type="monotone" dataKey="Downtown" stroke="#8884d8" />
                <Line type="monotone" dataKey="Suburbs" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Waterfront" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Chatbot - Third Column */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-[600px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">AI Real Estate Assistant</h2>
            
            {/* Chat Messages Container */}
            <div 
              ref={chatContainerRef}
              className="flex-grow overflow-y-auto mb-4 space-y-2 p-2 border rounded"
            >
              {chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-2 rounded max-w-[80%] ${
                    message.sender === 'bot' 
                      ? 'bg-blue-200 text-gray-900 self-start' 
                      : 'bg-green-200 text-gray-900 self-end ml-auto'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about properties..."
                className="flex-grow p-2 border rounded-l text-gray-900 placeholder-gray-600"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Properties */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Popular Properties
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularProperties.map((property) => (
            <div key={property.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                <div className="text-gray-800 mt-2">
                  <p>{property.price}</p>
                  <p>{property.location}</p>
                  <p>{property.bedrooms} BD | {property.bathrooms} BA</p>
                </div>
                <button className="w-full mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}