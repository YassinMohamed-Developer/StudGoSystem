import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/student.png';
import { useAuthStore } from '../../store/authStore.js';
import { 
  Calendar, 
  User, 
  ChevronDown, 
  Home, 
  Users, 
  Calendar as CalendarIcon, 
  BookOpen, 
  LogOut,
  Menu,
  X,
  Briefcase,
  ChevronRight
} from 'lucide-react';

const NavBar = () => {
  const { currentUser, handleLogout } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsNavbarVisible(currentScroll <= lastScrollPosition || currentScroll < 50);
      setLastScrollPosition(currentScroll);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition]);

  const isActive = (path) => location.pathname === path;

  // Common styles
  const navContainer = `bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 sm:px-6 py-3 fixed top-0 left-0 right-0 z-50 shadow-xl transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`;
  const linkStyles = "relative group flex items-center gap-2 text-white py-2 px-3 rounded-lg transition-all duration-300 hover:bg-gray-800/50";
  const activeLinkStyles = "bg-blue-500/20 text-blue-400";
  const buttonStyles = "px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl";

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/student-activities', label: 'Organizations', icon: Users },
    { path: '/activities', label: 'Activities', icon: CalendarIcon },
    { path: '/interns', label: 'Internships', icon: Briefcase },
  ];

  const profileItems = [
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/followed-activities', label: 'Followed Activities', icon: BookOpen },
  ];

  return (
    <div className={navContainer}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white" />
              <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wide hover:scale-105 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StudGo
              </Link>
            </div>
            <button 
              className="lg:hidden text-white focus:outline-none p-2 hover:bg-gray-800 rounded-lg transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-2 mt-4 lg:mt-0">
            {currentUser ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${linkStyles} ${isActive(item.path) ? activeLinkStyles : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`${linkStyles} ${isProfileOpen ? activeLinkStyles : ''}`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-800 shadow-lg py-1 z-50">
                      {profileItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        );
                      })}
                      <div className="border-t border-gray-700 my-1"></div>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={`${buttonStyles} bg-green-600 hover:bg-green-700 hover:ring-4 hover:ring-green-500`}>Login</Link>
                <Link to="/register" className={`${buttonStyles} bg-blue-600 hover:bg-blue-700 hover:ring-4 hover:ring-blue-500`}>Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden flex flex-col items-center bg-gray-900 transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"}`}>
          {currentUser ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${linkStyles} w-full justify-center ${isActive(item.path) ? activeLinkStyles : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {profileItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${linkStyles} w-full justify-center ${isActive(item.path) ? activeLinkStyles : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button 
                onClick={handleLogout} 
                className={`${buttonStyles} bg-red-600 hover:bg-red-700 hover:ring-4 hover:ring-red-500 mt-2 flex items-center gap-2`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2 w-full">
              <Link to="/login" className={`${buttonStyles} bg-green-600 hover:bg-green-700 hover:ring-4 hover:ring-green-500 w-full text-center`} onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className={`${buttonStyles} bg-blue-600 hover:bg-blue-700 hover:ring-4 hover:ring-blue-500 w-full text-center`} onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;