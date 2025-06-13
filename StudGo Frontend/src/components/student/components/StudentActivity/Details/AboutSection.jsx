import React from 'react';
import { BookOpen } from 'lucide-react';

const AboutSection = ({ biography, description }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <BookOpen className="w-6 h-6" />
        About
      </h2>
      <p className="text-gray-300 leading-relaxed">
        {biography || description || "No description available."}
      </p>
    </div>
  );
};

export default AboutSection; 