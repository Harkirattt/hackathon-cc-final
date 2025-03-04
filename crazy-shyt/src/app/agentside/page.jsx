"use client";

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const AgentDashboard = () => {
  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New Enquiry: 3 BHK in Mumbai", time: "5 mins ago" },
    { id: 2, message: "Interested Buyer: Luxury Villa in Bangalore", time: "2 hours ago" },
    { id: 3, message: "Scheduled Visit: Apartment in Pune", time: "Yesterday" }
  ]);

  // House locations for heatmap
  const houseLocations = [
    { lat: 19.0760, lng: 72.8777, count: 45, city: "Mumbai" },
    { lat: 12.9716, lng: 77.5946, count: 30, city: "Bangalore" },
    { lat: 18.5204, lng: 73.8567, count: 35, city: "Pune" },
    { lat: 26.9124, lng: 75.7873, count: 20, city: "Jaipur" }
  ];

  // Calendar setup
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([
    {
      title: 'Villa Visit - Mumbai',
      start: new Date(2024, 2, 15, 10, 0),
      end: new Date(2024, 2, 15, 12, 0),
    },
    {
      title: 'Apartment Viewing - Bangalore',
      start: new Date(2024, 2, 20, 14, 0),
      end: new Date(2024, 2, 20, 16, 0),
    }
  ]);

  // Function to remove notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '250px 1fr 350px', 
      height: '100vh', 
      gap: '15px', 
      padding: '15px',
      backgroundColor: '#f4f4f4'
    }}>
      {/* Notifications Column */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#333' }}>Latest Enquiries</h2>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            style={{
              backgroundColor: '#f9f9f9',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color:'black' }}>{notification.message}</p>
              <small style={{ color: 'black' }}>{notification.time}</small>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '2',
                width: '25px',
                height: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Heatmap Column */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          padding: '15px', 
          margin: 0, 
          backgroundColor: '#f0f0f0',
          color: '#333'
        }}>
          House Availability Heatmap
        </h2>
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: 'calc(100% - 50px)', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {houseLocations.map((location, index) => (
            <Marker 
              key={index} 
              position={[location.lat, location.lng]}
            >
              <Popup>
                {location.city}: {location.count} Houses Available
              </Popup>
              <Tooltip>{location.city}</Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Calendar Column */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#333' }}>House Visit Schedule</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100% - 50px)' }}
        />
      </div>
    </div>
  );
};

export default AgentDashboard;