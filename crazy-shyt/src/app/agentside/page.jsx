"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the DynamicMap component
const DynamicMap = dynamic(() => import('../../components/DynamicMap'), {
  ssr: false,
});

// Expanded and more dynamic sample data
const generateEnquiries = () => {
  return [
    {
      id: 1,
      name: "Rahul Sharma",
      location: "Malad West",
      phone: "+91 9876543210",
      email: "rahul.sharma@email.com",
      status: "pending",
      propertyInterest: "2 BHK Apartment",
      budget: "₹1.5 - 2.5 Cr",
      timestamp: new Date(2024, 2, 15, 10, 30)
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Juhu",
      phone: "+91 8765432109",
      email: "priya.patel@email.com",
      status: "contacted",
      propertyInterest: "Sea-facing Penthouse",
      budget: "₹5 - 8 Cr",
      timestamp: new Date(2024, 2, 14, 15, 45)
    },
    {
      id: 3,
      name: "Amit Kumar",
      location: "Andheri East",
      phone: "+91 7654321098",
      email: "amit.kumar@email.com",
      status: "pending",
      propertyInterest: "Commercial Space",
      budget: "₹3 - 5 Cr",
      timestamp: new Date(2024, 2, 13, 9, 15)
    }
  ];
};

const houseLocations = [
  { 
    id: 1, 
    lat: 19.1729, 
    lng: 72.8478, 
    name: "Luxurious Malad Apartment", 
    price: "₹2.5 Cr",
    type: "Residential",
    bedrooms: 3,
    area: 1200
  },
  { 
    id: 2, 
    lat: 19.0896, 
    lng: 72.8250, 
    name: "Beachfront Juhu Penthouse", 
    price: "₹7.5 Cr",
    type: "Luxury",
    bedrooms: 4,
    area: 2500
  },
  { 
    id: 3, 
    lat: 19.1171, 
    lng: 72.8464, 
    name: "Modern Andheri West Flat", 
    price: "₹3.2 Cr",
    type: "Residential",
    bedrooms: 3,
    area: 1500
  }
];

const housesPerArea = [
  { area: "Malad", houses: 12, avgPrice: "₹2.5 Cr" },
  { area: "Juhu", houses: 8, avgPrice: "₹6 Cr" },
  { area: "Andheri", houses: 15, avgPrice: "₹3.5 Cr" }
];

const AgentDashboard = () => {
  const [enquiries, setEnquiries] = useState(generateEnquiries());
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapFilter, setMapFilter] = useState('all');

  // Filtering and searching functions
  const filteredEnquiries = enquiries.filter(enquiry => 
    (filterStatus === 'all' || enquiry.status === filterStatus) &&
    (searchTerm === '' || 
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredHouseLocations = houseLocations.filter(house => 
    mapFilter === 'all' || house.type.toLowerCase() === mapFilter.toLowerCase()
  );

  // Refresh enquiries function
  const refreshEnquiries = () => {
    setEnquiries(generateEnquiries());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enquiries Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Mail className="mr-2 text-blue-600" /> Enquiries
            </h2>
            <div className="flex items-center space-x-2">
              {/* Status Filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md p-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
              </select>
              
              {/* Search Input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-md p-1 pl-8 text-sm w-36"
                />
                <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
              </div>
              
              {/* Refresh Button */}
              <motion.button 
                whileTap={{ rotate: 360 }}
                onClick={refreshEnquiries}
                className="p-2 bg-blue-50 rounded-full hover:bg-blue-100"
              >
                <RefreshCw className="text-blue-600 w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence>
            {filteredEnquiries.map((enquiry) => (
              <motion.div 
                key={enquiry.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border mb-2 cursor-pointer ${
                  enquiry.status === 'pending' 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-green-200 bg-green-50'
                }`}
                onClick={() => setSelectedEnquiry(enquiry)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{enquiry.name}</h3>
                    <p className="text-sm text-gray-600">
                      {enquiry.location} | {enquiry.propertyInterest}
                    </p>
                    <p className="text-xs text-gray-500">
                      {enquiry.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Houses Analytics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold flex items-center mb-4">
            <Calendar className="mr-2 text-green-600" /> Area Analytics
          </h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={housesPerArea}>
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'houses') return [value, 'Number of Houses'];
                  return [value, 'Avg Price'];
                }}
              />
              <Bar dataKey="houses" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {housesPerArea.map((area) => (
              <div 
                key={area.area} 
                className="flex justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition"
              >
                <span>{area.area}</span>
                <div>
                  <span className="font-bold text-green-600 mr-2">{area.houses} Houses</span>
                  <span className="text-gray-600">Avg: {area.avgPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 text-purple-600" /> Property Locations
            </h2>
            
            {/* Property Type Filter */}
            <select 
              value={mapFilter}
              onChange={(e) => setMapFilter(e.target.value)}
              className="border rounded-md p-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          
          <div className="h-[500px]">
            <DynamicMap 
              center={[19.0760, 72.8777]} 
              zoom={11} 
              locations={filteredHouseLocations}
            />
          </div>
        </motion.div>
      </div>

      {/* Enquiry Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEnquiry(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedEnquiry.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedEnquiry.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedEnquiry.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-blue-600" />
                  <span>{selectedEnquiry.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 text-green-600" />
                  <span>{selectedEnquiry.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 text-red-600" />
                  <span>{selectedEnquiry.email}</span>
                </div>
                <div className="flex items-center">
                  <Filter className="mr-2 text-purple-600" />
                  <span>Property Interest: {selectedEnquiry.propertyInterest}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-indigo-600" />
                  <span>Budget: {selectedEnquiry.budget}</span>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <CheckCircle className="mr-2" /> Accept
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <XCircle className="mr-2" /> Reject
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDashboard;