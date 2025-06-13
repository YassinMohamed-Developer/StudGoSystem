import React from 'react';
import { Target } from 'lucide-react';

const MissionVisionSection = ({ mission, vision }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Target className="w-6 h-6" />
        Mission & Vision
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Mission</h3>
          <p className="text-gray-300">
            {mission || "To empower students through meaningful activities and experiences."}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Vision</h3>
          <p className="text-gray-300">
            {vision || "To be the leading student organization fostering growth and development."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionVisionSection; 