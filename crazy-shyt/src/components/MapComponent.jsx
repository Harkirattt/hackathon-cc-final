"use client";

import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Custom Marker Icon (similar to Google Maps pin)
const createCustomIcon = () => {
  return L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
};

// Search Component
const SearchBar = ({ setPosition }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const map = useMap();
  const inputRef = useRef(null);

  // Debounced search for suggestions
  const fetchSuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`
      );
      const data = await response.json();
      
      // Limit to top 5 suggestions
      setSuggestions(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounce input to reduce unnecessary API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    const { lat, lon, display_name } = location;
    const newPosition = [parseFloat(lat), parseFloat(lon)];
    
    // Determine zoom level based on location complexity
    const zoomLevel = display_name.includes(',') ? 
      (display_name.split(',').length > 2 ? 12 : 8) : 
      10;

    // Update map
    setPosition(newPosition);
    map.setView(newPosition, zoomLevel);
    
    // Clear suggestions and input
    setSuggestions([]);
    setQuery(display_name);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '400px'
    }}>
      <div style={{
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        borderRadius: '4px'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Google Maps"
          style={{
            width: '100%',
            padding: '10px 40px 10px 15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: 'white',
            color: 'black'  // Explicitly set text color to black
          }}
        />
        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#5f6368'
        }}>
          🔍
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {suggestions.map((location, index) => (
              <li 
                key={index}
                onClick={() => handleLocationSelect(location)}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f1f1',
                  color: 'black'  // Black text for suggestions
                }}
              >
                {location.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Main Map Component
const MapComponent = () => {
  const [position, setPosition] = useState([19.0760, 72.8777]); // Default: Mumbai

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ 
        height: "600px", 
        width: "100%",
        zIndex: 1 
      }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SearchBar setPosition={setPosition} />
      <Marker 
        position={position} 
        icon={createCustomIcon()}
      >
        <Popup>
          Latitude: {position[0]}, Longitude: {position[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;