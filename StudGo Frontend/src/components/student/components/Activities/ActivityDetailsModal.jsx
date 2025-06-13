import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle,
  Tag,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import ActivityMap from './ActivityMap';

function ActivityDetailsModal({ activity, onClose, onApply, isApplied }) {
  const {
    title,
    description,
    startDate,
    endDate,
    address,
    activityCategory,
    activityType,
    posterUrl,
    agendaUrl,
    latitude,
    longitude,
    studentActivityName,
    numberOfSeats,
    requirements,
    benefits
  } = activity;

  // Format dates
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Default image if posterUrl is null or empty
  const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const imageUrl = posterUrl && posterUrl.trim() !== '' ? posterUrl : defaultImage;

  // Check if agendaUrl exists and is not empty
  const hasAgenda = agendaUrl && agendaUrl.trim() !== '';

  // Check if requirements exist and is not empty
  const hasRequirements = requirements && requirements.trim() !== '';

  // Check if benefits exist and is not empty
  const hasBenefits = benefits && benefits.trim() !== '';

  // Format category display
  const formatCategory = (categoryValue) => {
    if (!categoryValue) return "Category";
    
    // Handle specific category values (case-insensitive)
    if (categoryValue.toLowerCase() === "technical") return "Technical";
    if (categoryValue.toLowerCase() === "nontechnical") return "Non-Technical";
    
    // Return the original value if it doesn't match any specific case
    return categoryValue;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-800/80 text-white p-2 rounded-full hover:bg-gray-700 z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="h-64 relative">
            <img 
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {activityType || "Activity"}
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {formatCategory(activityCategory)}
              </span>
            </div>
            {isApplied && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Applied
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 mb-6">{description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{formatDate(startDate)} - {formatDate(endDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm">{formatTime(startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm">{address || "Location TBA"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Seats</p>
                <p className="text-sm">{numberOfSeats || "Unlimited"} seats available</p>
              </div>
            </div>
          </div>
          
          {hasRequirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
              <p className="text-gray-400">{requirements}</p>
            </div>
          )}
          
          {hasBenefits && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Benefits</h3>
              <p className="text-gray-400">{benefits}</p>
            </div>
          )}
          
          {/* Map for location */}
          {latitude && longitude && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Location Map</h3>
              <ActivityMap 
                latitude={latitude} 
                longitude={longitude} 
                title={title} 
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mt-8">
            {hasAgenda && (
              <a
                href={agendaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2"
              >
                View Agenda
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            {!isApplied && (
              <button
                onClick={() => onApply(activity.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
              >
                Apply Now
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailsModal; 