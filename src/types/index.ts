export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type?: 'default' | 'highlight' | 'custom';
} 