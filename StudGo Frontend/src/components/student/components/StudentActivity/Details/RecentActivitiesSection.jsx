import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Users, MapPin } from 'lucide-react';

function RecentActivitiesSection({ description }) {
  const recentActivities = [
    {
      id: 1,
      title: "Annual General Meeting",
      date: "2024-03-15",
      time: "14:00",
      participants: 45,
      location: "Main Hall",
      description: "Quarterly meeting to discuss organization's progress and future plans."
    },
    {
      id: 2,
      title: "Community Service Day",
      date: "2024-03-10",
      time: "09:00",
      participants: 30,
      location: "City Park",
      description: "Volunteer event to clean and maintain local community spaces."
    }
  ];

  return (
    <motion.div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {recentActivities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{activity.date}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">{activity.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{activity.participants} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{activity.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default RecentActivitiesSection; 