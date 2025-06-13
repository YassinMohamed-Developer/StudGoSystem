import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery } from 'react-query';
import { axiosInstance } from '../../../lib/axios';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Users, Filter, CheckSquare } from 'lucide-react';
import HeroSection from '../components/StudentActivity/HeroSection';
import OrganizationsGrid from '../components/StudentActivity/OrganizationsGrid';

function StudentActivityHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [canApplyFilter, setCanApplyFilter] = useState(false);
  
  // Query parameters state
  const [queryParams, setQueryParams] = useState({
    pageIndex: 0,
    searchTerm: "",
    canApply: false
  });

  // Fetch student activities using React Query
  const { data: organizationsData = { data: [], count: 0 }, isLoading, error } = useQuery(
    ["studentActivities", queryParams],
    async () => {
      const params = {
        PageIndex: queryParams.pageIndex,
        PageSize: pageSize,
        StudentActivityName: queryParams.searchTerm || null,
        StudentActivityId: null,
        CanApply: queryParams.canApply || null
      };
      const { data } = await axiosInstance().get("/sa/filter", { params });
      return data;
    },
    {
      keepPreviousData: true
    }
  );

  // Update total pages when data changes
  useEffect(() => {
    if (organizationsData?.count) {
      const newTotalPages = Math.ceil(organizationsData.count / pageSize);
      setTotalPages(newTotalPages);
    }
  }, [organizationsData?.count, pageSize]);

  // Handle search with useCallback
  const handleSearch = useCallback(() => {
    setSearchTerm(searchQuery);
    setPageIndex(0);
    setQueryParams({
      pageIndex: 0,
      searchTerm: searchQuery,
      canApply: canApplyFilter
    });
  }, [searchQuery, canApplyFilter]);

  // Toggle CanApply filter
  const toggleCanApplyFilter = useCallback(() => {
    const newCanApplyValue = !canApplyFilter;
    setCanApplyFilter(newCanApplyValue);
    setPageIndex(0);
    setQueryParams({
      pageIndex: 0,
      searchTerm: searchTerm,
      canApply: newCanApplyValue
    });
  }, [canApplyFilter, searchTerm]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPageIndex(newPage);
    setQueryParams(prev => ({
      ...prev,
      pageIndex: newPage
    }));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
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
          className="h-16 w-16 border-t-2 border-b-2 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-red-500 bg-red-900/20 p-4 rounded-lg border border-red-500"
        >
          Failed to load student activities. Please try again later.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-y-auto">
      <HeroSection />
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="max-w-2xl mx-auto mb-2">
              <div className="relative flex mb-4">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-r-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filter toggle for open applications */}
              <div className="flex items-center justify-center">
                <button
                  onClick={toggleCanApplyFilter}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    canApplyFilter
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {canApplyFilter ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Filter className="w-5 h-5" />
                  )}
                  <span>
                    {canApplyFilter ? 'Showing Activities with Open Applications' : 'Show Activities with Open Applications'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <OrganizationsGrid 
            filteredOrganizations={organizationsData.data || []} 
            renderCard={(studentActivity) => (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-600 group-hover:border-blue-500/50 transition-all duration-300">
                    {studentActivity.pictureUrl ? (
                      <img
                        src={studentActivity.pictureUrl}
                        alt={studentActivity.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultImageUrl;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={defaultImageUrl}
                          alt={studentActivity.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                      {studentActivity.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {studentActivity.university}
                    </p>
                  </div>
                </div>
              </div>
            )}
          />
        </motion.div>

        {(!organizationsData.data || organizationsData.data.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-block p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <p className="text-gray-400 text-lg">No organizations found matching your search.</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center items-center space-x-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
              pageIndex === 0
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </motion.button>

          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              Page {pageIndex + 1} of {totalPages}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
              pageIndex >= totalPages - 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentActivityHome;