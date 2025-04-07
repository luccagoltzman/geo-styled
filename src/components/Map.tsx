import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';
import { MarkerData } from '../types';

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

const Map: React.FC<MapProps> = ({ markers, center, zoom, onMapClick }) => {
  // Ícones personalizados para os marcadores
  const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const highlightIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [1, -34],
    className: 'highlight-marker'
  });

  const handleMapClick = (e: any) => {
    if (onMapClick) {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    }
  };

  return (
    <MapWrapper>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          if (onMapClick) {
            map.on('click', handleMapClick);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={marker.type === 'highlight' ? highlightIcon : defaultIcon}
          >
            <Popup>
              <PopupContent>
                <PopupTitle>{marker.title}</PopupTitle>
                <PopupDescription>{marker.description}</PopupDescription>
              </PopupContent>
            </Popup>
          </Marker>
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

const PopupContent = styled.div`
  padding: 8px;
  max-width: 250px;
`;

const PopupTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.accent};
  font-size: 16px;
`;

const PopupDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export default Map; 