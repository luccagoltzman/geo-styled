import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css';
import './styles/leaflet.css';
import fixLeafletIcon from './utils/leafletFix';

// Aplica a correção do Leaflet
fixLeafletIcon();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 