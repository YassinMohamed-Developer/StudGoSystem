import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

function QuickStats({ totalActivities, appliedActivities, upcomingActivities }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-blue-500/20 p-3 rounded-full">
          <Calendar className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Activities</p>
          <p className="text-white text-2xl font-bold">{totalActivities}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-green-500/20 p-3 rounded-full">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Applied Activities</p>
          <p className="text-white text-2xl font-bold">{appliedActivities}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex items-center gap-4">
        <div className="bg-purple-500/20 p-3 rounded-full">
          <Clock className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Upcoming Activities</p>
          <p className="text-white text-2xl font-bold">{upcomingActivities}</p>
        </div>
      </div>
    </div>
  );
}

export default QuickStats; 