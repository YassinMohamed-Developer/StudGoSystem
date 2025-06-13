import React from 'react';
import { BookOpen, CheckCircle, Calendar } from 'lucide-react';

const QuickStats = ({ totalWorkshops, appliedWorkshops, upcomingWorkshops }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-blue-500/20 p-3 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">Total Workshops</h3>
          <p className="text-2xl font-bold text-white">{totalWorkshops}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-green-500/20 p-3 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">Applied Workshops</h3>
          <p className="text-2xl font-bold text-white">{appliedWorkshops}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-purple-500/20 p-3 rounded-lg">
          <Calendar className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">Upcoming Workshops</h3>
          <p className="text-2xl font-bold text-white">{upcomingWorkshops}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats; 