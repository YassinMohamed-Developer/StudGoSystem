import React from 'react';
import { 
  X, 
  CalendarIcon, 
  MapPin, 
  Users, 
  BadgeInfo,
  ChevronRight,
  FileText,
  Link,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import EventMap from './EventMap';

function EventDetailsModal({ event, onClose, onApply, isApplied }) {
  if (!event) return null;

  // Check if agendaUrl exists and is not empty
  const hasAgenda = event.agendaUrl && event.agendaUrl.trim() !== '';
  
  // Check if we have valid coordinates for the map
  const hasLocation = event.latitude && event.longitude;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const hasValidCoordinates = event.latitude && event.longitude && 
    !isNaN(parseFloat(event.latitude)) && !isNaN(parseFloat(event.longitude));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Event Image */}
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            {event.posterUrl ? (
              <img 
                src={event.posterUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">{event.title.charAt(0)}</span>
              </div>
            )}
            
            {/* Applied Tag */}
            {isApplied && (
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Applied
              </div>
            )}
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium">Date</p>
                    <p className="text-white">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                  </div>
                </div>
                
                {event.address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300 font-medium">Location</p>
                      <p className="text-white">{event.address}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium">Time</p>
                    <p className="text-white">{new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 mr-3 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium">Capacity</p>
                    <p className="text-white">{event.numberOfSeats || "Unlimited"} spots</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
            </div>
          </div>
          
          {/* Map */}
          {hasValidCoordinates && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Location Map</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <EventMap 
                  latitude={parseFloat(event.latitude)} 
                  longitude={parseFloat(event.longitude)} 
                  title={event.title}
                />
              </div>
            </div>
          )}
          
          {/* Resources */}
          {event.resources && event.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {event.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            
            <button
              onClick={() => onApply(event.id)}
              disabled={isApplied}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isApplied 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal; 