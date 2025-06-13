import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  FileText,
  Image,
  Clock,
  Tag,
  Info,
  Building,
  BookOpen,
  Plus,
  User,
  Pencil,
  Trash2,
  AlertTriangle,
  Mail,
  Phone
} from "lucide-react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ActivitySADetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // details, contents, students
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    hostName: '',
    startDate: '',
    endDate: '',
    contentType: 'Talk' // default value updated to Talk
  });

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance().get(`/activity/${id}`);
        
        if (response.data?.isSuccess) {
          setActivity(response.data.data);
        } else {
          toast.error("Failed to fetch activity details");
        }
      } catch (error) {
        console.error("Error fetching activity details:", error);
        toast.error(error.response?.data?.message || "Failed to fetch activity details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'contents' && id) {
      fetchContents();
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab === 'students' && id) {
      fetchStudents();
    }
  }, [activeTab, id]);

  const fetchContents = async () => {
    try {
      const response = await axiosInstance().get(`/content/activity/${id}`);
      if (response.data?.isSuccess) {
        setContents(response.data.data || []);
      } else {
        toast.error('Failed to fetch contents');
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch contents');
    }
  };

  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      const response = await axiosInstance().get(`/activity/students`, {
        params: {
          activityId: id
        }
      });
      if (response.data?.isSuccess) {
        setStudents(response.data.data || []);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response?.status === 404) {
        toast.error('No students found for this activity');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch students');
      }
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        // Update existing content
        await axiosInstance().put(`/content/${editingContent.id}`, newContent);
        toast.success('Content updated successfully');
      } else {
        // Create new content
        await axiosInstance().post(`/content/${id}`, newContent);
        toast.success('Content added successfully');
      }
      setShowContentModal(false);
      setEditingContent(null);
      setNewContent({
        title: '',
        description: '',
        hostName: '',
        startDate: '',
        endDate: '',
        contentType: 'Talk'
      });
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(error.response?.data?.message || 'Failed to save content');
    }
  };

  const handleEditContent = async (content) => {
    try {
      const response = await axiosInstance().get(`/content/${content.id}`);
      if (response.data?.isSuccess) {
        const contentDetails = response.data.data;
        setEditingContent(contentDetails);
        setNewContent({
          title: contentDetails.title,
          description: contentDetails.description,
          hostName: contentDetails.hostName,
          startDate: contentDetails.startDate,
          endDate: contentDetails.endDate,
          contentType: contentDetails.contentType
        });
        setShowContentModal(true);
      }
    } catch (error) {
      console.error('Error fetching content details:', error);
      toast.error('Failed to fetch content details');
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      setDeleteLoading(true);
      await axiosInstance().delete(`/content/${contentId}`);
      toast.success('Content deleted successfully');
      setShowDeleteModal(false);
      setContentToDelete(null);
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete content');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (content) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-4">Activity not found</h2>
        <button
          onClick={() => navigate('/student-activity/activities')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/student-activity/activities')}
          className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Activities
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{activity.title}</h1>
            <p className="text-gray-400">{activity.studentActivityName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activity.isOpened ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            }`}>
              {activity.isOpened ? 'Open' : 'Closed'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-400">
              {activity.activityCategory}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400">
              {activity.activityType}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contents'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('contents')}
        >
          Contents
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'students'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('students')}
        >
          Students ({students.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Info size={20} className="mr-2 text-blue-400" />
                Description
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">{activity.description}</p>
            </div>

            {/* Location Map */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-green-400" />
                Location
              </h2>
              <div className="h-[300px] rounded-lg overflow-hidden mb-4">
                <MapContainer
                  center={[activity.latitude, activity.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[activity.latitude, activity.longitude]} />
                </MapContainer>
              </div>
              {activity.address && (
                <p className="text-gray-300 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {activity.address}
                </p>
              )}
            </div>

            {/* Resources */}
            {(activity.posterUrl || activity.agendaUrl) && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-yellow-400" />
                  Resources
                </h2>
                <div className="flex flex-wrap gap-4">
                  {activity.posterUrl && (
                    <a
                      href={activity.posterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <Image size={16} />
                      View Poster
                    </a>
                  )}
                  {activity.agendaUrl && (
                    <a
                      href={activity.agendaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FileText size={16} />
                      View Agenda
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date & Time */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-purple-400" />
                Date & Time
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Starts</div>
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-2 text-blue-400" />
                    {new Date(activity.startDate).toLocaleDateString()}
                    <Clock size={16} className="ml-4 mr-2 text-blue-400" />
                    {new Date(activity.startDate).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ends</div>
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-2 text-red-400" />
                    {new Date(activity.endDate).toLocaleDateString()}
                    <Clock size={16} className="ml-4 mr-2 text-red-400" />
                    {new Date(activity.endDate).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Registration Deadline</div>
                  <div className="flex items-center text-gray-300">
                    <Calendar size={16} className="mr-2 text-yellow-400" />
                    {new Date(activity.deadlineDate).toLocaleDateString()}
                    <Clock size={16} className="ml-4 mr-2 text-yellow-400" />
                    {new Date(activity.deadlineDate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users size={20} className="mr-2 text-green-400" />
                Capacity
              </h2>
              <div className="text-3xl font-bold text-white mb-2">
                {activity.numberOfSeats}
              </div>
              <div className="text-sm text-gray-400">Available Seats</div>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Tag size={20} className="mr-2 text-blue-400" />
                Quick Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Building className="w-5 h-5 mr-3 text-purple-400" />
                  <span>Organized by {activity.studentActivityName}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <BookOpen className="w-5 h-5 mr-3 text-yellow-400" />
                  <span>{activity.activityType} Activity</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Tag className="w-5 h-5 mr-3 text-green-400" />
                  <span>{activity.activityCategory} Category</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'contents' ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Contents ({contents.length})
              </h2>
              <button
                onClick={() => setShowContentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Content
              </button>
            </div>
            
            {contents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contents.map((content) => (
                  <div key={content.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{content.title}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditContent(content)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit content"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(content)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete content"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{content.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Calendar size={14} className="mr-2 text-blue-400" />
                        {new Date(content.startDate).toLocaleDateString()} - {new Date(content.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <User size={14} className="mr-2 text-green-400" />
                        Host: {content.hostName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No contents found for this activity
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Students Tab */
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Applied Students ({students.length})
            </h2>
            
            {isLoadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div key={student.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                        {student.pictureUrl && student.pictureUrl !== "Picture have Issue" ? (
                          <img
                            src={student.pictureUrl}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + student.lastName)}&background=random`;
                            }}
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + student.lastName)}&background=random`}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white">
                          {student.firstName} {student.lastName}
                        </h3>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <Building className="w-4 h-4 mr-2 text-blue-400" />
                            {student.university} - {student.faculty}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                            {student.fieldOfStudy}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <Mail className="w-4 h-4 mr-2 text-green-400" />
                            {student.contactEmail}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <Phone className="w-4 h-4 mr-2 text-yellow-400" />
                            {student.contactPhoneNumber}
                          </div>
                        </div>
                        {student.cvUrl && student.cvUrl.trim() !== '' && (
                          <a
                            href={student.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FileText size={14} />
                            View CV
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No students have applied to this activity yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingContent ? 'Edit Content' : 'Add New Content'}
            </h2>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Host Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newContent.hostName}
                  onChange={(e) => setNewContent({ ...newContent, hostName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter host name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newContent.startDate}
                    onChange={(e) => setNewContent({ ...newContent, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newContent.endDate}
                    onChange={(e) => setNewContent({ ...newContent, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Content Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newContent.contentType}
                  onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Talk">Talk</option>
                  <option value="Session">Session</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowContentModal(false);
                    setEditingContent(null);
                    setNewContent({
                      title: '',
                      description: '',
                      hostName: '',
                      startDate: '',
                      endDate: '',
                      contentType: 'Talk'
                    });
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingContent ? 'Update Content' : 'Add Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative transform transition-all duration-300 ease-in-out">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-white text-center mb-2">Confirm Deletion</h2>
                <p className="text-gray-300 text-center mb-2">
                  Are you sure you want to delete this content?
                </p>
                <p className="text-red-400 text-sm text-center mb-6">
                  "{contentToDelete.title}"
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setContentToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg border border-gray-600 hover:border-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteContent(contentToDelete.id)}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitySADetails; 