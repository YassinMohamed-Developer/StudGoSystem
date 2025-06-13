import React, { useEffect } from 'react';
import L from 'leaflet';
import { ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function ActivityMap({ latitude, longitude, title, height = "h-64", showLink = true }) {
  // Check if we have valid coordinates for the map
  const hasLocation = latitude && longitude;
  
  useEffect(() => {
    if (!hasLocation) return;
    
    // Fix for default marker icons in Leaflet with React
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    // Create map instance
    const map = L.map(`map-${title.replace(/\s+/g, '-')}`).setView([latitude, longitude], 15);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    L.marker([latitude, longitude]).addTo(map)
      .bindPopup(title)
      .openPopup();
    
    // Cleanup function
    return () => {
      map.remove();
    };
  }, [latitude, longitude, title, hasLocation]);
  
  if (!hasLocation) return null;
  
  return (
    <div>
      <div className={`${height} rounded-lg overflow-hidden`}>
        <div id={`map-${title.replace(/\s+/g, '-')}`} style={{ height: '100%', width: '100%' }}></div>
      </div>
      
      {showLink && (
        <a 
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
        >
          Open in OpenStreetMap
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

export default ActivityMap; 