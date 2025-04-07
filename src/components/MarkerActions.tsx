import React, { useRef } from 'react';
import styled from 'styled-components';
import { MarkerData } from '../types';
import { exportMarkers, importMarkers } from '../utils/markersUtils';

interface MarkerActionsProps {
  markers: MarkerData[];
  onImport: (markers: MarkerData[]) => void;
}

const MarkerActions: React.FC<MarkerActionsProps> = ({ markers, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportMarkers(markers);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const importedMarkers = await importMarkers(files[0]);
        onImport(importedMarkers);
      } catch (error) {
        console.error('Erro ao importar marcadores:', error);
        alert('Erro ao importar marcadores. Verifique se o arquivo é válido.');
      }
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = '';
    }
  };

  return (
    <ActionsContainer>
      <ActionButton onClick={handleExport} title="Exportar marcadores">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <ButtonText>Exportar</ButtonText>
      </ActionButton>
      
      <ActionButton onClick={handleImportClick} title="Importar marcadores">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 10v12m0-12l-4 4m4-4l4 4M2 7l.621-2.485A2 2 0 0 1 4.561 3h14.878a2 2 0 0 1 1.94 1.515L22 7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <ButtonText>Importar</ButtonText>
      </ActionButton>
      
      <HiddenInput 
        type="file" 
        ref={fileInputRef} 
        accept=".json" 
        onChange={handleFileChange} 
      />
    </ActionsContainer>
  );
};

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.accent};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
    color: white;
  }
`;

const ButtonText = styled.span`
  font-size: 14px;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default MarkerActions; 