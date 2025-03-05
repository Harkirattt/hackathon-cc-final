"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ClientMap = ({ filteredHouseLocations }) => {
  return (
    <MapContainer 
      center={[19.0760, 72.8777]} 
      zoom={11} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {filteredHouseLocations.map((house) => (
        <Marker key={house.id} position={[house.lat, house.lng]}>
          <Popup>
            <div>
              <h3 className="font-bold">{house.name}</h3>
              <p>Price: {house.price}</p>
              <p>Type: {house.type}</p>
              <p>Bedrooms: {house.bedrooms}</p>
              <p>Area: {house.area} sq ft</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ClientMap;