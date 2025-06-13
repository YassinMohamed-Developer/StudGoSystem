import React from 'react';
import { Trophy, Award } from 'lucide-react';

const AchievementsSection = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Trophy className="w-6 h-6" />
        Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((_, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">2024</span>
            </div>
            <h3 className="text-white font-medium mb-1">Achievement Title {index + 1}</h3>
            <p className="text-gray-300 text-sm">
              Description of the achievement and its significance.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection; 