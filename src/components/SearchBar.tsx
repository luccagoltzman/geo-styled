import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para detectar clique fora do componente e fechar resultados
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    setIsLoading(true);
    setIsResultsVisible(true);
    setSelectedIndex(-1);

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchTerm,
          format: 'json',
          limit: 5,
        },
        headers: {
          'User-Agent': 'Geo-Styled/1.0',
        },
      });

      setResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setResults([]);
      setIsResultsVisible(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : 0
      );
    } else if (e.key === 'Escape') {
      setIsResultsVisible(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onLocationSelect(
      parseFloat(result.lat),
      parseFloat(result.lon),
      result.display_name
    );
    setSearchTerm(result.display_name.split(',')[0]);
    setIsResultsVisible(false);
  };

  return (
    <SearchContainer ref={searchContainerRef}>
      <SearchInputContainer>
        <SearchIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Buscar cidade ou local..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsResultsVisible(true);
          }}
        />
        {searchTerm && (
          <ClearButton onClick={() => {
            setSearchTerm('');
            setResults([]);
            setIsResultsVisible(false);
          }}>
            ×
          </ClearButton>
        )}
        <SearchButton onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            "Buscar"
          )}
        </SearchButton>
      </SearchInputContainer>

      {isResultsVisible && (
        <ResultsContainer>
          {isLoading ? (
            <LoadingMessage>
              <SmallLoadingSpinner />
              <span>Buscando locais...</span>
            </LoadingMessage>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <ResultItem
                key={index}
                onClick={() => handleResultClick(result)}
                selected={index === selectedIndex}
              >
                <LocationIcon>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </LocationIcon>
                <ResultContent>
                  <ResultTitle>{result.display_name.split(',')[0]}</ResultTitle>
                  <ResultDescription>{result.display_name}</ResultDescription>
                </ResultContent>
              </ResultItem>
            ))
          ) : searchTerm.length > 0 ? (
            <NoResults>Nenhum resultado encontrado para "{searchTerm}"</NoResults>
          ) : (
            <NoResults>Digite um local para buscar</NoResults>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

const pulseAnimation = keyframes`
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

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 1000;
`;

const SearchInputContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBg};
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40, ${({ theme }) => theme.shadow};
    transform: translateY(-2px);
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: ${({ theme }) => theme.text}99;
`;

const SearchInput = styled.input`
  padding: 14px 16px 14px 0;
  width: 100%;
  font-size: 16px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.text}88;
    transition: color 0.2s ease;
  }
  
  &:focus::placeholder {
    color: ${({ theme }) => theme.text}44;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text}88;
  font-size: 22px;
  padding: 0 6px;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.buttonHoverBg};
    animation: ${pulseAnimation} 0.5s ease;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  max-height: 350px;
  overflow-y: auto;
  animation: ${fadeInDown} 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.accent}66;
    border-radius: 3px;
  }
`;

interface ResultItemProps {
  selected: boolean;
}

const ResultItem = styled.div<ResultItemProps>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  background-color: ${({ theme, selected }) => selected ? `${theme.accent}15` : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => `${theme.accent}15`};
  }
`;

const LocationIcon = styled.div`
  color: ${({ theme }) => theme.accent};
  flex-shrink: 0;
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ResultTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
`;

const ResultDescription = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text}99;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingMessage = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NoResults = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.text}99;
  font-style: italic;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: ${rotateAnimation} 1s linear infinite;
`;

const SmallLoadingSpinner = styled(LoadingSpinner)`
  width: 14px;
  height: 14px;
  border-top-color: ${({ theme }) => theme.accent};
`;

export default SearchBar; 