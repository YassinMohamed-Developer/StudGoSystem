import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import { toast } from 'react-hot-toast';
import { MapPin, ChevronRight, X } from 'lucide-react';

const FollowedStudentActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default image URL for activities without pictures
  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%230A84FF' rx='75'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' font-weight='bold' text-anchor='middle' fill='white'%3ESA%3C/text%3E%3C/svg%3E";

  // Fetch followed student activities
  const fetchFollowedActivities = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance()({
        method: 'get',
        url: '/sa/student/followed-sa'
      });

      if (response.data && response.data.data) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching followed activities:', err);
      toast.error('Failed to fetch followed activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedActivities();
  }, []);

  const handleViewDetails = (activityId) => {
    navigate(`/studentactivity/${activityId}`);
  };

  const handleUnfollow = async (activityId, e) => {
    e.stopPropagation();
    try {
      await axiosInstance()({
        method: 'post',
        url: `/sa/student/unfollow-sa/${activityId}`
      });
      toast.success('Successfully unfollowed the activity');
      fetchFollowedActivities();
    } catch (error) {
      console.error('Error unfollowing activity:', error);
      toast.error('Failed to unfollow activity');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Followed Activities</h1>
          <p className="text-gray-400 text-lg">Stay updated with your favorite student activities</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Activities</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchFollowedActivities}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No Followed Activities Yet</h3>
            <p className="text-gray-400 mb-4">Start following student activities to see them here</p>
            <button
              onClick={() => navigate('/student-activities')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Explore Activities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
                onClick={() => handleViewDetails(activity.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  {activity.pictureUrl ? (
                    <img
                      src={activity.pictureUrl}
                      alt={activity.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = defaultImageUrl;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                      <img
                        src={defaultImageUrl}
                        alt={activity.name}
                        className="w-24 h-24"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    {activity.name}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{activity.description}</p>
                  
                  {activity.location && (
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedStudentActivities;