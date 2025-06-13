import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative h-[400px] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50"></div>
      </div>
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Workshops
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enhance your skills and knowledge through our interactive workshops
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 