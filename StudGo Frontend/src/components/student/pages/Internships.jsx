import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Briefcase, Building2, Filter, ArrowRight, X } from 'lucide-react';
import InternshipCard from '../components/InternshipCard';
import InternshipModal from '../components/InternshipModal';
import { axiosInstance } from '../../../lib/axios';

const Internships = () => {
  const [titleQuery, setTitleQuery] = useState('');
  const [requirementsQuery, setRequirementsQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance().get('/InternShip/GetInternShip/filter', {
        params: {
          JobRequirements: requirementsQuery,
          PageIndex: pageIndex,
          PageSize: pageSize,
          JobTitle: titleQuery
        }
      });

      if (response.data.isSuccess) {
        setInternships(response.data.data);
        setTotalCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [pageIndex]);

  const handleSearch = () => {
    setPageIndex(0);
    fetchInternships();
  };

  const handleClearSearch = () => {
    setTitleQuery('');
    setRequirementsQuery('');
    setPageIndex(0);
  };

  const handleViewDetails = (internship) => {
    const formattedInternship = {
      id: internship.id,
      company: internship.company,
      logo: "https://via.placeholder.com/50",
      title: internship.jobTitle,
      location: internship.address,
      type: internship.jobType,
      duration: "Not specified",
      stipend: "Not specified",
      requirements: internship.jobRequirements ? internship.jobRequirements.split('\n').filter(req => req.trim()) : [],
      description: internship.jobDescription,
      deadline: "Not specified",
      workplace: internship.workplace,
      category: internship.category,
      careerLevel: internship.careerLevel,
      jobUrl: internship.jobUrl
    };
    setCurrentInternship(formattedInternship);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentInternship(null);
  };

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2784&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-gray-900/80"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Find Your Dream Internship
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover opportunities that match your skills and career goals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by job title..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition-all duration-300"
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by requirements..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-white placeholder-gray-400 transition-all duration-300"
                  value={requirementsQuery}
                  onChange={(e) => setRequirementsQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleSearch}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
              {(titleQuery || requirementsQuery) && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-400 text-center">
          Found {totalCount} internships
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading internships...</p>
          </div>
        )}

        {/* Internships Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 hover:transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {internship.jobTitle}
                    </h3>
                    <div className="flex items-center text-gray-400 mb-1">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span className="line-clamp-1">{internship.company}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{internship.address}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{internship.jobType}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(internship)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}

            {/* No Results Message */}
            {internships.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No internships found matching your criteria.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Pagination */}
        {internships.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-700/50 shadow-xl">
              <button
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="p-3 bg-gray-700/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(0)}
                  className={`min-w-[40px] h-10 px-4 rounded-lg transition-all duration-300 border ${
                    pageIndex === 0
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                      : 'bg-gray-700/80 hover:bg-gray-700 border-gray-600/50 hover:border-blue-500/50'
                  }`}
                >
                  1
                </button>

                {/* Left Ellipsis */}
                {pageIndex > 2 && (
                  <span className="text-gray-400 px-2">...</span>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => {
                  if (
                    i > 0 && 
                    i < totalPages - 1 && 
                    Math.abs(i - pageIndex) <= 1
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`min-w-[40px] h-10 px-4 rounded-lg transition-all duration-300 border ${
                          pageIndex === i
                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                            : 'bg-gray-700/80 hover:bg-gray-700 border-gray-600/50 hover:border-blue-500/50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  return null;
                })}

                {/* Right Ellipsis */}
                {pageIndex < totalPages - 3 && (
                  <span className="text-gray-400 px-2">...</span>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    className={`min-w-[40px] h-10 px-4 rounded-lg transition-all duration-300 border ${
                      pageIndex === totalPages - 1
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-110'
                        : 'bg-gray-700/80 hover:bg-gray-700 border-gray-600/50 hover:border-blue-500/50'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={pageIndex >= totalPages - 1}
                className="p-3 bg-gray-700/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-sm text-gray-300 bg-gray-800/80 px-6 py-3 rounded-lg border border-gray-700/50 shadow-lg">
              Page {pageIndex + 1} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <InternshipModal
          internship={currentInternship}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Internships; 