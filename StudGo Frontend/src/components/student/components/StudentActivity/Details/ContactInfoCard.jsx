import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfoCard = ({ contactEmail, phone, location }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <Mail className="w-5 h-5" />
        Contact Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-300">
          <Mail className="w-5 h-5 text-blue-400" />
          <span className="truncate">{contactEmail || "Not available"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Phone className="w-5 h-5 text-blue-400" />
          <span>{phone || "Not available"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span>{location || "Not specified"}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard; 