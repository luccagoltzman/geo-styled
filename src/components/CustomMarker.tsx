import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled, { keyframes } from 'styled-components';
import { MarkerData } from '../types';

interface CustomMarkerProps {
  marker: MarkerData;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isUserLocation = marker.id === 'user-location';

  // Ícones personalizados para os marcadores
  const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: isUserLocation ? 'user-location-marker' : ''
  });

  const highlightIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [1, -34],
    className: 'highlight-marker'
  });

  // Efeito para animar o popup quando é aberto
  useEffect(() => {
    if (isOpen && marker.type === 'highlight') {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, marker.type]);

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={marker.type === 'highlight' || isUserLocation ? highlightIcon : defaultIcon}
      eventHandlers={{
        click: () => setIsOpen(true),
        popupclose: () => setIsOpen(false)
      }}
    >
      <Popup 
        autoClose={false}
        closeOnClick={false}
      >
        <PopupContent>
          <PopupTitle>{marker.title || 'Marcador'}</PopupTitle>
          <PopupDescription>{marker.description}</PopupDescription>
          <Coordinates>
            Latitude: {marker.lat.toFixed(4)}, Longitude: {marker.lng.toFixed(4)}
          </Coordinates>
          {isUserLocation && (
            <UserLocationBadge>
              <LocationPulse />
              Sua localização atual
            </UserLocationBadge>
          )}
        </PopupContent>
      </Popup>
    </Marker>
  );
};

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupContent = styled.div`
  padding: 12px;
  max-width: 250px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const PopupTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.accent};
  font-size: 16px;
  font-weight: 600;
`;

const PopupDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;
`;

const Coordinates = styled.p`
  margin: 8px 0 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.text}99;
  font-style: italic;
`;

const UserLocationBadge = styled.div`
  margin-top: 10px;
  background-color: ${({ theme }) => `${theme.accent}15`};
  color: ${({ theme }) => theme.accent};
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const LocationPulse = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accent};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.accent};
    animation: ${pulseAnimation} 2s infinite;
  }
  
  &::after {
    animation-delay: 0.5s;
  }
`;

export default CustomMarker; 