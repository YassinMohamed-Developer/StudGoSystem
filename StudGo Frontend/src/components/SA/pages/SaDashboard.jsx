import { useState, useEffect } from "react";
import { Activity, Users, FileText, TrendingUp, ChartPie } from "lucide-react";
import { useAuthStore } from "../../../store/authStore.js";
import { axiosInstance, getSAIdFromToken } from "../../../lib/axios";
import { toast } from "react-hot-toast";
import DistributionChart from "../components/charts/DistributionChart.jsx";
import ActivityTypeChart from "../components/charts/ActivityTypeChart.jsx";
import { useNavigate } from "react-router-dom";

function SaDashboard() {
  const { currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [saProfile, setSaProfile] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    activities: { count: 0, trend: "+0%" },
    teams: { count: 0, trend: "+0%" },
    followers: { count: 0, trend: "+0%" }
  });
  const [statistics, setStatistics] = useState({
    numOfActivites: 0,
    numOfEventActivites: 0,
    numOfCourseActivites: 0,
    numOfWorkshopActivites: 0,
    numOfTechnicalActivites: 0,
    numOfNonTechnicalActivites: 0,
    numOfMixedActivites: 0,
    numOfTeams: 0,
    numOfFollowers: 0
  });
  const navigate = useNavigate();

  // Fetch SA profile
  useEffect(() => {
    const fetchSaProfile = async () => {
      try {
        const response = await axiosInstance().get("/sa/profile");
        console.log("SA Profile Response:", response.data);
        
        if (response.data?.isSuccess) {
          const profileData = response.data.data;
          setSaProfile(profileData);
          toast.success("Profile loaded successfully");
        } else {
          console.error("Failed to fetch SA profile:", response.data);
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching SA profile:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    };

    fetchSaProfile();
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance().get("/sa/statistics");
        
        if (response.data?.isSuccess) {
          const stats = response.data.data;
          setStatistics(stats);
          
          // Update dashboard data with real statistics
          setDashboardData({
            activities: { 
              count: stats.numOfActivites, 
              trend: "+0%" 
            },
            teams: { 
              count: stats.numOfTeams, 
              trend: "+0%" 
            },
            followers: { 
              count: stats.numOfFollowers, 
              trend: "+0%" 
            }
          });
        } else {
          console.error("Failed to fetch statistics:", response.data);
          toast.error("Failed to load statistics");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast.error(error.response?.data?.message || "Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const saId = getSAIdFromToken();
        if (!saId) {
          toast.error("Student Activity ID not found");
          return;
        }

        const response = await axiosInstance().get(
          `/activity/filter?PageIndex=0&PageSize=5&StudentActivityId=${saId}&IsSortedByStartDate=true&IsDescending=true`
        );

        if (response.data?.isSuccess) {
          setRecentActivities(response.data.data || []);
        } else {
          console.error("Failed to fetch recent activities:", response.data);
          toast.error("Failed to load recent activities");
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        toast.error(error.response?.data?.message || "Failed to load recent activities");
      }
    };

    fetchRecentActivities();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get status style
  const getStatusStyle = (isOpened) => {
    return isOpened 
      ? { bgColor: 'bg-green-500/20', textColor: 'text-green-400', text: 'Active' }
      : { bgColor: 'bg-red-500/20', textColor: 'text-red-400', text: 'Closed' };
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1920px] mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-col items-center text-center">
          {saProfile?.pictureUrl ? (
            <img
              src={saProfile.pictureUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-4 border-white/20 mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/64?text=SA";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 mb-4">
              <span className="text-2xl font-bold text-white">
                {saProfile?.name?.charAt(0) || currentUser?.UserName?.charAt(0) || 'S'}
              </span>
            </div>
          )}
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
              Welcome, {saProfile?.name || currentUser?.UserName || "Admin"}!
            </h1>
            <p className="text-gray-100 text-sm sm:text-base">
              {saProfile?.biography ? (
                <span className="line-clamp-2">{saProfile.biography}</span>
              ) : (
                "Manage your student activities, teams, and followers from this dashboard."
              )}
            </p>
          </div>
        </div>
      </div>
    
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Activities" 
          value={dashboardData.activities.count} 
          trend={dashboardData.activities.trend}
          icon={<Activity size={24} />}
          color="bg-blue-600"
          isLoading={isLoading}
          statistics={statistics}
        />
        <StatCard 
          title="Teams" 
          value={dashboardData.teams.count} 
          trend={dashboardData.teams.trend}
          icon={<Users size={24} />}
          color="bg-green-600"
          isLoading={isLoading}
          statistics={statistics}
        />
        <StatCard 
          title="Followers" 
          value={dashboardData.followers.count} 
          trend={dashboardData.followers.trend}
          icon={<Users size={24} />}
          color="bg-purple-500"
          isLoading={isLoading}
          statistics={statistics}
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-gray-600/50">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <TrendingUp className="text-yellow-400" size={20} />
              </div>
              <span>Activity Distribution</span>
            </h2>
          </div>
          <div className="w-full aspect-[4/3] bg-gray-900/30 rounded-lg">
            <div className="w-full h-full">
              <DistributionChart 
                isLoading={isLoading}
                statistics={statistics}
              />
            </div>
          </div>
        </div>

        {/* Activity Type Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-gray-600/50">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <ChartPie className="text-purple-400" size={20} />
              </div>
              <span>Activity Categories</span>
            </h2>
          </div>
          <div className="w-full aspect-[4/3] bg-gray-900/30 rounded-lg">
            <div className="w-full h-full">
              <ActivityTypeChart 
                isLoading={isLoading}
                statistics={statistics}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-blue-400" size={20} />
            Recent Activities
          </h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3 font-medium px-4">Name</th>
                    <th className="pb-3 font-medium px-4">Date</th>
                    <th className="pb-3 font-medium px-4">Type</th>
                    <th className="pb-3 font-medium px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="py-3 px-4"><div className="animate-pulse h-4 w-32 bg-gray-700 rounded"></div></td>
                        <td className="py-3 px-4"><div className="animate-pulse h-4 w-20 bg-gray-700 rounded"></div></td>
                        <td className="py-3 px-4"><div className="animate-pulse h-4 w-16 bg-gray-700 rounded"></div></td>
                        <td className="py-3 px-4"><div className="animate-pulse h-4 w-16 bg-gray-700 rounded"></div></td>
                      </tr>
                    ))
                  ) : (
                    <>
                      {recentActivities.map((activity) => {
                        const status = getStatusStyle(activity.isOpened);
                        return (
                          <tr key={activity.id}>
                            <td className="py-3 px-4 font-medium truncate max-w-[200px]">{activity.title}</td>
                            <td className="py-3 px-4 text-gray-400">{formatDate(activity.startDate)}</td>
                            <td className="py-3 px-4">{activity.activityType}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.textColor}`}>
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {recentActivities.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-gray-400">
                            No activities found
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student-activity/activities')} 
            className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All Activities →
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, trend, icon, color, isLoading, statistics }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:bg-gray-700/50 group relative overflow-hidden border border-gray-700/50 hover:border-gray-600/50">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className={`${color} rounded-full p-2.5 sm:p-3.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg group-hover:shadow-xl`}>
            {icon}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium transition-colors duration-300 group-hover:text-gray-300 mb-2">{title}</p>
          {isLoading ? (
            <div className="animate-pulse h-8 sm:h-9 w-20 sm:w-24 bg-gray-700/50 rounded-lg"></div>
          ) : (
            <p className="text-2xl sm:text-3xl font-bold transition-colors duration-300 group-hover:text-white">{value}</p>
          )}
        </div>

        {/* Tooltip Section */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gray-900/95 backdrop-blur-sm rounded-b-xl opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm text-gray-300 pointer-events-none transform translate-y-full group-hover:translate-y-0 border-t border-gray-700/50">
          {title === "Activities" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium mb-3 transition-colors duration-300 group-hover:text-gray-300">Activity Breakdown</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-500/20 text-blue-400 rounded-lg p-3 text-center shadow-lg shadow-blue-500/10 transition-all duration-300 hover:bg-blue-500/30 hover:shadow-blue-500/20 hover:scale-105 hover:z-10">
                  <p className="font-bold text-base transition-transform duration-300 group-hover:scale-110">{statistics?.numOfEventActivites || 0}</p>
                  <p className="text-[11px] opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">E</p>
                </div>
                <div className="bg-purple-500/20 text-purple-400 rounded-lg p-3 text-center shadow-lg shadow-purple-500/10 transition-all duration-300 hover:bg-purple-500/30 hover:shadow-purple-500/20 hover:scale-105 hover:z-10">
                  <p className="font-bold text-base transition-transform duration-300 group-hover:scale-110">{statistics?.numOfWorkshopActivites || 0}</p>
                  <p className="text-[11px] opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">W</p>
                </div>
                <div className="bg-green-500/20 text-green-400 rounded-lg p-3 text-center shadow-lg shadow-green-500/10 transition-all duration-300 hover:bg-green-500/30 hover:shadow-green-500/20 hover:scale-105 hover:z-10">
                  <p className="font-bold text-base transition-transform duration-300 group-hover:scale-110">{statistics?.numOfCourseActivites || 0}</p>
                  <p className="text-[11px] opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">C</p>
                </div>
              </div>
            </div>
          )}
          {title === "Teams" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium mb-3 transition-colors duration-300 group-hover:text-gray-300">Team Management</p>
              <div className="bg-green-500/20 text-green-400 rounded-lg p-3 text-center shadow-lg shadow-green-500/10 transition-all duration-300 hover:bg-green-500/30 hover:shadow-green-500/20 hover:scale-105 hover:z-10">
                <p className="font-bold text-base transition-transform duration-300 group-hover:scale-110">{value}</p>
                <p className="text-[11px] opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">Active Teams</p>
              </div>
            </div>
          )}
          {title === "Followers" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium mb-3 transition-colors duration-300 group-hover:text-gray-300">Community Growth</p>
              <div className="bg-purple-500/20 text-purple-400 rounded-lg p-3 text-center shadow-lg shadow-purple-500/10 transition-all duration-300 hover:bg-purple-500/30 hover:shadow-purple-500/20 hover:scale-105 hover:z-10">
                <p className="font-bold text-base transition-transform duration-300 group-hover:scale-110">{value}</p>
                <p className="text-[11px] opacity-80 mt-1 transition-opacity duration-300 group-hover:opacity-100">Active Followers</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaDashboard;
