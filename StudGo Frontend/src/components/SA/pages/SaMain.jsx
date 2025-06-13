import WelcomeBanner from "../components/WelcomeBanner.jsx";
import Card from "../components/Card.jsx";
import Chart from "../components/Chart.jsx";
import Attendace from "../components/Attendace.jsx";
import EventCalendar from "../components/EventCalendar.jsx";
import { Activity, CalendarDays, Handshake, Laptop, Podcast, Presentation, Users } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore.js";

function SaMain() {
  const { currentUser } = useAuthStore();

  // Check if user is authenticated and has StudentActivity role
  if (!currentUser || currentUser.role !== "StudentActivity") {
    return null;
  }

  // Static data for the dashboard
  const dashboardData = {
    events: { count: 12 },
    talks: { count: 8 },
    workshops: { count: 5 },
    members: { count: 150 }
  };

  // Chart Data
  const chartData = [
    { name: "Events", value: dashboardData.events.count, color: "#4F46E5", icon: <Presentation size={20} /> },  // Indigo
    { name: "Talks", value: dashboardData.talks.count, color: "#22C55E", icon: <Podcast size={20} /> },    // Green
    { name: "Workshops", value: dashboardData.workshops.count, color: "#FACC15", icon: <Laptop size={20} /> }, // Yellow
    { name: "Members", value: dashboardData.members.count, color: "#EF4444", icon: <Users size={20} /> }, // Red
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <WelcomeBanner />
    
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              type="Events" 
              count={dashboardData.events.count} 
              isLoading={false} 
              icon={<Presentation size={24} />}
            />
            <Card 
              type="Talks" 
              count={dashboardData.talks.count} 
              isLoading={false} 
              icon={<Podcast size={24} />}
            />
            <Card 
              type="Workshops" 
              count={dashboardData.workshops.count} 
              isLoading={false} 
              icon={<Laptop size={24} />}
            />
            <Card 
              type="Members" 
              count={dashboardData.members.count} 
              isLoading={false} 
              icon={<Users size={24} />}
            />
          </div>

          {/* Chart Section */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 text-blue-400" size={20} />
              Activity Statistics
            </h2>
            <div className="w-full h-[400px] flex justify-center items-center">
              <Chart data={chartData} />
            </div>
          </div>

          {/* Attendance Section */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-green-400" size={20} />
              Attendance Overview
            </h2>
            <div className="w-full h-[400px] flex justify-center items-center">
              <Attendace />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CalendarDays className="mr-2 text-yellow-400" size={20} />
              Upcoming Events
            </h2>
            <EventCalendar />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default SaMain;
