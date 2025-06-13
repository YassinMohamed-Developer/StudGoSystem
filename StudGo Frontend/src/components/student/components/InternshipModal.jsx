import PropTypes from 'prop-types';
import { X, MapPin, Clock, Briefcase, Building2, Globe, GraduationCap, ExternalLink } from 'lucide-react';

const InternshipModal = ({ internship, onClose }) => {
  if (!internship) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-6 border-b border-gray-700/50 rounded-t-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{internship.title}</h2>
              <div className="flex items-center text-gray-400 mb-1">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{internship.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-gray-400">{internship.location}</p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Job Type</span>
              </div>
              <p className="text-gray-400">{internship.type}</p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Workplace</span>
              </div>
              <p className="text-gray-400">{internship.workplace}</p>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Career Level</span>
              </div>
              <p className="text-gray-400">{internship.careerLevel}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Description</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line">{internship.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {internship.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Category */}
          {internship.category && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Category</h3>
              <p className="text-gray-300">{internship.category}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800/95 backdrop-blur-sm p-6 border-t border-gray-700/50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            {internship.jobUrl && (
              <a
                href={internship.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

InternshipModal.propTypes = {
  internship: PropTypes.shape({
    id: PropTypes.number.isRequired,
    company: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
    workplace: PropTypes.string,
    category: PropTypes.string,
    careerLevel: PropTypes.string,
    jobUrl: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default InternshipModal; 