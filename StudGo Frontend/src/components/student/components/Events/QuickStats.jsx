import React from 'react';
import { CalendarIcon, CheckCircle2, Clock } from 'lucide-react';

function QuickStats({ totalEvents, appliedEvents, upcomingEvents }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{totalEvents}</h3>
            <p className="text-gray-400">Total Events</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{appliedEvents}</h3>
            <p className="text-gray-400">Applied Events</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{upcomingEvents}</h3>
            <p className="text-gray-400">Upcoming Events</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickStats; 