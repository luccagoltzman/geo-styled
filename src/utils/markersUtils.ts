import { MarkerData } from '../types';

/**
 * Exporta os marcadores para um arquivo JSON
 * @param markers - Lista de marcadores para exportar
 */
export const exportMarkers = (markers: MarkerData[]): void => {
  try {
    const jsonData = JSON.stringify(markers, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `geo-styled-markers-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar marcadores:', error);
  }
};

/**
 * Importa os marcadores de um arquivo JSON
 * @param file - Arquivo JSON contendo os marcadores
 * @returns Promise com a lista de marcadores importados
 */
export const importMarkers = (file: File): Promise<MarkerData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const markers = JSON.parse(event.target.result as string) as MarkerData[];
          resolve(markers);
        } else {
          reject(new Error('Falha ao ler o arquivo'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsText(file);
  });
}; 