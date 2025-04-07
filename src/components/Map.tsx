import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import styled from 'styled-components';
import { MarkerData } from '../types';
import CustomMarker from './CustomMarker';

interface MapProps {
  markers: MarkerData[];
  center: [number, number];
  zoom: number;
  onMapClick?: (lat: number, lng: number) => void;
}

// Componente para centralizar o mapa quando as coordenadas mudam
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Componente para lidar com eventos do mapa
const MapEvents: React.FC<{ onMapClick?: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  
  return null;
};

const Map: React.FC<MapProps> = ({ markers, center, zoom, onMapClick }) => {
  return (
    <MapWrapper>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        {onMapClick && <MapEvents onMapClick={onMapClick} />}
        
        {markers.map((marker) => (
          <CustomMarker key={marker.id} marker={marker} />
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};

  .leaflet-container {
    background-color: ${({ theme }) => theme.mapBg};
  }

  .highlight-marker {
    filter: hue-rotate(120deg);
  }
`;

export default Map; 