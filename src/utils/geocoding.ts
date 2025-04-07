import axios from 'axios';

interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

/**
 * Realiza a geocodificação de um endereço ou local usando o serviço Nominatim (OpenStreetMap)
 * @param query - O endereço ou local a ser geocodificado
 * @returns Promise com resultados da geocodificação
 */
export const geocodeAddress = async (query: string): Promise<GeocodeResult[]> => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
      },
      headers: {
        'User-Agent': 'Geo-Styled/1.0',
      },
    });

    return response.data.map((result: any) => ({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name,
    }));
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return [];
  }
}; 