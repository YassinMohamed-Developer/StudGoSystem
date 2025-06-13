import React from 'react';

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 py-16">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Activities
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore a variety of events and workshops to enhance your skills, network with peers, and make the most of your academic journey.
        </p>
      </div>
    </div>
  );
}

export default HeroSection; 