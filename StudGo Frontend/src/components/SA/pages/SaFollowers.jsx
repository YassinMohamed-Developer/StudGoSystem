import { useState, useEffect } from "react";
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  Mail, 
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  MessageCircle
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-hot-toast";

// Mock data for followers
const FOLLOWERS_DATA = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    department: "Computer Science",
    year: "3rd Year",
    joinDate: "2024-09-15",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima.ali@example.com",
    department: "Engineering",
    year: "2nd Year",
    joinDate: "2024-10-03",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    name: "Omar Khalid",
    email: "omar.khalid@example.com",
    department: "Business",
    year: "4th Year",
    joinDate: "2024-08-22",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 4,
    name: "Layla Mohamed",
    email: "layla.mohamed@example.com",
    department: "Medicine",
    year: "1st Year",
    joinDate: "2024-11-10",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 5,
    name: "Youssef Ibrahim",
    email: "youssef.ibrahim@example.com",
    department: "Computer Science",
    year: "3rd Year",
    joinDate: "2024-09-05",
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    id: 6,
    name: "Nour Ahmed",
    email: "nour.ahmed@example.com",
    department: "Arts",
    year: "2nd Year",
    joinDate: "2024-10-15",
    status: "Inactive",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg"
  }
];

function SaFollowers() {
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentFollower, setCurrentFollower] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Computer Science",
    year: "1st Year",
    status: "Active"
  });
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: ""
  });
  const { apiRequest } = useAuthStore();
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch followers on component mount
  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance().get("/sa/followers");
      if (response.data?.isSuccess && response.data?.data) {
        setFollowers(response.data.data);
        setFilteredFollowers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to fetch followers");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter followers based on search query
  useEffect(() => {
    let result = followers;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        follower => 
          follower.firstName.toLowerCase().includes(query) || 
          follower.lastName.toLowerCase().includes(query) ||
          follower.fieldOfStudy.toLowerCase().includes(query) ||
          follower.university.toLowerCase().includes(query) ||
          follower.faculty.toLowerCase().includes(query) ||
          follower.contactEmail.toLowerCase().includes(query) ||
          follower.contactPhoneNumber.toLowerCase().includes(query) ||
          follower.address.toLowerCase().includes(query)
      );
    }
    
    setFilteredFollowers(result);
    setCurrentPage(1); // Reset to first page when search changes
  }, [followers, searchQuery]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFollowers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFollowers.length / itemsPerPage);

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
      name: "",
      email: "",
      department: "Computer Science",
      year: "1st Year",
      status: "Active"
    });
    setIsAddModalOpen(true);
  };

  // Open remove modal
  const openRemoveModal = (follower) => {
    setCurrentFollower(follower);
    setIsRemoveModalOpen(true);
  };

  // Handle add follower
  const handleAddFollower = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosInstance().post("/sa/followers", formData);
      if (response.data?.isSuccess) {
        toast.success("Follower added successfully!");
        fetchFollowers(); // Refresh the list
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding follower:", error);
      toast.error(error.response?.data?.message || "Failed to add follower");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove follower
  const handleRemoveFollower = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance().delete(`/sa/followers/${currentFollower.id}`);
      if (response.data?.isSuccess) {
        toast.success("Follower removed successfully!");
        fetchFollowers(); // Refresh the list
        setIsRemoveModalOpen(false);
      }
    } catch (error) {
      console.error("Error removing follower:", error);
      toast.error(error.response?.data?.message || "Failed to remove follower");
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(followers.map(follower => follower.department))];

  // Handle notification form input changes
  const handleNotificationInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({
      ...notificationData,
      [name]: value
    });
  };

  // Handle sending notification to all students
  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosInstance().post("/activity/notify", notificationData);
      if (response.data?.isSuccess) {
        toast.success("Notification sent successfully!");
        setShowNotifyModal(false);
        setNotificationData({ title: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.response?.data?.message || "Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Followers</h1>
        <button
          onClick={() => setShowNotifyModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MessageCircle size={18} />
          <span>Notify All Students</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search followers..."
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Followers List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            Loading followers...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3">
            {currentItems.length > 0 ? (
              currentItems.map((follower) => (
                <div 
                  key={follower.id} 
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-md cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setSelectedFollower(follower);
                    setShowDetailsModal(true);
                  }}
                >
                  <div className="p-3 flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      {follower.pictureUrl && follower.pictureUrl !== "Picture have Issue" ? (
                        <img
                          src={follower.pictureUrl}
                          alt={`${follower.firstName} ${follower.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-300">
                          {follower.firstName.charAt(0)}{follower.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {follower.firstName} {follower.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{follower.fieldOfStudy}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs truncate">
                          {follower.university} - {follower.faculty}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <a
                          href={`mailto:${follower.contactEmail}`}
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          <Mail size={14} className="mr-1" />
                          <span className="text-xs">Contact</span>
                        </a>
                        {follower.cvUrl && follower.cvUrl !== "CV have Issue" && (
                          <a
                            href={follower.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex items-center"
                          >
                            <FileText size={14} className="mr-1" />
                            <span className="text-xs">CV</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-400">
                No followers found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredFollowers.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFollowers.length)} of {filteredFollowers.length} followers
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

      {/* Follower Details Modal */}
      {showDetailsModal && selectedFollower && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Follower Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  {selectedFollower.pictureUrl && selectedFollower.pictureUrl !== "Picture have Issue" ? (
                    <img
                      src={selectedFollower.pictureUrl}
                      alt={`${selectedFollower.firstName} ${selectedFollower.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-gray-300">
                      {selectedFollower.firstName.charAt(0)}{selectedFollower.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedFollower.firstName} {selectedFollower.lastName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Field of Study</p>
                        <p className="text-white">{selectedFollower.fieldOfStudy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">University</p>
                        <p className="text-white">{selectedFollower.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Faculty</p>
                        <p className="text-white">{selectedFollower.faculty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Birth Date</p>
                        <p className="text-white">{new Date(selectedFollower.birthDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{selectedFollower.contactEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">{selectedFollower.contactPhoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white">{selectedFollower.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <a
                      href={`mailto:${selectedFollower.contactEmail}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Mail size={16} />
                      <span>Contact</span>
                    </a>
                    {selectedFollower.cvUrl && selectedFollower.cvUrl !== "CV have Issue" && (
                      <a
                        href={selectedFollower.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <FileText size={16} />
                        <span>View CV</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Send Notification to All Students</h3>
              <button
                onClick={() => setShowNotifyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendNotification} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={notificationData.title}
                    onChange={handleNotificationInputChange}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={notificationData.message}
                    onChange={handleNotificationInputChange}
                    rows={4}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⌛</span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      <span>Send Notification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaFollowers;
