import React, { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvent } from 'react-leaflet';
import fixLeafletIcon from '../utils/leafletFix';
import CustomMarker from './CustomMarker';
import { keyframes } from 'styled-components';
import { MarkerData } from '../types';

// Estilos de mapa disponíveis
export const MAP_STYLES = {
  STANDARD: {
    light: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'Padrão'
    },
    dark: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
      name: 'Padrão'
    }
  },
  TERRAIN: {
    light: {
      url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=741a27d0ad654ea3a5ee32e3e82c5f52',
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>',
      name: 'Terreno'
    },
    dark: {
      url: 'https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=741a27d0ad654ea3a5ee32e3e82c5f52',
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>',
      name: 'Terreno'
    }
  },
  SATELLITE: {
    light: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      name: 'Satélite'
    },
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      name: 'Satélite'
    }
  },
  WATERCOLOR: {
    light: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
      name: 'Aquarela'
    },
    dark: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
      name: 'Aquarela'
    }
  }
};

interface Marker {
  id: string;
  position: [number, number];
  description: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  onMapClick?: (lat: number, lng: number) => void;
  onLocationFound?: (lat: number, lng: number) => void;
  onStyleChange?: (styleName: string) => void;
}

// Componente que se encarrega de encontrar a localização do usuário
const LocationFinder: React.FC<{
  onLocationFound: (lat: number, lng: number) => void;
}> = ({ onLocationFound }) => {
  const [isLocating, setIsLocating] = useState(false);
  const map = useMap();
  
  const handleLocationFound = useCallback((e: L.LocationEvent) => {
    setIsLocating(false);
    onLocationFound(e.latlng.lat, e.latlng.lng);
  }, [onLocationFound]);
  
  const onLocationError = useCallback((e: L.ErrorEvent) => {
    setIsLocating(false);
    alert('Acesso à localização negado ou não disponível.');
  }, []);

  useEffect(() => {
    if (isLocating) {
      map.locate({ setView: true, maxZoom: 16 });
    }
    
    map.on('locationfound', handleLocationFound);
    map.on('locationerror', onLocationError);
    
    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, [map, isLocating, handleLocationFound, onLocationError]);

  return (
    <LocationButton onClick={() => setIsLocating(true)} isLocating={isLocating}>
      {isLocating ? (
        <LoadingSpinner />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V2C13 1.45 12.55 1 12 1C11.45 1 11 1.45 11 2V3.06C6.83 3.52 3.52 6.83 3.06 11H2C1.45 11 1 11.45 1 12C1 12.55 1.45 13 2 13H3.06C3.52 17.17 6.83 20.48 11 20.94V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V20.94C17.17 20.48 20.48 17.17 20.94 13H22C22.55 13 23 12.55 23 12C23 11.45 22.55 11 22 11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
            fill="currentColor"
          />
        </svg>
      )}
    </LocationButton>
  );
};

// Componente que captura eventos de clique no mapa
const MapClickHandler: React.FC<{
  onMapClick?: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvent('click', (e) => {
    if (onMapClick) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Componente que gerencia os estilos do mapa
const StyleSelector: React.FC<{
  currentTheme: 'light' | 'dark';
  currentStyle: string;
  onStyleChange: (style: string) => void;
}> = ({ currentTheme, currentStyle, onStyleChange }) => {
  return (
    <StyleSelectorContainer>
      {Object.entries(MAP_STYLES).map(([styleName, _]) => (
        <StyleButton 
          key={styleName} 
          active={currentStyle === styleName}
          onClick={() => onStyleChange(styleName)}
        >
          {MAP_STYLES[styleName as keyof typeof MAP_STYLES][currentTheme].name}
        </StyleButton>
      ))}
    </StyleSelectorContainer>
  );
};

const Map: React.FC<MapProps> = ({
  center = [-22.9068, -43.1729], // Rio de Janeiro como padrão
  zoom = 13,
  markers = [],
  onMapClick,
  onLocationFound,
  onStyleChange
}) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const [currentStyle, setCurrentStyle] = useState<keyof typeof MAP_STYLES>('STANDARD');
  const currentTheme = document.body.dataset.theme === 'dark' ? 'dark' : 'light';
  
  const handleStyleChange = (style: string) => {
    setCurrentStyle(style as keyof typeof MAP_STYLES);
    if (onStyleChange) {
      onStyleChange(style);
    }
  };

  const mapRef = useRef<L.Map | null>(null);
  
  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    map.on('load', () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    });
  };

  return (
    <MapWrapper>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        ref={(mapInstance) => {
          if (mapInstance) {
            handleMapReady(mapInstance);
          }
        }}
      >
        <TileLayer
          url={MAP_STYLES[currentStyle][currentTheme].url}
          attribution={MAP_STYLES[currentStyle][currentTheme].attribution}
        />
        <ZoomControl position="bottomright" />
        {markers.map((marker) => (
          <CustomMarker
            key={marker.id}
            marker={{
              id: marker.id,
              lat: marker.position[0],
              lng: marker.position[1],
              title: marker.id,
              description: marker.description,
              type: 'default'
            }}
          />
        ))}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {onLocationFound && <LocationFinder onLocationFound={onLocationFound} />}
      </MapContainer>
      <StyleSelector 
        currentTheme={currentTheme as 'light' | 'dark'} 
        currentStyle={currentStyle} 
        onStyleChange={handleStyleChange} 
      />
      <MapAttribution>
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a> contributors | Geo-Styled
      </MapAttribution>
    </MapWrapper>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  animation: ${fadeIn} 0.5s ease-out;
`;

const StyleSelectorContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: ${props => props.theme.cardBg};
  border-radius: 24px;
  padding: 6px;
  box-shadow: ${props => props.theme.shadow};
  z-index: 1000;
  border: 1px solid ${props => props.theme.border};
`;

const StyleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? props.theme.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 4px;
  
  &:hover {
    background: ${props => props.active ? props.theme.accent : `${props.theme.accent}20`};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface LocationButtonProps {
  isLocating: boolean;
}

const LocationButton = styled.button<LocationButtonProps>`
  position: absolute;
  bottom: 100px;
  right: 15px;
  width: 44px;
  height: 44px;
  background: ${props => props.theme.cardBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: ${props => props.theme.shadow};
  color: ${props => props.isLocating ? props.theme.accent : props.theme.text};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: ${props => props.theme.accent};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${props => props.isLocating && `
    animation: ${pulse} 2s infinite ease-in-out;
  `}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: ${props => props.theme.accent};
  border-left-color: ${props => props.theme.accent};
  animation: ${rotateAnimation} 1s linear infinite;
`;

const MapAttribution = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 10px;
  padding: 2px 5px;
  background-color: ${props => props.theme.cardBg}BB;
  border-radius: 4px;
  z-index: 500;
  
  a {
    color: ${props => props.theme.accent};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Map; 