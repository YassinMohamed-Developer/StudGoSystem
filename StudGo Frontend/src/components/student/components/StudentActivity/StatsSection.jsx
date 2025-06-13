import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Activity } from 'lucide-react';

const StatsSection = ({ organizationsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{organizationsCount}</h3>
            <p className="text-gray-400">Active Organizations</p>
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Star className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">500+</h3>
            <p className="text-gray-400">Active Members</p>
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <Activity className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">100+</h3>
            <p className="text-gray-400">Monthly Activities</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsSection; 