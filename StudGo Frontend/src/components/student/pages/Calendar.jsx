import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  List,
  Grid,
  Calendar as CalendarView,
  Timer,
  X,
  Info,
  Tag,
  Calendar as CalendarCheck,
  User,
  Building,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Star,
  Zap
} from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  getYear,
  getMonth,
  getDate,
  setYear,
  setMonth,
  setDate,
  parseISO
} from 'date-fns';
import { axiosInstance, chatAxiosInstance } from '../../../lib/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom animation styles
const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
`;

// Event image helper
const getEventImage = (activity) => {
  if (activity.activityType === "Workshop") {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";
  } else if (activity.activityType === "Event") {
    return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";
  } else if (activity.activityType === "Course") {
    return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";
  } else {
    return "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";
  }
};

// Filter options
const generateFilterOptions = () => {
  const years = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), 'MMMM')
  }));
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  return { years, months, days };
};

// Calendar Header Component
const CalendarHeader = ({ currentDate, viewMode, onNavigate, onFilterToggle, showFilters, onFilterChange }) => {
  const { years, months, days } = generateFilterOptions();
  
  const renderCalendarHeader = () => {
    if (viewMode === "month") {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Calendar
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("prev")}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg sm:text-xl font-medium tracking-wide px-2">
              {renderCalendarHeader()}
            </span>
            <button
              onClick={() => onNavigate("next")}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative inline-block">
            <button 
              onClick={onFilterToggle}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                showFilters 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {showFilters && (
              <div className="absolute right-0 top-[calc(100%+4px)] w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                    <select 
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={getYear(currentDate)}
                      onChange={(e) => onFilterChange('year', e.target.value)}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Month</label>
                    <select 
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={getMonth(currentDate)}
                      onChange={(e) => onFilterChange('month', e.target.value)}
                    >
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Day</label>
                    <select 
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={getDate(currentDate)}
                      onChange={(e) => onFilterChange('day', e.target.value)}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// View Mode Toggle Component
const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-lg w-fit">
      <button
        onClick={() => onViewModeChange("month")}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
          viewMode === "month"
            ? "bg-blue-500 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <CalendarView className="w-4 h-4" />
        <span className="hidden sm:inline">Month</span>
      </button>
      <button
        onClick={() => onViewModeChange("week")}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
          viewMode === "week"
            ? "bg-blue-500 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <Grid className="w-4 h-4" />
        <span className="hidden sm:inline">Week</span>
      </button>
      <button
        onClick={() => onViewModeChange("day")}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
          viewMode === "day"
            ? "bg-blue-500 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Day</span>
      </button>
    </div>
  );
};

// Event Details Modal Component
const EventDetailsModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  
  if (!event) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium">
              {event.activityType} {event.activityCategory && `- ${event.activityCategory}`}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <CalendarCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Date & Time</span>
              </div>
              <div className="text-white">
                <div>{format(parseISO(event.startDate), 'EEEE, MMMM d, yyyy')}</div>
                <div className="text-sm text-gray-300">
                  {format(parseISO(event.startDate), 'h:mm a')} - 
                  {format(parseISO(event.endDate), 'h:mm a')}
                </div>
              </div>
            </div>
            
            {event.location && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="text-white">{event.location}</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
            <span>by</span>
            <Link to={`/studentactivity/${event.studentActivityId}`} className="text-blue-400 hover:text-blue-300">
              {event.studentActivityName}
            </Link>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(`/activities/${event.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Map Component
const EventMap = ({ event }) => {
  // Default to a fallback location if coordinates are not available
  const defaultPosition = [1.3521, 103.8198]; // Singapore coordinates as fallback
  
  // Check if event has coordinates
  const hasCoordinates = event.latitude && event.longitude;
  const position = hasCoordinates 
    ? [parseFloat(event.latitude), parseFloat(event.longitude)] 
    : defaultPosition;
  
  return (
    <div className="mt-3 sm:mt-4 h-32 sm:h-40 rounded-lg overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {event.title}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// Activity Insights Component
const ActivityInsights = ({ activities }) => {
  // Calculate insights
  const calculateInsights = () => {
    const now = new Date();
    const upcomingActivities = activities.filter(a => parseISO(a.startDate) > now);
    const pastActivities = activities.filter(a => parseISO(a.startDate) <= now);
    
    // Calculate activity types distribution
    const typeDistribution = activities.reduce((acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    }, {});

    // Find most common activity type
    const mostCommonType = Object.entries(typeDistribution)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      totalActivities: activities.length,
      upcomingCount: upcomingActivities.length,
      pastCount: pastActivities.length,
      mostCommonType
    };
  };

  const insights = calculateInsights();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Activity Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Activities Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 backdrop-blur-sm border border-blue-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-300">Total</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white break-words">{insights.totalActivities}</p>
        </div>

        {/* Upcoming Activities Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 backdrop-blur-sm border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-300">Upcoming</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white break-words">{insights.upcomingCount}</p>
        </div>

        {/* Most Common Type Card */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-300">Common</h3>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white break-words truncate">{insights.mostCommonType}</p>
        </div>
      </div>

      {/* Motivational Quote Box */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x"></div>
        <div className="relative p-4 sm:p-6 text-center">
          <p className="text-base sm:text-lg font-medium text-white mb-2">
            {insights.upcomingCount > 0 
              ? "Stay organized and make the most of your upcoming activities!"
              : "Time to plan your next adventure!"}
          </p>
          <p className="text-xs sm:text-sm text-gray-300">
            {insights.totalActivities > 0 
              ? `You've participated in ${insights.totalActivities} activities so far. Keep going!`
              : "Start your journey by joining your first activity!"}
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 15s ease infinite;
          }
        `}
      </style>
    </div>
  );
};

// Right Sidebar Component
const RightSidebar = ({ upcomingEvents, countdown, conflicts, activities }) => {
  return (
    <div className="space-y-6">
      {/* Upcoming Events Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
            Upcoming Events
          </h2>
        </div>

        <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
                  <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                  {countdown[event.id] ? (
                    <div className="text-xl sm:text-2xl font-bold text-blue-400 tracking-wider">
                      {countdown[event.id].days}d {countdown[event.id].hours}h
                    </div>
                  ) : (
                    <div className="text-xl sm:text-2xl font-bold text-gray-400">Starting soon</div>
                  )}
                  {countdown[event.id] && (
                    <div className="text-xs sm:text-sm text-gray-300 mt-1">
                      {countdown[event.id].minutes}m {countdown[event.id].seconds}s
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-600/50 pt-3 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{event.title}</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {format(parseISO(event.startDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {format(parseISO(event.startDate), 'h:mm a')}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  
                  {/* Event Map */}
                  {(event.latitude && event.longitude) && (
                    <EventMap event={event} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Insights Section */}
      <ActivityInsights activities={activities} />

      {/* Conflicts Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
            Activity Conflicts
          </h2>
        </div>

        <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {!conflicts || conflicts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-lg">No conflicts found in your activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="space-y-3">
                    {conflict.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          idx === 0 ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-white mb-1">{activity.title}</h3>
                          <div className="space-y-1 text-xs text-gray-300">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3" />
                              {format(parseISO(activity.start_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {format(parseISO(activity.start_date), 'h:mm a')} - 
                              {format(parseISO(activity.end_date), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-600/50">
                      <div className="flex items-start gap-2 text-sm text-blue-400">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>{conflict.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(107, 114, 128, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.7);
          }
        `}
      </style>
    </div>
  );
};

// Calendar Grid Component
const CalendarGrid = ({ 
  viewMode, 
  currentDate, 
  selectedDate, 
  activities, 
  onDayClick, 
  onEventClick, 
  shakingEvent 
}) => {
  const getDaysInView = () => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      // Day view - just return the current day
      return [currentDate];
    }
  };

  const getActivitiesForDay = (day) => {
    return activities.filter(activity => {
      const activityDate = parseISO(activity.startDate);
      return isSameDay(activityDate, day);
    });
  };

  const renderMonthView = () => {
    const days = getDaysInView();
    
    return (
      <>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm text-gray-300 font-medium py-2 tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayActivities = getActivitiesForDay(day);
            const dayId = `day-${format(day, 'yyyy-MM-dd')}`;
            return (
              <div
                key={index}
                onClick={() => onDayClick(day)}
                className={`aspect-square rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                  isSameDay(day, selectedDate)
                    ? "ring-2 ring-blue-500 shadow-lg transform scale-105"
                    : isSameMonth(day, currentDate)
                    ? "hover:shadow-md"
                    : "opacity-50"
                } ${shakingEvent === dayId ? 'animate-shake' : ''}`}
              >
                <div className="relative h-full">
                  {dayActivities.length > 0 ? (
                    <>
                      <img 
                        src={getEventImage(dayActivities[0])} 
                        alt={dayActivities[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                        <span className="text-white text-sm font-medium">{format(day, 'd')}</span>
                        {dayActivities.map((activity, idx) => (
                          <div
                            key={idx}
                            onClick={(e) => onEventClick(activity.id, e)}
                            className="text-xs text-white truncate font-medium cursor-pointer"
                          >
                            {activity.title}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-800/30">
                      <span className="text-gray-400 text-sm font-medium">{format(day, 'd')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInView();
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayActivities = getActivitiesForDay(day);
          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              className={`rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                isSameDay(day, selectedDate)
                  ? "ring-2 ring-blue-500 shadow-lg transform scale-105"
                  : "hover:shadow-md"
              }`}
            >
              <div className="text-center mb-2">
                <div className="text-sm text-gray-300 font-medium">{format(day, 'EEE')}</div>
                <div className="text-xl font-bold tracking-wide">{format(day, 'd')}</div>
              </div>
              <div className="h-32 overflow-y-auto space-y-1">
                {dayActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => onEventClick(activity.id, e)}
                    className={`relative h-16 rounded overflow-hidden cursor-pointer ${
                      shakingEvent === activity.id ? 'animate-shake' : ''
                    }`}
                  >
                    <img 
                      src={getEventImage(activity)} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-1">
                      <div className="text-xs font-medium text-white truncate">{activity.title}</div>
                      <div className="text-xs text-white/80">
                        {format(parseISO(activity.startDate), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayActivities = getActivitiesForDay(currentDate);
    
    return (
      <div className="p-4">
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          {Array.from({ length: 24 }).map((_, hour) => {
            const hourActivities = dayActivities.filter(activity => {
              const activityDate = parseISO(activity.startDate);
              return activityDate.getHours() === hour;
            });

            return (
              <div key={hour} className="flex border-b border-gray-700/50 py-2">
                <div className="w-20 text-right pr-4 text-sm text-gray-300 font-medium">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </div>
                <div className="flex-1 min-h-[60px] space-y-1">
                  {hourActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => onEventClick(activity.id, e)}
                      className={`relative h-16 rounded overflow-hidden cursor-pointer ${
                        shakingEvent === activity.id ? 'animate-shake' : ''
                      }`}
                    >
                      <img 
                        src={getEventImage(activity)} 
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                        <div className="text-xs font-medium text-white">{activity.title}</div>
                        <div className="text-xs text-white/80">
                          {format(parseISO(activity.startDate), 'h:mm a')} - 
                          {format(parseISO(activity.endDate), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
    </div>
  );
};

// Main Calendar Component
export default function Calendar() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState({});
  const [shakingEvent, setShakingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  // Fetch activities and conflicts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance().post('/activity/student/my');
        if (response.data.isSuccess) {
          setActivities(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Set empty array as fallback
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchConflicts = async () => {
      try {
        const response = await chatAxiosInstance().get('/activities/conflicts');
        if (response.data) {
          setConflicts(response.data.conflicts || []);
        }
      } catch (error) {
        console.error('Error fetching conflicts:', error);
        // Set empty array as fallback
        setConflicts([]);
      }
    };

    // Fetch data independently
    fetchActivities();
    fetchConflicts();
  }, []);

  // Calculate countdown for each upcoming event
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const newCountdown = {};
      
      activities.forEach(activity => {
        const startDate = parseISO(activity.startDate);
        if (startDate > now) {
          const diff = startDate - now;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          newCountdown[activity.id] = {
            days,
            hours,
            minutes,
            seconds
          };
        }
      });
      
      setCountdown(newCountdown);
    };
    
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, [activities]);

  // Get upcoming events sorted by date
  const getUpcomingEvents = () => {
    const now = new Date();
    return activities
      .filter(activity => parseISO(activity.startDate) > now)
      .sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate))
      .slice(0, 5); // Show only next 5 events
  };

  // Event handlers
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleDateNavigation = (direction) => {
    let newDate;
    
    if (viewMode === "month") {
      newDate = direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    } else if (viewMode === "week") {
      newDate = direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
    } else {
      newDate = direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1);
    }
    
    setCurrentDate(newDate);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    
    // Only apply shake effect in month view
    if (viewMode === "month") {
      setShakingEvent(`day-${format(day, 'yyyy-MM-dd')}`);
      setTimeout(() => {
        setShakingEvent(null);
      }, 500); // Shake duration
    }
  };

  const handleFilterChange = (type, value) => {
    let newDate = new Date(currentDate);
    
    switch(type) {
      case 'year':
        newDate = setYear(newDate, parseInt(value));
        break;
      case 'month':
        newDate = setMonth(newDate, parseInt(value));
        break;
      case 'day':
        newDate = setDate(newDate, parseInt(value));
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleEventClick = (eventId, e) => {
    e.stopPropagation();
    setShakingEvent(eventId);
    setTimeout(() => {
      setShakingEvent(null);
    }, 500); // Shake duration
    
    // Find and set the selected event
    const event = activities.find(activity => activity.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-8">
      <style>
        {shakeAnimation}
      </style>

      {/* Header Section */}
      <div className="mb-6">
        <CalendarHeader 
          currentDate={currentDate}
          viewMode={viewMode}
          onNavigate={handleDateNavigation}
          onFilterToggle={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ViewModeToggle 
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Row: Calendar and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <CalendarGrid 
              viewMode={viewMode}
              currentDate={currentDate}
              selectedDate={selectedDate}
              activities={activities}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
              shakingEvent={shakingEvent}
            />
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                Upcoming Events
              </h2>
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {getUpcomingEvents().map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
                      <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                      {countdown[event.id] ? (
                        <div className="text-xl sm:text-2xl font-bold text-blue-400 tracking-wider">
                          {countdown[event.id].days}d {countdown[event.id].hours}h
                        </div>
                      ) : (
                        <div className="text-xl sm:text-2xl font-bold text-gray-400">Starting soon</div>
                      )}
                      {countdown[event.id] && (
                        <div className="text-xs sm:text-sm text-gray-300 mt-1">
                          {countdown[event.id].minutes}m {countdown[event.id].seconds}s
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-600/50 pt-3 sm:pt-4">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{event.title}</h3>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          {format(parseISO(event.startDate), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {format(parseISO(event.startDate), 'h:mm a')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      
                      {/* Event Map */}
                      {(event.latitude && event.longitude) && (
                        <EventMap event={event} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Activity Insights and Conflicts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Insights Section */}
          <ActivityInsights activities={activities} />

          {/* Conflicts Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                Activity Conflicts
              </h2>
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {!conflicts || conflicts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg">No conflicts found in your activities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conflicts.map((conflict, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {conflict.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              idx === 0 ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-white mb-1">{activity.title}</h3>
                              <div className="space-y-1 text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-3 h-3" />
                                  {format(parseISO(activity.start_date), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {format(parseISO(activity.start_date), 'h:mm a')} - 
                                  {format(parseISO(activity.end_date), 'h:mm a')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <div className="flex items-start gap-2 text-sm text-blue-400">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>{conflict.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal 
        event={selectedEvent}
        onClose={closeEventDetails}
      />
    </div>
  );
} 