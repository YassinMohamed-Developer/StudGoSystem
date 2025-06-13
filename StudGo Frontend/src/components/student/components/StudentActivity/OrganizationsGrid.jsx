import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Activity, Users, MapPin, Globe, Building2, BookOpen } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OrganizationsGrid = ({ filteredOrganizations }) => {
  // Using a data URI instead of placeholder.com which was causing network errors
  // This creates a blue circle with "SA" text as the default image
  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%230A84FF'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' font-weight='bold' text-anchor='middle' fill='white'%3ESA%3C/text%3E%3C/svg%3E";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOrganizations.map((org, index) => (
        <motion.div
          key={org.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full border border-transparent hover:border-blue-500/30 flex flex-col">
            {/* Map Preview */}
            {org.latitude && org.longitude && (
              <div className="h-32 relative overflow-hidden">
                <MapContainer
                  center={[org.latitude, org.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  boxZoom={false}
                  keyboard={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[org.latitude, org.longitude]}>
                    <Popup>
                      <div className="text-gray-800">
                        <h3 className="font-semibold">{org.name}</h3>
                        <p className="text-sm">{org.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-sm">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="truncate max-w-[200px]">{org.address}</span>
                </div>
              </div>
            )}

            <div className="p-4 flex-grow flex flex-col">
              {/* Header with Image/Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 overflow-hidden">
                  {org.pictureUrl ? (
                    <img
                      src={org.pictureUrl}
                      alt={org.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImageUrl;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{org.name}</h2>
                  <p className="text-sm text-gray-400">{org.role}</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 text-sm flex-grow">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="truncate">{org.contactEmail || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Founded: {new Date(org.foundingDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags if available */}
              {org.tags && org.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {org.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full group-hover:bg-blue-500/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {org.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                      +{org.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Details Button */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Link to={`/studentactivity/${org.id}`}>
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Details</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrganizationsGrid;