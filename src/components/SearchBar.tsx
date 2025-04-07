import React, { useState } from 'react';
import styled from 'styled-components';
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

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    setIsLoading(true);
    setIsResultsVisible(true);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          type="text"
          placeholder="Buscar cidade ou local..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearch}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SearchButton>
      </SearchInputContainer>

      {isResultsVisible && (
        <ResultsContainer>
          {isLoading ? (
            <LoadingMessage>Buscando...</LoadingMessage>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <ResultItem
                key={index}
                onClick={() => handleResultClick(result)}
              >
                {result.display_name}
              </ResultItem>
            ))
          ) : (
            <NoResults>Nenhum resultado encontrado</NoResults>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 1000;
`;

const SearchInputContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBg};
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  width: 100%;
  font-size: 16px;
  border: none;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.text}99;
  }
`;

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  max-height: 300px;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const LoadingMessage = styled.div`
  padding: 12px 16px;
  color: ${({ theme }) => theme.text};
  font-style: italic;
`;

const NoResults = styled.div`
  padding: 12px 16px;
  color: ${({ theme }) => theme.text};
  font-style: italic;
`;

export default SearchBar; 