import { useContext } from "react";
import { useAuthStore } from "../../../store/authStore.js";
import { Bell, Calendar, Clock } from "lucide-react";

function WelcomeBanner() {
    const { currentUser } = useAuthStore();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const currentTime = currentDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-5 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                        Welcome Back, <span className="text-sky-300 uppercase">{currentUser?.UserName || "Guest"}!</span> 👋
                    </h1>
                    <p className="text-lg md:text-xl leading-tight mt-1 text-gray-300">
                        Ready to manage events, workshops, and talks with ease! 🚀
                    </p>
                </div>
                <div className="flex flex-col space-y-2 md:space-y-0 md:space-x-4 md:flex-row md:items-center">
                    <div className="flex items-center text-gray-300">
                        <Calendar size={18} className="mr-2 text-blue-400" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Clock size={18} className="mr-2 text-green-400" />
                        <span>{currentTime}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Bell size={18} className="mr-2 text-yellow-400" />
                        <span>3 new notifications</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBanner;
