import React from 'react';
import { CalendarDays, CalendarCheck } from 'lucide-react';

const ActivityCalendarCard = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <CalendarDays className="w-5 h-5" />
        Activity Calendar
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors ${
                i === 15
                  ? 'bg-blue-500 text-white'
                  : i > 0 && i < 31
                  ? 'hover:bg-gray-700/50'
                  : 'text-gray-700'
              }`}
            >
              {i > 0 && i < 31 ? i : ''}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="w-full bg-blue-600/80 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <CalendarCheck className="w-4 h-4" />
            View Full Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendarCard; 