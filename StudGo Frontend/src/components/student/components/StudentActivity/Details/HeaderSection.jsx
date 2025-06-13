import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Globe } from 'lucide-react';

function HeaderSection({ name, role, pictureUrl }) {
  return (
    <div className="relative mb-12 rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        {pictureUrl ? (
          <img
            src={pictureUrl}
            alt={name}
            className="w-full h-[400px] object-cover"
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <User className="w-32 h-32 text-blue-400 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-gray-800"></div>
      </div>
      <div className="relative px-8 py-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 rounded-full border-4 border-blue-500/20 overflow-hidden bg-gray-800/50 backdrop-blur-sm">
              {pictureUrl ? (
                <img
                  src={pictureUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-20 h-20 text-blue-400" />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {name}
          </h1>
          <p className="text-2xl text-gray-300 mb-8">{role}</p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Join Organization
            </button>
            <button className="px-8 py-3 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5" />
              Visit Website
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeaderSection; 