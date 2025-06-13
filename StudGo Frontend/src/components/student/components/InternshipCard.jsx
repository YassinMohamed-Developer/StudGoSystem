import PropTypes from 'prop-types';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const InternshipCard = ({ internship, onViewDetails }) => {
  return (
    <div 
      className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 shadow-lg hover:shadow-xl flex flex-col"
    >
      <div className="h-56 relative">
        <img 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt={internship.company}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm backdrop-blur-sm border border-blue-500/20">
            {internship.type}
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm backdrop-blur-sm border border-green-500/20">
            {internship.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-700/50 group-hover:border-gray-600/50 transition-colors">
            <img 
              src={internship.logo} 
              alt={internship.company} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[200px]">
            <h3 className="font-bold text-lg text-white truncate group-hover:text-blue-400 transition-colors">
              {internship.company}
            </h3>
            <p className="text-gray-400 text-sm truncate">{internship.title}</p>
          </div>
        </div>

        <InternshipDetails internship={internship} />

        <div className="mt-auto pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => onViewDetails(internship)}
              className="flex-1 px-4 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              View Details
            </button>
            <button 
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InternshipDetails = ({ internship }) => {
  return (
    <>
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span className="truncate">{internship.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>{internship.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>{internship.stipend}</span>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="font-semibold mb-3 text-gray-300">Requirements:</h4>
        <div className="flex flex-wrap gap-2">
          {internship.requirements.map((req, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-5 line-clamp-2">{internship.description}</p>
    </>
  );
};

InternshipCard.propTypes = {
  internship: PropTypes.shape({
    company: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    stipend: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

InternshipDetails.propTypes = {
  internship: PropTypes.shape({
    location: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    stipend: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default InternshipCard; 