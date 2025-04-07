import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, ZoomControl, AttributionControl } from 'react-leaflet';
import styled from 'styled-components';
import { MarkerData } from '../types';
import CustomMarker from './CustomMarker';
import GeolocationButton from './GeolocationButton';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  markers: MarkerData[];
  center: [number, number];
  zoom: number;
  onMapClick?: (lat: number, lng: number) => void;
  isDarkTheme?: boolean;
  onLocationFound?: (lat: number, lng: number) => void;
}

// Estilos de mapas disponíveis
const mapStyles = {
  street: {
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  terrain: {
    light: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  },
  satellite: {
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> contributors'
  },
  watercolor: {
    light: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    dark: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    attribution: '&copy; <a href="https://stamen.com">Stamen Design</a> contributors'
  }
};

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

const Map: React.FC<MapProps> = ({ 
  markers, 
  center, 
  zoom, 
  onMapClick,
  isDarkTheme = false,
  onLocationFound 
}) => {
  const [mapStyle, setMapStyle] = useState<string>('street');
  const [isLocating, setIsLocating] = useState(false);
  
  const changeMapStyle = (style: string) => {
    if (Object.keys(mapStyles).includes(style)) {
      setMapStyle(style);
    }
  };
  
  // Define o estilo do mapa com base no tema
  const currentTileLayer = mapStyles[mapStyle as keyof typeof mapStyles];
  const tileUrl = isDarkTheme ? currentTileLayer.dark : currentTileLayer.light;

  // Componente para localização do usuário
  const LocationFinder = () => {
    const map = useMap();
    
    useEffect(() => {
      // Listener para quando a localização for encontrada
      const handleLocationFound = (e: any) => {
        const { lat, lng } = e.latlng;
        setIsLocating(false);
        
        if (onLocationFound) {
          onLocationFound(lat, lng);
        }
      };
      
      // Listener para quando ocorrer um erro na localização
      const onLocationError = () => {
        setIsLocating(false);
        alert('Não foi possível encontrar sua localização. Verifique se você permitiu o acesso à localização.');
      };
      
      map.on('locationfound', handleLocationFound);
      map.on('locationerror', onLocationError);
      
      return () => {
        map.off('locationfound', handleLocationFound);
        map.off('locationerror', onLocationError);
      };
    }, [map]);
    
    return null;
  };
  
  // Função para iniciar a busca de localização
  const handleLocate = () => {
    setIsLocating(true);
    
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      const leafletInstance = (mapElement as any)._leaflet_map;
      if (leafletInstance) {
        leafletInstance.locate({ 
          setView: true, 
          maxZoom: 16,
          timeout: 10000,
          enableHighAccuracy: true
        });
      }
    }
  };
  
  return (
    <MapWrapper>
      <StylesBar>
        <StyleButton isActive={mapStyle === 'street'} onClick={() => changeMapStyle('street')}>
          Padrão
        </StyleButton>
        <StyleButton isActive={mapStyle === 'terrain'} onClick={() => changeMapStyle('terrain')}>
          Terreno
        </StyleButton>
        <StyleButton isActive={mapStyle === 'satellite'} onClick={() => changeMapStyle('satellite')}>
          Satélite
        </StyleButton>
        <StyleButton isActive={mapStyle === 'watercolor'} onClick={() => changeMapStyle('watercolor')}>
          Aquarela
        </StyleButton>
      </StylesBar>
      
      <GeolocationButtonContainer>
        <GeolocationButton onLocate={handleLocate} isLoading={isLocating} />
      </GeolocationButtonContainer>
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution={currentTileLayer.attribution}
          url={tileUrl}
        />
        <ZoomControl position="bottomright" />
        <AttributionControl position="bottomleft" prefix={false} />
        <ChangeView center={center} zoom={zoom} />
        <LocationFinder />
        {onMapClick && <MapEvents onMapClick={onMapClick} />}
        
        {markers.map((marker) => (
          <CustomMarker key={marker.id} marker={marker} />
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.mapBg};
  }

  .highlight-marker {
    filter: hue-rotate(120deg);
  }
  
  .leaflet-control-attribution {
    font-size: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 2px 5px;
    border-radius: 3px;
  }
  
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: ${({ theme }) => theme.shadow} !important;
  }
  
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    background-color: ${({ theme }) => theme.cardBg} !important;
    color: ${({ theme }) => theme.text} !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    border-radius: 4px !important;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${({ theme }) => theme.accent} !important;
      color: white !important;
    }
  }
`;

const StylesBar = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 1000;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.cardBg}CC;
  padding: 5px;
  backdrop-filter: blur(4px);
`;

interface StyleButtonProps {
  isActive: boolean;
}

const StyleButton = styled.button<StyleButtonProps>`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid ${({ theme, isActive }) => isActive ? theme.accent : theme.border};
  background-color: ${({ theme, isActive }) => isActive ? theme.accent : 'transparent'};
  color: ${({ theme, isActive }) => isActive ? '#ffffff' : theme.text};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, isActive }) => isActive ? theme.accent : theme.background};
    border-color: ${({ theme }) => theme.accent};
  }
`;

const GeolocationButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
`;

export default Map; 