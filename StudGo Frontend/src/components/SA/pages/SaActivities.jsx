import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Calendar, 
  Users, 
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Image,
  FileText,
  Lock,
  Unlock
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { axiosInstance, getSAIdFromToken } from "../../../lib/axios";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from "react-router-dom";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || null);
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  // Update position when initialPosition changes
  useEffect(() => {
    if (initialPosition && Array.isArray(initialPosition) && initialPosition.length === 2) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPosition = e.target.getLatLng();
          setPosition(newPosition);
          onLocationSelect(newPosition);
        },
      }}
    />
  );
}

function SaActivities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longitude: 0,
    latitude: 0,
    startDate: "",
    endDate: "",
    deadlineDate: "",
    numberOfSeats: 0,
    activityType: "Workshop",
    activityCategory: "Technical",
    address: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isDeletingAgenda, setIsDeletingAgenda] = useState(false);
  const [showDeleteAgendaModal, setShowDeleteAgendaModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // Default to Cairo coordinates
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Define fetchActivities function outside useEffect
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const saId = getSAIdFromToken();
      if (!saId) {
        toast.error("No SA ID found");
        navigate("/login");
        return;
      }

      const response = await axiosInstance().get(`/activity/sa/${saId}`);
      if (response.data?.isSuccess) {
        const activitiesData = response.data.data || [];
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);
      } else {
        toast.error(response.data?.message || "Failed to fetch activities");
        setActivities([]);
        setFilteredActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error(error.response?.data?.message || "Failed to fetch activities");
      setActivities([]);
      setFilteredActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch activities from API
  useEffect(() => {
    fetchActivities();
  }, []); // Empty dependency array since we're using token

  // Filter activities based on search query and filters
  useEffect(() => {
    if (!activities) return; // Guard against null activities
    
    let result = [...activities]; // Create a new array to avoid reference issues
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        activity => 
          (activity?.title || "").toLowerCase().includes(query) || 
          (activity?.description || "").toLowerCase().includes(query) ||
          (activity?.address || "").toLowerCase().includes(query) ||
          (activity?.studentActivityName || "").toLowerCase().includes(query) ||
          (activity?.activityType || "").toLowerCase().includes(query) ||
          (activity?.activityCategory || "").toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(activity => {
        if (statusFilter === "Open") return activity.isOpened;
        if (statusFilter === "Closed") return !activity.isOpened;
        return true;
      });
    }
    
    // Apply category filter
    if (categoryFilter !== "All") {
      result = result.filter(activity => activity?.activityCategory === categoryFilter);
    }
    
    // Apply type filter
    if (typeFilter !== "All") {
      result = result.filter(activity => activity?.activityType === typeFilter);
    }
    
    setFilteredActivities(result);
  }, [activities, searchQuery, statusFilter, categoryFilter, typeFilter]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      longitude: 0,
      latitude: 0,
      startDate: "",
      endDate: "",
      deadlineDate: "",
      numberOfSeats: 0,
      activityType: "Workshop",
      activityCategory: "Technical",
      address: ""
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (activity) => {
    setCurrentActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      longitude: activity.longitude,
      latitude: activity.latitude,
      startDate: new Date(activity.startDate).toISOString().slice(0, 16),
      endDate: new Date(activity.endDate).toISOString().slice(0, 16),
      deadlineDate: new Date(activity.deadlineDate).toISOString().slice(0, 16),
      numberOfSeats: activity.numberOfSeats,
      activityType: activity.activityType,
      activityCategory: activity.activityCategory,
      address: activity.address
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (activity) => {
    setCurrentActivity(activity);
    setIsDeleteModalOpen(true);
  };

  // Handle add activity
  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format dates to ISO string
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        deadlineDate: new Date(formData.deadlineDate).toISOString(),
        numberOfSeats: parseInt(formData.numberOfSeats),
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        address: formData.address
      };

      const response = await axiosInstance().post("/activity", formattedData);
      
      if (response.data?.isSuccess) {
        toast.success("Activity created successfully!");
        setIsAddModalOpen(false);
        setFormData({
          title: "",
          description: "",
          longitude: 0,
          latitude: 0,
          startDate: "",
          endDate: "",
          deadlineDate: "",
          numberOfSeats: 0,
          activityType: "Workshop",
          activityCategory: "Technical",
          address: ""
        });
        // Refresh activities list
        fetchActivities();
      } else {
        toast.error(response.data?.message || "Failed to create activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error(error.response?.data?.message || "Failed to create activity");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit activity
  const handleEditActivity = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Format dates to ISO string
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        deadlineDate: new Date(formData.deadlineDate).toISOString(),
        numberOfSeats: parseInt(formData.numberOfSeats),
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        address: formData.address
      };

      const response = await axiosInstance().put(`/activity/${currentActivity.id}`, formattedData);
      
      if (response.data?.isSuccess) {
        // Update the activity in the lists
        setActivities(activities.map(activity => 
          activity.id === currentActivity.id 
            ? { ...activity, ...formattedData }
            : activity
        ));
        setFilteredActivities(filteredActivities.map(activity => 
          activity.id === currentActivity.id 
            ? { ...activity, ...formattedData }
            : activity
        ));
        setIsEditModalOpen(false);
        toast.success("Activity updated successfully");
      } else {
        toast.error(response.data?.message || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error(error.response?.data?.message || "Failed to update activity");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance().delete(`/activity/${currentActivity.id}`);
      
      if (response.data?.isSuccess) {
        // Remove the activity from the lists
        setActivities(activities.filter(activity => activity.id !== currentActivity.id));
        setFilteredActivities(filteredActivities.filter(activity => activity.id !== currentActivity.id));
        setIsDeleteModalOpen(false);
        toast.success("Activity deleted successfully");
      } else {
        toast.error(response.data?.message || "Failed to delete activity");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error(error.response?.data?.message || "Failed to delete activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivity = async (activityId) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance().put(`/activity/${activityId}/toggle`);
      
      if (response.data?.isSuccess) {
        // Update the activity in the list
        setActivities(activities.map(activity => 
          activity.id === activityId 
            ? { ...activity, isOpened: !activity.isOpened }
            : activity
        ));
        setFilteredActivities(filteredActivities.map(activity => 
          activity.id === activityId 
            ? { ...activity, isOpened: !activity.isOpened }
            : activity
        ));
        // Update the selected activity in the modal
        setSelectedActivity(prev => ({
          ...prev,
          isOpened: !prev.isOpened
        }));
        toast.success("Activity status updated successfully");
      } else {
        toast.error(response.data?.message || "Failed to update activity status");
      }
    } catch (error) {
      console.error("Error toggling activity:", error);
      toast.error(error.response?.data?.message || "Failed to update activity status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAgenda = async (activityId) => {
    try {
      setIsGeneratingAgenda(true);
      const response = await axiosInstance().post(`/activity/generate-agenda?activityId=${activityId}`);
      
      if (response.data?.isSuccess) {
        toast.success("Agenda generated successfully");
        // Update the activity in the list and modal
        const updatedActivity = {
          ...selectedActivity,
          agendaUrl: `${response.data.data}`
        };
        
        setActivities(activities.map(activity => 
          activity.id === activityId 
            ? updatedActivity
            : activity
        ));
        setFilteredActivities(filteredActivities.map(activity => 
          activity.id === activityId 
            ? updatedActivity
            : activity
        ));
        setSelectedActivity(updatedActivity);
      } else {
        toast.error(response.data?.message || "Failed to generate agenda");
      }
    } catch (error) {
      console.error("Error generating agenda:", error);
      toast.error(error.response?.data?.message || "Failed to generate agenda");
    } finally {
      setIsGeneratingAgenda(false);
    }
  };

  const handleUploadPoster = async (activityId, file) => {
    try {
      setIsUploadingPoster(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance().post(`/activity/${activityId}/upload-poster`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data?.isSuccess) {
        toast.success("Poster uploaded successfully");
        // Update the activity in the list and modal
        const updatedActivity = {
          ...selectedActivity,
          posterUrl: `${response.data.data}`
        };
        
        setActivities(activities.map(activity => 
          activity.id === activityId 
            ? updatedActivity
            : activity
        ));
        setFilteredActivities(filteredActivities.map(activity => 
          activity.id === activityId 
            ? updatedActivity
            : activity
        ));
        setSelectedActivity(updatedActivity);
      } else {
        toast.error(response.data?.message || "Failed to upload poster");
      }
    } catch (error) {
      console.error("Error uploading poster:", error);
      toast.error(error.response?.data?.message || "Failed to upload poster");
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handleDeleteAgenda = async (activityId) => {
    try {
      setIsDeletingAgenda(true);
      const response = await axiosInstance().delete(`/activity/${activityId}/delete-agenda`);
      
      if (response.data?.isSuccess) {
        toast.success("Agenda deleted successfully");
        // Update the activity in the list and modal
        setActivities(activities.map(activity => 
          activity.id === activityId 
            ? { ...activity, agendaUrl: null }
            : activity
        ));
        setFilteredActivities(filteredActivities.map(activity => 
          activity.id === activityId 
            ? { ...activity, agendaUrl: null }
            : activity
        ));
        setSelectedActivity(prev => ({
          ...prev,
          agendaUrl: null
        }));
      } else {
        toast.error(response.data?.message || "Failed to delete agenda");
      }
    } catch (error) {
      console.error("Error deleting agenda:", error);
      toast.error(error.response?.data?.message || "Failed to delete agenda");
    } finally {
      setIsDeletingAgenda(false);
    }
  };

  // Add reverse geocoding function
  const reverseGeocode = async (lat, lng) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: data.display_name
        }));
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      toast.error('Failed to fetch address details');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Update handleLocationSelect to include reverse geocoding
  const handleLocationSelect = async (latlng) => {
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng
    }));
    await reverseGeocode(latlng.lat, latlng.lng);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Activities</h1>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Activity
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search activities by title, description, address, or SA name..."
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="NonTechnical">NonTechnical</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="w-full md:w-48">
            <select
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Event">Event</option>
              <option value="Workshop">Workshop</option>
              <option value="Course">Course</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            Loading activities...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {currentItems.length > 0 ? (
              currentItems.map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-md cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setSelectedActivity(activity);
                    setShowDetailsModal(true);
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.isOpened ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {activity.isOpened ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">{activity.studentActivityName}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                        {activity.activityType}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(activity);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(activity);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                No activities found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredActivities.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredActivities.length)} of {filteredActivities.length} activities
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      {showDetailsModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-white">Activity Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      to={`/student-activity/activities/${selectedActivity.id}`}
                      className="text-2xl font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-2 mb-1"
                    >
                      {selectedActivity.title}
                      <ChevronRight size={20} className="text-gray-400" />
                    </Link>
                    <p className="text-gray-400">{selectedActivity.studentActivityName}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActivity(selectedActivity.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedActivity.isOpened 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {selectedActivity.isOpened ? (
                          <>
                            <Lock size={16} />
                            <span>Close Activity</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={16} />
                            <span>Open Activity</span>
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status and Category Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedActivity.isOpened ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}>
                  {selectedActivity.isOpened ? 'Open' : 'Closed'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-400">
                  {selectedActivity.activityCategory}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400">
                  {selectedActivity.activityType}
                </span>
              </div>

              {/* Description */}
              <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                <p className="text-gray-300">{selectedActivity.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Time & Date</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} className="text-blue-400" />
                      <span>Starts: {new Date(selectedActivity.startDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} className="text-red-400" />
                      <span>Ends: {new Date(selectedActivity.endDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} className="text-yellow-400" />
                      <span>Registration Deadline: {new Date(selectedActivity.deadlineDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Location & Capacity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin size={16} className="text-green-400" />
                      <span>{selectedActivity.address || 'Location details will be provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users size={16} className="text-purple-400" />
                      <span>{selectedActivity.numberOfSeats} seats available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Resources */}
              {(selectedActivity.posterUrl || selectedActivity.agendaUrl) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Available Resources</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedActivity.posterUrl && (
                      <a
                        href={selectedActivity.posterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <Image size={16} />
                        <span>View Poster</span>
                      </a>
                    )}
                    {selectedActivity.agendaUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={selectedActivity.agendaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <FileText size={16} />
                          <span>View Agenda</span>
                        </a>
                        <button
                          onClick={() => setShowDeleteAgendaModal(true)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Agenda"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-700 pt-6 mt-6">
                <div className="flex flex-wrap items-center gap-3">
                  {!selectedActivity.agendaUrl && (
                    <button
                      onClick={() => handleGenerateAgenda(selectedActivity.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
                      disabled={isGeneratingAgenda}
                    >
                      {isGeneratingAgenda ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FileText size={16} />
                          <span>Generate Agenda</span>
                        </>
                      )}
                    </button>
                  )}

                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleUploadPoster(selectedActivity.id, file);
                        }
                      }}
                    />
                    {isUploadingPoster ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Image size={16} />
                        <span>Upload Poster</span>
                      </>
                    )}
                  </label>

                  <div className="flex-grow"></div>

                  <button
                    onClick={() => openEditModal(selectedActivity)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => openDeleteModal(selectedActivity)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Trash size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl my-4 sm:my-8">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-white">Add New Activity</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddActivity} className="p-4 sm:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Activity Type</label>
                  <select
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Activity Type</option>
                    <option value="Event">Event</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Activity Category</label>
                  <select
                    name="activityCategory"
                    value={formData.activityCategory}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Activity Category</option>
                    <option value="Technical">Technical</option>
                    <option value="NonTechnical">NonTechnical</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Number of Seats</label>
                  <input
                    type="number"
                    name="numberOfSeats"
                    value={formData.numberOfSeats}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deadline Date</label>
                  <input
                    type="datetime-local"
                    name="deadlineDate"
                    value={formData.deadlineDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Map Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker 
                      onLocationSelect={handleLocationSelect} 
                      initialPosition={[formData.latitude, formData.longitude]}
                    />
                  </MapContainer>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Click on the map to set the location or drag the marker to adjust
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Selected Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address or select a location on the map"
                      rows={2}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {isGeocoding && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Click on the map to automatically fill the address
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {isEditModalOpen && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <h3 className="text-xl font-semibold text-white">Edit Activity</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditActivity} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Activity Type</label>
                  <select
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Activity Type</option>
                    <option value="Event">Event</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Activity Category</label>
                  <select
                    name="activityCategory"
                    value={formData.activityCategory}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Activity Category</option>
                    <option value="Technical">Technical</option>
                    <option value="NonTechnical">NonTechnical</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Number of Seats</label>
                  <input
                    type="number"
                    name="numberOfSeats"
                    value={formData.numberOfSeats}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deadline Date</label>
                  <input
                    type="datetime-local"
                    name="deadlineDate"
                    value={formData.deadlineDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Map Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[formData.latitude, formData.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker 
                      onLocationSelect={handleLocationSelect} 
                      initialPosition={[formData.latitude, formData.longitude]}
                    />
                  </MapContainer>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Click on the map to set the location or drag the marker to adjust
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Selected Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address or select a location on the map"
                      rows={2}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {isGeocoding && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Click on the map to automatically fill the address
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Confirm Delete</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete "{currentActivity?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteActivity}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add the Delete Agenda Confirmation Modal */}
      {showDeleteAgendaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Trash size={24} className="sm:size-8 text-red-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Delete Agenda</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Are you sure you want to delete this agenda? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteAgendaModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteAgenda(selectedActivity.id);
                    setShowDeleteAgendaModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={isDeletingAgenda}
                >
                  {isDeletingAgenda ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Trash size={16} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaActivities;
