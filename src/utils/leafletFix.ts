import L from 'leaflet';

// Corrige o problema dos ícones de marcador do Leaflet em aplicações React
const fixLeafletIcon = () => {
  // Conserta o problema dos ícones não aparecerem em aplicações React
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export default fixLeafletIcon; 