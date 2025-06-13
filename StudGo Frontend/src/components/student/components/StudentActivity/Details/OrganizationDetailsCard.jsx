import React from 'react';
import { Building2, Calendar, Users, Activity } from 'lucide-react';

const OrganizationDetailsCard = ({ foundingDate, memberCount, lastActivity }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Building2 className="w-5 h-5" />
        Organization Details
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>Founded: {new Date(foundingDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Users className="w-5 h-5 text-blue-400" />
          <span>Members: {memberCount || "Not specified"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Last Activity: {lastActivity || "No recent activity"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsCard; 