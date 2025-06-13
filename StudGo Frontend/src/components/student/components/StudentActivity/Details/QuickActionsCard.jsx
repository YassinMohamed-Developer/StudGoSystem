import React from 'react';
import { Target, Users, Globe, Award } from 'lucide-react';

const QuickActionsCard = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Target className="w-5 h-5" />
        Quick Actions
      </h2>
      <div className="space-y-3">
        <button className="w-full bg-blue-600/80 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          Join Organization
        </button>
        <button className="w-full bg-purple-600/80 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Globe className="w-4 h-4" />
          Visit Website
        </button>
        <button className="w-full bg-green-600/80 hover:bg-green-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Award className="w-4 h-4" />
          View Achievements
        </button>
      </div>
    </div>
  );
};

export default QuickActionsCard; 