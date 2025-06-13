import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { axiosInstance } from '../../../../lib/axios';

const WorkshopCard = ({ workshop, onApply, isApplied }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get category display name
  const getCategoryDisplay = (category) => {
    if (!category) return "Workshop";
    
    // Map API category to display name
    switch(category) {
      case "Technical":
        return "Technical";
      case "NonTechnical":
        return "Non-Technical";
      default:
        return category;
    }
  };

  // Fetch content for the workshop
  const fetchContent = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    try {
      setLoadingContent(true);
      setContentError(null);
      
      const response = await axiosInstance()({
        method: 'get',
        url: `/content/activity/${workshop.id}`
      });

      if (response.data && response.data.data) {
        setContent(response.data.data);
        setIsExpanded(true);
      } else {
        setContentError('No content available');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContentError('Failed to load content');
    } finally {
      setLoadingContent(false);
    }
  };

  // Handle view details click
  const handleViewDetails = () => {
    navigate(`/workshops/${workshop.id}`);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 w-full shadow-lg hover:shadow-xl border border-gray-700/50">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 h-48 md:h-auto relative group">
          <img 
            src={workshop.posterUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"} 
            alt={workshop.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent md:bg-gradient-to-r opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          {/* Applied Tag */}
          {isApplied && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4" />
                Applied
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm backdrop-blur-sm ${
              workshop.activityCategory === "Technical" 
                ? "bg-blue-500/30 text-blue-300" 
                : "bg-purple-500/30 text-purple-300"
            }`}>
              {getCategoryDisplay(workshop.activityCategory)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">{workshop.title}</h3>
                <div className="text-sm text-gray-400 mb-4">
                  {workshop.description && workshop.description.length > 150 
                    ? `${workshop.description.substring(0, 150)}...` 
                    : workshop.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{formatDate(workshop.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">
                    {workshop.startDate ? new Date(workshop.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Time TBD"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{workshop.address || "Location TBD"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">
                    {workshop.numberOfSeats === "TBD" || workshop.numberOfSeats === null || workshop.numberOfSeats === undefined
                      ? "Capacity TBD"
                      : `${workshop.numberOfSeats} seats`}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              {isExpanded && (
                <div className="mt-4 mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600/30">
                  <h4 className="text-lg font-medium text-white mb-3">Workshop Content</h4>
                  
                  {loadingContent ? (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  ) : contentError ? (
                    <p className="text-red-400 text-sm">{contentError}</p>
                  ) : content.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {content.map((item) => (
                        <span 
                          key={item.id} 
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No content available</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={fetchContent}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span className="text-sm">Hide Content</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span className="text-sm">Show Content</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleViewDetails}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard; 