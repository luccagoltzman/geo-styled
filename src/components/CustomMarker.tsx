import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';
import { MarkerData } from '../types';

interface CustomMarkerProps {
  marker: MarkerData;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
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

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={marker.type === 'highlight' ? highlightIcon : defaultIcon}
    >
      <Popup>
        <PopupContent>
          <PopupTitle>{marker.title}</PopupTitle>
          <PopupDescription>{marker.description}</PopupDescription>
          <Coordinates>
            Latitude: {marker.lat.toFixed(4)}, Longitude: {marker.lng.toFixed(4)}
          </Coordinates>
        </PopupContent>
      </Popup>
    </Marker>
  );
};

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
  margin: 0 0 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Coordinates = styled.p`
  margin: 8px 0 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.text}99;
  font-style: italic;
`;

export default CustomMarker; 