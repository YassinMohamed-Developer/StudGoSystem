import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

function UpcomingEventsSection() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      participants: 200,
      description: "Join us for a day of technological innovation and networking opportunities."
    },
    {
      id: 2,
      title: "Leadership Workshop",
      date: "2024-04-20",
      time: "2:00 PM",
      location: "Conference Room A",
      participants: 50,
      description: "Develop essential leadership skills through interactive sessions and expert guidance."
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
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {upcomingEvents.map((event) => (
          <div 
            key={event.id}
            className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">{event.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.participants} seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default UpcomingEventsSection; 