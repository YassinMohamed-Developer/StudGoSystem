import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Star, TrendingUp } from 'lucide-react';

const FeaturedOrganizationsSection = ({ organizations }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-400">
        <TrendingUp className="w-6 h-6" />
        Featured Organizations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.slice(0, 3).map((org, index) => (
          <motion.div
            key={org.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-blue-500/20">
                {org.pictureUrl == null ? (
                  <img
                    src={org.pictureUrl}
                    alt={org.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                <p className="text-sm text-gray-400">{org.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {org.description || 'No description available'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="text-sm">4.8</span>
              </div>
              <Link to={`/studentactivity/${org.id}`}>
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  Learn More →
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedOrganizationsSection; 