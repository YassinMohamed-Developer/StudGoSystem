import { useState, useEffect } from "react";
import Menu from "./../components/Menu.jsx";
import { Outlet } from "react-router-dom";
import { Loader, Menu as MenuIcon } from "lucide-react";
import { useAuthStore } from "../../../store/authStore.js";

function SAHome() {
    const { currentUser } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check for screen size changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Check if user is authenticated
    if (!currentUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
                <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-900">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Left Sidebar */}
            <aside 
                className={`fixed md:relative md:flex z-50 transition-all duration-300 transform ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
                style={{ height: '100vh', maxHeight: '100vh', overflowY: 'auto' }}
            >
                <Menu toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} isMobile={isMobile} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full md:pl-0 flex flex-col overflow-hidden">
                {/* Mobile Menu Toggle - Visible only on mobile */}
                {isMobile && !isMobileMenuOpen && (
                    <button
                        onClick={toggleMobileMenu}
                        className="fixed top-4 left-4 z-30 md:hidden bg-gray-800 text-gray-200 p-2 rounded-md shadow-lg"
                        aria-label="Open menu"
                    >
                        <MenuIcon size={24} />
                    </button>
                )}
                
                {/* Content Area */}
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default SAHome;
