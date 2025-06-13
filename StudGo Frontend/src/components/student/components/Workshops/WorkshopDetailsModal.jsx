import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, BookOpen, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../../../lib/axios';
import WorkshopMap from './WorkshopMap';
import { toast } from 'react-hot-toast';

const WorkshopDetailsModal = ({ workshop, onClose, onApply }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    agenda: true,
    requirements: true,
    benefits: true
  });

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date TBD';
      
      // Parse the ISO date string
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Format the date with options
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date TBD';
    }
  };

  // Extract time from ISO date string
  const extractTimeFromDate = (dateString) => {
    try {
      if (!dateString) return 'TBD';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'TBD';
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error extracting time from date:', error);
      return 'TBD';
    }
  };

  // Format time to 12-hour format with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'TBD';
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle workshop application
  const handleApply = async () => {
    try {
      // Call the API directly to apply for the workshop
      await axiosInstance()({
        method: 'post',
        url: `/activity/${workshop.id}/apply`
      });
      
      toast.success('Successfully applied to the workshop!');
      onClose();
    } catch (error) {
      console.error('Error applying to workshop:', error);
      
      // Handle 400 error response with validation errors
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.errors) {
        // Display each error message in a separate toast
        error.response.data.errors.forEach(errMsg => {
          toast.error(errMsg);
        });
      } else {
        // Generic error message for other types of errors
        toast.error(error.response?.data?.message || 'Failed to apply to the workshop. Please try again later.');
      }
    }
  };

  // Fetch workshop content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance()({
          method: 'get',
          url: `/content/activity/${workshop.id}`
        });
        
        if (response.data && response.data.data) {
          setContent(response.data.data);
          setError(null);
        } else {
          setError('No content available for this workshop');
        }
      } catch (err) {
        console.error('Error fetching workshop content:', err);
        setError('Failed to load workshop content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (workshop) {
      fetchContent();
    }
  }, [workshop]);

  if (!workshop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{workshop.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            {/* Main content with image and details side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left side - Image */}
              <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                <img 
                  src={workshop.posterUrl || 'https://via.placeholder.com/600x400?text=Workshop+Image'} 
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    {workshop.activityCategory || 'Workshop'}
                  </span>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>{formatDate(workshop.startDate)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>
                    {extractTimeFromDate(workshop.startDate)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>{workshop.address || 'Location TBD'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>
                    {workshop.numberOfSeats 
                      ? (workshop.numberOfSeats === "TBD" 
                          ? "Capacity TBD" 
                          : `${workshop.numberOfSeats} spots available`)
                      : "Unlimited spots available"}
                  </span>
                </div>

                {/* Map for location */}
                {workshop.address && (
                  <div className="h-48 rounded-lg overflow-hidden border border-gray-700">
                    <WorkshopMap 
                      workshops={[workshop]} 
                      onWorkshopClick={() => {}} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description section */}
            <div className="mb-6">
              <button 
                onClick={() => toggleSection('description')}
                className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Description</h3>
                </div>
                {expandedSections.description ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {expandedSections.description && (
                <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  ) : error ? (
                    <p className="text-red-400">{error}</p>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-line">
                        {content?.description || workshop.description || 'No description available.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Agenda section */}
            <div className="mb-6">
              <button 
                onClick={() => toggleSection('agenda')}
                className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Agenda</h3>
                </div>
                {expandedSections.agenda ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {expandedSections.agenda && (
                <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  ) : error ? (
                    <p className="text-red-400">{error}</p>
                  ) : content?.agenda ? (
                    <ul className="space-y-3">
                      {content.agenda.map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{item.title}</h4>
                            <p className="text-sm text-gray-400">{item.time}</p>
                            <p className="text-gray-300 mt-1">{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No agenda available for this workshop.</p>
                  )}
                </div>
              )}
            </div>

            {/* Requirements section */}
            {content?.requirements && content.requirements.length > 0 && (
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('requirements')}
                  className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Requirements</h3>
                  </div>
                  {expandedSections.requirements ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.requirements && (
                  <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {content.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Benefits section */}
            {content?.benefits && content.benefits.length > 0 && (
              <div className="mb-6">
                <button 
                  onClick={() => toggleSection('benefits')}
                  className="flex items-center justify-between w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Benefits</h3>
                  </div>
                  {expandedSections.benefits ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.benefits && (
                  <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {content.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailsModal; 