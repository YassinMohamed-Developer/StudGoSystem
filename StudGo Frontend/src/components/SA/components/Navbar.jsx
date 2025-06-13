import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Sun,
  Moon,
  Calendar,
  MessageSquare,
  HelpCircle
} from "lucide-react";

function Navbar({ isMobile, toggleMobileMenu, isMobileMenuOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Event Added",
      message: "A new event 'Web Development Workshop' has been added.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Event Updated",
      message: "The 'AI Ethics Talk' event has been rescheduled.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 3,
      title: "New Member",
      message: "John Doe has joined the student activity group.",
      time: "3 days ago",
      read: true,
    },
  ]);
  
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      // Reset search
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    console.log("Auth Store:", authStore);
    authStore.handleLogout();
    navigate("/login");
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would implement actual dark mode toggling here
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <nav className="fixed top-0 right-0 left-0 md:left-auto z-40 h-16 md:h-20 backdrop-blur-md bg-gray-900/95 border-b border-gray-800/80">
      <div className="h-full max-w-screen-2xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        {/* Left Section: Mobile Menu Toggle + Search */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white p-1.5 sm:p-2 rounded-md hover:bg-gray-800/70 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          )}

          {/* Search */}
          <div
            ref={searchRef}
            className={`relative ${isMobile ? "w-full max-w-[140px] sm:max-w-[180px]" : "w-56 sm:w-64 lg:w-80"}`}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full bg-gray-800/70 text-white px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  isSearchFocused
                    ? "focus:ring-blue-500 focus:bg-gray-700/90"
                    : "focus:ring-gray-700"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <Search
                size={16}
                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </form>
          </div>
        </div>

        {/* Center Section: Quick Links (Hidden on Mobile) */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link 
              to="/student-activity/calendar" 
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800/70 transition-colors"
            >
              <Calendar size={16} />
              <span className="text-sm font-medium">Calendar</span>
            </Link>
            <Link 
              to="/student-activity/messages" 
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800/70 transition-colors"
            >
              <MessageSquare size={16} />
              <span className="text-sm font-medium">Messages</span>
            </Link>
            <Link 
              to="/student-activity/help" 
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800/70 transition-colors"
            >
              <HelpCircle size={16} />
              <span className="text-sm font-medium">Help</span>
            </Link>
          </div>
        )}

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/70 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/70 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700/80">
                <div className="p-3 border-b border-gray-700/80 flex justify-between items-center">
                  <h3 className="text-white font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-gray-400">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-3 border-b border-gray-700/80 cursor-pointer hover:bg-gray-700/70 transition-colors ${
                          !notification.read ? "bg-gray-700/50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-white">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="mt-2 flex justify-end">
                            <span className="text-xs text-blue-400 hover:text-blue-300">
                              Mark as read
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-700/80">
                  <button 
                    onClick={() => {
                      navigate('/student-activity/notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="w-full text-center text-sm text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-gray-700/70 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/70 transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden ring-2 ring-gray-700/50">
                {authStore.currentUser?.photoURL ? (
                  <img
                    src={authStore.currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              {!isMobile && (
                <>
                  <span className="text-sm font-medium text-white max-w-[80px] sm:max-w-[100px] truncate">
                    {authStore.currentUser?.displayName || "User"}
                  </span>
                  <ChevronDown size={14} />
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700/80">
                <div className="p-4 border-b border-gray-700/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden">
                      {authStore.currentUser?.photoURL ? (
                        <img
                          src={authStore.currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {authStore.currentUser?.displayName || "User"}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {authStore.currentUser?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/student-activity/profile");
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors"
                  >
                    <User size={18} />
                    <span>Your Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/student-activity/settings");
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      console.log("Logout button clicked");
                      console.log("Auth Store:", authStore);
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-red-400 hover:text-red-300 hover:bg-gray-700/70 transition-colors border-t border-gray-700/80 mt-1"
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
