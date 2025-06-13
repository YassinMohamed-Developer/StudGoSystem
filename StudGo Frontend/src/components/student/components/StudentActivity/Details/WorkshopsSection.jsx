import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Users, MapPin } from 'lucide-react';

function WorkshopsSection() {
  const workshops = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      date: "2024-04-25",
      time: "3:00 PM",
      location: "Lab 201",
      participants: 30,
      description: "Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop."
    },
    {
      id: 2,
      title: "UI/UX Design Workshop",
      date: "2024-05-01",
      time: "1:00 PM",
      location: "Design Studio",
      participants: 25,
      description: "Master the principles of user interface and experience design."
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
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Workshops & Talks</h2>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {workshops.map((workshop) => (
          <div 
            key={workshop.id}
            className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                {workshop.title}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-4 line-clamp-2">{workshop.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{workshop.participants} seats</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{workshop.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {workshop.date} at {workshop.time}
              </div>
              <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default WorkshopsSection; 