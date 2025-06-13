import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

function TagsSection({ tags }) {
  // If no tags are provided, use default tags
  const defaultTags = [
    "Technology",
    "Education",
    "Leadership",
    "Innovation",
    "Community",
    "Development"
  ];

  const displayTags = tags || defaultTags;

  return (
    <motion.div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Tags</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {displayTags.map((tag, index) => (
          <motion.span
            key={index}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default TagsSection; 