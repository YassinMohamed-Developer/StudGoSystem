import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle,
  Tag,
  ExternalLink,
  Loader2,
  Share2,
  Info,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  ChevronRight,
  AlertCircle,
  Lock,
  Unlock,
  User,
  Mic,
  X
} from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { axiosInstance } from '../../../lib/axios';
import ActivityMap from '../components/Activities/ActivityMap';
import { toast } from 'react-hot-toast';

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance().get(`/activity/${id}`);
        if (response.data.isSuccess) {
          setActivity(response.data.data);
          
          // Check if user has applied to this activity
          try {
            await axiosInstance().get(`/activity/student/applied`, {
              params: { activityId: id }
            });
            setIsApplied(true);
          } catch (error) {
            // If 404, user hasn't applied
            if (error.response && error.response.status === 404) {
              setIsApplied(false);
            } else {
              console.error('Error checking applied status:', error);
            }
          }
        } else {
          toast.error('Failed to load activity details');
          navigate('/activities');
        }
      } catch (error) {
        console.error('Error fetching activity details:', error);
        toast.error('Failed to load activity details');
        navigate('/activities');
      } finally {
        setLoading(false);
      }
    };

    const fetchActivityContents = async () => {
      try {
        setContentLoading(true);
        const response = await axiosInstance().get(`/content/activity/${id}`);
        if (response.data.isSuccess) {
          // Check if the response data is an array or a single object
          const contentData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
          setContents(contentData);
        } else {
          console.error('Failed to load activity contents:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching activity contents:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchActivityDetails();
    fetchActivityContents();
  }, [id, navigate]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await axiosInstance().post(`/activity/${id}/apply`);
      setIsApplied(true);
      toast.success('Successfully applied to the activity!');
    } catch (error) {
      console.error('Error applying to activity:', error);
      
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors;
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach(message => {
              toast.error(message);
            });
          } else if (typeof errorMessages === 'object') {
            Object.values(errorMessages).forEach(messages => {
              if (Array.isArray(messages)) {
                messages.forEach(message => toast.error(message));
              } else {
                toast.error(messages);
              }
            });
          } else {
            toast.error(errorMessages);
          }
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to apply to the activity. Please check your input and try again.');
        }
      } else if (error.response && error.response.status === 401) {
        toast.error('You need to be logged in to apply for activities.');
      } else {
        toast.error('Failed to apply to the activity. Please try again later.');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: `Check out this activity: ${activity.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    }
  };

  const openContentModal = (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

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

  // Format category display
  const formatCategory = (categoryValue) => {
    if (!categoryValue) return "Category";
    
    // Handle specific category values (case-insensitive)
    if (categoryValue.toLowerCase() === "technical") return "Technical";
    if (categoryValue.toLowerCase() === "nontechnical") return "Non-Technical";
    
    // Return the original value if it doesn't match any specific case
    return categoryValue;
  };

  // Calculate days until activity
  const getDaysUntilActivity = () => {
    if (!activity || !activity.startDate) return null;
    
    const today = new Date();
    const activityDate = new Date(activity.startDate);
    const diffTime = activityDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!activity?.deadlineDate) return false;
    return isAfter(new Date(), parseISO(activity.deadlineDate));
  };

  // Check if activity is open for applications
  const isActivityOpen = () => {
    return activity?.isOpened === true;
  };

  // Check if activity has started
  const hasActivityStarted = () => {
    if (!activity?.startDate) return false;
    return isAfter(new Date(), parseISO(activity.startDate));
  };

  // Check if user can apply
  const canApply = () => {
    return !isApplied && !isDeadlinePassed() && !hasActivityStarted();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-white text-lg">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Activity not found</p>
          <button 
            onClick={() => navigate('/activities')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  // Default image if posterUrl is null or empty
  const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const imageUrl = activity.posterUrl && activity.posterUrl.trim() !== '' ? activity.posterUrl : defaultImage;

  // Check if agendaUrl exists and is not empty
  const hasAgenda = activity.agendaUrl && activity.agendaUrl.trim() !== '';
  
  // Get days until activity
  const daysUntil = getDaysUntilActivity();
  const isUpcoming = daysUntil && daysUntil !== 'Past';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => navigate('/activities')}
            className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Activity Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-500/30 backdrop-blur-sm text-blue-300 rounded-full text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {activity.activityType || "Activity"}
              </span>
              <span className="px-3 py-1 bg-purple-500/30 backdrop-blur-sm text-purple-300 rounded-full text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {formatCategory(activity.activityCategory)}
              </span>
              {isUpcoming && (
                <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-300 rounded-full text-sm flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {daysUntil}
                </span>
              )}
              {isDeadlinePassed() && (
                <span className="px-3 py-1 bg-red-500/30 backdrop-blur-sm text-red-300 rounded-full text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Deadline Passed
                </span>
              )}
              {isApplied && (
                <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm text-green-300 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Applied
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{activity.title}</h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
              <span>by</span>
              <Link to={`/studentactivity/${activity.studentActivityId}`} className="text-blue-400 hover:text-blue-300">
                {activity.studentActivityName}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">About This Activity</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{activity.description}</p>
                
                {/* Activity Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <CalendarIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Date</p>
                      <p className="text-base text-white">{formatDate(activity.startDate)} - {formatDate(activity.endDate)}</p>
                      <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                        <span>by</span>
                        <Link to={`/studentactivity/${activity.studentActivityId}`} className="text-blue-400 hover:text-blue-300">
                          {activity.studentActivityName}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <ClockIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Time</p>
                      <p className="text-base text-white">{formatTime(activity.startDate)}</p>
                    </div>
                  </div>
                  
                  {activity.deadlineDate && (
                    <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-4">
                      <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">Application Deadline</p>
                        <p className="text-base text-white">{formatDate(activity.deadlineDate)}</p>
                        {isDeadlinePassed() && (
                          <p className="text-sm text-red-400 mt-1">Deadline has passed</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <MapPinIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Location</p>
                      <p className="text-base text-white">{activity.address || "Location TBA"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      <UsersIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Seats</p>
                      <p className="text-base text-white">{activity.numberOfSeats || "Unlimited"} seats available</p>
                    </div>
                  </div>
                </div>
                
                {/* Activity Contents Section */}
                {contentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : contents.length > 0 ? (
                  <div className="mb-8 bg-gray-700/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Activity Contents
                    </h3>
                    
                    <div className="space-y-4">
                      {contents.map((content, index) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full mt-1 ${
                                content.contentType === "Session" 
                                  ? "bg-blue-500/20" 
                                  : "bg-purple-500/20"
                              }`}>
                                {content.contentType === "Session" ? (
                                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <Mic className="w-4 h-4 text-purple-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-400">{content.contentType}</p>
                                <p className="text-base text-white font-medium">{content.title}</p>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => openContentModal(content)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg"
                            >
                              Details
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                
                {/* Map for location */}
                {activity.latitude && activity.longitude && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-blue-400" />
                      Location Map
                    </h3>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <ActivityMap 
                        latitude={activity.latitude} 
                        longitude={activity.longitude} 
                        title={activity.title}
                        height="h-80"
                      />
                    </div>
                  </div>
                )}
                
                {/* Additional Information */}
                <div className="bg-gray-700/30 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {hasAgenda && (
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">Agenda</p>
                          <a 
                            href={activity.agendaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            View Agenda <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {activity.requirements && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">Requirements</p>
                          <p className="text-gray-300">{activity.requirements}</p>
                        </div>
                      </div>
                    )}
                    
                    {activity.notes && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">Notes</p>
                          <p className="text-gray-300">{activity.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Activity Status</h2>
                
                {/* Status Badge */}
                <div className="mb-6">
                  {isApplied ? (
                    <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>You've applied to this activity</span>
                    </div>
                  ) : isUpcoming ? (
                    <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>This activity is {daysUntil}</span>
                    </div>
                  ) : (
                    <div className="bg-gray-500/20 text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      <span>This activity has passed</span>
                    </div>
                  )}
                  
                  {isDeadlinePassed() && (
                    <div className="mt-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>Application deadline has passed</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isApplied && canApply() && (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply Now
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                  
                  {!isApplied && !canApply() && (
                    <button
                      disabled
                      className="w-full bg-gray-700 text-gray-400 py-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      {!isActivityOpen() ? 'Applications Closed' : 
                       isDeadlinePassed() ? 'Deadline Passed' : 
                       hasActivityStarted() ? 'Activity Already Started' : 'Cannot Apply'}
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  )}
                  
                  {hasAgenda && (
                    <a
                      href={activity.agendaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                    >
                      View Agenda
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Activity
                  </button>
                </div>
                
                {/* Share Options */}
                {showShareOptions && (
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Share Activity</h3>
                    <div className="flex">
                      <input 
                        type="text" 
                        value={window.location.href} 
                        readOnly 
                        className="flex-1 bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded-l-lg focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied to clipboard!');
                        }}
                        className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-500 transition-colors text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedContent.contentType === "Session" ? (
                    <CalendarIcon className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Mic className="w-6 h-6 text-purple-400" />
                  )}
                  {selectedContent.contentType} Details
                </h2>
                <button 
                  onClick={() => setShowContentModal(false)}
                  className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{selectedContent.title}</h3>
                  {selectedContent.description && (
                    <p className="text-gray-300">{selectedContent.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedContent.hostName && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-500/20 p-2 rounded-full">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-400">Host</h4>
                      </div>
                      <p className="text-white">{selectedContent.hostName}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <ClockIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-400">Time</h4>
                    </div>
                    <p className="text-white">
                      {formatDate(selectedContent.startDate)} - {formatDate(selectedContent.endDate)}
                    </p>
                  </div>
                </div>
                
                {/* Additional content information can be added here */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Additional Information</h4>
                  <p className="text-gray-300">
                    This {selectedContent.contentType.toLowerCase()} is part of the {activity.title} activity. 
                    Please arrive on time and bring any necessary materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetails;