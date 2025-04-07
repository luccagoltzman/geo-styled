import React, { useState } from 'react';
import styled from 'styled-components';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import MarkerActions from '../components/MarkerActions';
import { defaultMarkers } from '../data/markers';
import { MarkerData } from '../types';

interface HomeProps {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const Home: React.FC<HomeProps> = ({ toggleTheme, isDarkTheme }) => {
  const [markers, setMarkers] = useState<MarkerData[]>(defaultMarkers);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-14.2350, -51.9253]); // Centro do Brasil
  const [mapZoom, setMapZoom] = useState(4);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setMapCenter([lat, lon]);
    setMapZoom(13);

    // Verificar se já existe um marcador com este nome
    const exists = markers.some(marker => 
      marker.lat === lat && marker.lng === lon
    );

    if (!exists) {
      const newMarker: MarkerData = {
        id: `marker-${Date.now()}`,
        lat,
        lng: lon,
        title: name.split(',')[0],
        description: name,
        type: 'highlight'
      };
      
      setMarkers(prev => [...prev, newMarker]);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log(`Clicou em: Lat ${lat}, Lng ${lng}`);
  };

  const handleMarkersImport = (importedMarkers: MarkerData[]) => {
    setMarkers(prev => [...prev, ...importedMarkers]);
  };

  return (
    <PageContainer>
      <Header>
        <Logo>🗺️ Geo-Styled</Logo>
        <ControlsContainer>
          <SearchBarContainer>
            <SearchBar onLocationSelect={handleLocationSelect} />
          </SearchBarContainer>
          <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        </ControlsContainer>
      </Header>
      <ActionsBar>
        <MarkerActions markers={markers} onImport={handleMarkersImport} />
        <MarkerCount>{markers.length} marcadores</MarkerCount>
      </ActionsBar>
      <MapContainer>
        <Map 
          markers={markers} 
          center={mapCenter} 
          zoom={mapZoom} 
          onMapClick={handleMapClick}
        />
      </MapContainer>
      <Footer>
        <FooterText>
          Geo-Styled &copy; {new Date().getFullYear()} | 
          Desenvolvido com React, Leaflet e Styled Components
        </FooterText>
      </Footer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.headerBg};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  color: ${({ theme }) => theme.accent};
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchBarContainer = styled.div`
  width: 400px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MapContainer = styled.main`
  flex: 1;
  padding: 24px;
  min-height: 500px;
`;

const Footer = styled.footer`
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.headerBg};
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

export default Home; 