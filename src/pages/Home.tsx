import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Map, { MAP_STYLES } from '../components/Map';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import MarkerActions from '../components/MarkerActions';
import { defaultMarkers } from '../data/markers';
import { MarkerData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo como padrão
  const [mapZoom, setMapZoom] = useState(13);
  const [currentMapStyle, setCurrentMapStyle] = useState('STANDARD');
  const [isMapReady, setIsMapReady] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 500);

    const bannerTimer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bannerTimer);
    };
  }, []);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setMapCenter([lat, lon]);
    setMapZoom(15);

    const existingMarker = markers.find(
      (marker) => marker.position[0] === lat && marker.position[1] === lon
    );

    if (!existingMarker) {
      setMarkers((prev) => [
        ...prev,
        {
          id: uuidv4(),
          position: [lat, lon] as [number, number],
          description: name,
        },
      ]);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log(`Clique no mapa em: ${lat}, ${lng}`);
  };

  const handleMarkersImport = (importedMarkers: any[]) => {
    setMarkers((prev) => [...prev, ...importedMarkers]);
  };
  
  const handleLocationFound = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(16);
    
    const userLocationMarker = {
      id: 'user-location',
      position: [lat, lng] as [number, number],
      description: 'Sua localização atual',
    };

    setMarkers((prev) => {
      const withoutUserLocation = prev.filter((marker) => marker.id !== 'user-location');
      return [...withoutUserLocation, userLocationMarker];
    });
  };

  return (
    <HomeContainer>
      {showBanner && (
        <WelcomeBanner>
          <BannerContent>
            <h2>Bem-vindo ao Geo-Styled! 🌎</h2>
            <p>Explore mapas interativos com um visual incrível. Use a barra de pesquisa para encontrar locais ou clique no botão de localização.</p>
            <CloseButton onClick={() => setShowBanner(false)}>×</CloseButton>
          </BannerContent>
        </WelcomeBanner>
      )}
      
      <GradientOverlay isMapReady={isMapReady} />
      
      <ContentContainer>
        <Header>
          <Logo>Geo-Styled</Logo>
          <SearchBarContainer>
            <SearchBar onLocationSelect={handleLocationSelect} />
          </SearchBarContainer>
        </Header>
        
        <MapContainer>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            markers={markers}
            onMapClick={handleMapClick}
            onLocationFound={handleLocationFound}
            onStyleChange={(style) => setCurrentMapStyle(style)}
          />
        </MapContainer>
        
        <ActionsBar>
          <ActionInfo>
            <ActionLabel>Marcadores</ActionLabel>
            <ActionValue>{markers.length}</ActionValue>
          </ActionInfo>
          <ActionInfo>
            <ActionLabel>Estilo</ActionLabel>
            <ActionValue>{MAP_STYLES[currentMapStyle as keyof typeof MAP_STYLES].light.name}</ActionValue>
          </ActionInfo>
        </ActionsBar>
      </ContentContainer>
    </HomeContainer>
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

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.3s ease;
`;

const GradientOverlay = styled.div<{ isMapReady: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => `${theme.accent}05`} 0%,
    transparent 50%,
    ${({ theme }) => `${theme.accent}08`} 100%
  );
  opacity: ${({ isMapReady }) => (isMapReady ? 1 : 0)};
  transition: opacity 1s ease;
  z-index: 0;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 100;
  animation: ${slideUp} 0.5s ease-out;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SearchBarContainer = styled.div`
  flex: 1;
  max-width: 500px;
  margin-left: 20px;

  @media (max-width: 768px) {
    max-width: 70%;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.7s ease-out;
  transition: box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 24px;
  margin-top: 16px;
  animation: ${slideUp} 0.5s 0.3s both;
`;

const ActionInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.cardHoverShadow};
  }
`;

const ActionLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text}99;
`;

const ActionValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const WelcomeBanner = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  width: calc(100% - 40px);
  max-width: 800px;
  animation: ${slideUp} 0.5s ease-out, ${fadeIn} 0.5s ease-out;
`;

const BannerContent = styled.div`
  background: ${({ theme }) => theme.primaryGradient};
  color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h2 {
    margin: 0 0 10px 0;
    font-size: 20px;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 15px;
    max-width: 90%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

export default Home; 