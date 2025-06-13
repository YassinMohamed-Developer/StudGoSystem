import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  CheckCircle,
  Tag,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

function ActivityCard({ activity, onApply, isApplied }) {
  const navigate = useNavigate();
  const {
    title,
    description,
    startDate,
    endDate,
    deadlineDate,
    isOpened,
    address,
    activityCategory,
    activityType,
    posterUrl,
    agendaUrl,
    latitude,
    longitude,
    studentActivityName,
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

  // Format category display
  const formatCategory = (categoryValue) => {
    if (!categoryValue) return "Category";
    
    // Handle specific category values (case-insensitive)
    if (categoryValue.toLowerCase() === "technical") return "Technical";
    if (categoryValue.toLowerCase() === "nontechnical") return "Non-Technical";
    
    // Return the original value if it doesn't match any specific case
    return categoryValue;
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!deadlineDate) return false;
    return isAfter(new Date(), parseISO(deadlineDate));
  };

  // Check if activity is open for applications
  const isActivityOpen = () => {
    return isOpened === true;
  };

  // Check if activity has started
  const hasActivityStarted = () => {
    if (!startDate) return false;
    return isAfter(new Date(), parseISO(startDate));
  };

  const handleViewDetails = () => {
    navigate(`/activities/${activity.id}`);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl">
      {/* Image Section */}
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isApplied && (
            <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Applied
            </span>
          )}
          {isDeadlinePassed() && (
            <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Deadline Passed
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                {formatCategory(activityCategory)}
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                {activityType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>by</span>
              <Link to={`/studentactivity/${activity.studentActivityId}`} className="text-blue-400 hover:text-blue-300">
                {studentActivityName}
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>

        {/* Activity Details */}
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
            <span className="text-sm">{activity.numberOfSeats === 0 ? "0" : activity.numberOfSeats || "Unlimited"} seats available</span>
          </div>
          {deadlineDate && (
            <div className="flex items-center gap-2 text-gray-300 col-span-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm">Deadline: {formatDate(deadlineDate)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
          {isApplied && (
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Applied
            </span>
          )}
          {isDeadlinePassed() && !isApplied && (
            <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Deadline Passed
            </span>
          )}
          {hasActivityStarted() && !isApplied && (
            <span className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Activity Started
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityCard; 