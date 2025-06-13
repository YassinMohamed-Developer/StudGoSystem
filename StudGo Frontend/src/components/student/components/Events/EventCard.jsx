import React from 'react';
import { 
  Clock, 
  MapPin, 
  Users, 
  User,
  BadgeInfo,
  CheckCircle2,
  ChevronRight,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

function EventCard({ event, onViewDetails, onApply, isApplied }) {
  const {
    title,
    description,
    startDate,
    endDate,
    address,
    category,
    posterUrl,
    agendaUrl,
    latitude,
    longitude,
  } = event;

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

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
      <div className="h-48 relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            {category}
          </span>
        </div>
        {isApplied && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Applied
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span className="text-sm">Organized by {event.studentActivityName}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{formatTime(startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{address || "Location TBA"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{event.numberOfSeats || "Unlimited"} seats available</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => onViewDetails(event)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            View Details
            <BadgeInfo className="w-4 h-4" />
          </button>
          
          {hasAgenda && (
            <a
              href={agendaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2"
            >
              View Agenda
              <FileText className="w-4 h-4" />
            </a>
          )}
          
          {!isApplied && (
            <button
              onClick={() => onApply(event.id)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 ${
                isApplied ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : ''
              }`}
            >
              {isApplied ? 'Applied' : 'Apply'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard; 