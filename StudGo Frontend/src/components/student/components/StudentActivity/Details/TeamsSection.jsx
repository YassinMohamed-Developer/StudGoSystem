import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../../../../lib/axios';
import { Users, X, Info } from 'lucide-react';

const TeamsSection = ({ studentActivityId }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const defaultTeamImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%230A84FF' rx='75'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='40' font-weight='bold' text-anchor='middle' fill='white'%3ET%3C/text%3E%3C/svg%3E";

  const { data: teamsData, isLoading, error } = useQuery(
    ['teams', studentActivityId],
    async () => {
      const { data } = await axiosInstance().get(`/team/sa/${studentActivityId}`);
      return data.data;
    },
    {
      enabled: !!studentActivityId,
    }
  );

  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-center h-40">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/50 group-hover:border-red-500 transition-all duration-300">
          <p className="text-red-400">Failed to load teams. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-6 group-hover:text-blue-400 transition-colors">Teams</h2>
        
        {teamsData && teamsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamsData.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTeam(team)}
                className="relative group/card cursor-pointer"
              >
                <div className="relative bg-gray-800/80 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-600 group-hover/card:border-blue-500/50 transition-all duration-300">
                      {team.imageUrl ? (
                        <img
                          src={team.imageUrl}
                          alt={team.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = defaultTeamImage;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={defaultTeamImage}
                            alt={team.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate group-hover/card:text-blue-400 transition-colors">
                        {team.name}
                      </h3>
                    </div>
                    <Info className="w-5 h-5 text-blue-400 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No teams available.</p>
        )}
      </div>

      {/* Description Popup */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-800/90 rounded-xl p-6 border border-gray-700 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-600">
                  {selectedTeam.imageUrl ? (
                    <img
                      src={selectedTeam.imageUrl}
                      alt={selectedTeam.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultTeamImage;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={defaultTeamImage}
                        alt={selectedTeam.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedTeam.name}</h3>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed">
                  {selectedTeam.description || "No description available."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsSection;
