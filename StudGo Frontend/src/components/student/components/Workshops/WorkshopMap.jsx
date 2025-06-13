import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
// This is needed because Leaflet's default marker icons don't work properly with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const WorkshopMap = ({ workshops, onWorkshopClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
  // Default center (can be adjusted based on your needs)
  const defaultCenter = [30.0444, 31.2357]; // Cairo, Egypt coordinates
  
  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create map instance if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for each workshop
    const bounds = L.latLngBounds([]);
    let hasValidMarkers = false;
    
    workshops.forEach(workshop => {
      let coordinates;
      
      // If workshop has coordinates, use them
      if (workshop.latitude && workshop.longitude) {
        coordinates = [parseFloat(workshop.latitude), parseFloat(workshop.longitude)];
      } 
      // If no address, use default center
      else if (!workshop.address) {
        coordinates = defaultCenter;
      } 
      // Otherwise, we'll geocode the address
      else {
        // For now, use default center and we'll update with geocoding in a separate effect
        coordinates = defaultCenter;
      }
      
      // Add marker
      const marker = L.marker(coordinates, { icon: customIcon }).addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
      
      // Add popup
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-gray-800">${workshop.title}</h3>
          <p class="text-sm text-gray-600">${workshop.address || "Location TBD"}</p>
        </div>
      `);
      
      // Add click handler
      marker.on('click', () => {
        if (onWorkshopClick) {
          onWorkshopClick(workshop);
        }
      });
      
      // Add to bounds if valid coordinates
      if (coordinates !== defaultCenter) {
        bounds.extend(coordinates);
        hasValidMarkers = true;
      }
    });
    
    // Fit bounds if we have valid markers
    if (hasValidMarkers) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Cleanup function
    return () => {
      // We don't remove the map instance here to avoid re-initialization issues
      // The map will be reused when the component re-renders
    };
  }, [workshops]);
  
  // Geocode addresses that don't have coordinates
  useEffect(() => {
    const geocodeAddresses = async () => {
      for (let i = 0; i < workshops.length; i++) {
        const workshop = workshops[i];
        
        // Skip if workshop already has coordinates or no address
        if ((workshop.latitude && workshop.longitude) || !workshop.address) {
          continue;
        }
        
        try {
          // Use OpenStreetMap Nominatim API for geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(workshop.address)}`
          );
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            const coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            
            // Update marker position
            if (markersRef.current[i]) {
              markersRef.current[i].setLatLng(coordinates);
              
              // Update popup
              markersRef.current[i].setPopupContent(`
                <div class="p-2">
                  <h3 class="font-bold text-gray-800">${workshop.title}</h3>
                  <p class="text-sm text-gray-600">${workshop.address}</p>
                </div>
              `);
            }
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      }
    };
    
    geocodeAddresses();
  }, [workshops]);
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default WorkshopMap; 