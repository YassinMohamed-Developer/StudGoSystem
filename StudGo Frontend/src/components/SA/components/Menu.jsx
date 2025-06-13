import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import MenuItems from "./MenuItems";
import { 
  User, 
  LogOut, 
  Menu as MenuIcon,
  X,
  ChevronDown
} from "lucide-react";

function Menu({ toggleMobileMenu, isMobileMenuOpen, isMobile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  // Handle clicks outside of profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out from menu...");
    authStore.handleLogout();
    navigate("/login");
  };

  return (
    <div
      className={`bg-gray-900 border-r border-gray-800/80 flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800/80">
        {/* Logo */}
        <Link to="/student-activity" className="flex items-center">
          {isCollapsed ? (
            <span className="text-2xl font-bold text-blue-500">S</span>
          ) : (
            <span className="text-xl font-bold text-blue-500">StudGo</span>
          )}
        </Link>

        {/* Mobile Menu Toggle (only on mobile) */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800/70 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        )}

        {/* Menu Collapse Toggle (only on desktop) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800/70 transition-colors"
          >
            {isCollapsed ? (
              <MenuIcon size={20} />
            ) : (
              <X size={20} />
            )}
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2">
        <MenuItems isCollapsed={isCollapsed} pathname={location.pathname} />
      </div>

      {/* Profile Section */}
      <div ref={profileRef} className="border-t border-gray-800/80 p-3">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-2 rounded-md hover:bg-gray-800/70 transition-colors`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden ring-2 ring-gray-700/50">
              {authStore.currentUser?.photoURL ? (
                <img
                  src={authStore.currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium text-white max-w-[140px] truncate">
                {authStore.currentUser?.displayName || "User"}
              </span>
            )}
          </div>
          {!isCollapsed && <ChevronDown size={16} className="text-gray-400" />}
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className={`mt-2 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700/80 ${
            isCollapsed ? "absolute left-20 bottom-16 w-56" : ""
          }`}>
            {isCollapsed && (
              <div className="p-3 border-b border-gray-700/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden">
                    {authStore.currentUser?.photoURL ? (
                      <img
                        src={authStore.currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {authStore.currentUser?.displayName || "User"}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {authStore.currentUser?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/student-activity/profile");
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors"
              >
                <User size={18} />
                <span>Your Profile</span>
              </button>
              <button
                onClick={() => {
                  console.log("Logout button clicked from menu");
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-gray-700/70 transition-colors border-t border-gray-700/80 mt-1"
              >
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
