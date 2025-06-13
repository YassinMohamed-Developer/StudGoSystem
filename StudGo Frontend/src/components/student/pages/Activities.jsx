import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../../lib/axios';

// Import components
import HeroSection from '../components/Activities/HeroSection';
import QuickStats from '../components/Activities/QuickStats';
import SearchAndFilter from '../components/Activities/SearchAndFilter';
import ActivityCard from '../components/Activities/ActivityCard';

function Activities() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivityType, setSelectedActivityType] = useState('All');
  const [appliedActivityIds, setAppliedActivityIds] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // Fetch states data
  const { data: statesData, isLoading: statesLoading } = useQuery(
    'states',
    async () => {
      const { data } = await axiosInstance().get("/State/GetStates");
      return data.data;
    }
  );

  // Fetch activities data with filtering
  const { data: activitiesData = { data: [], count: 0 }, isLoading: activitiesLoading, error } = useQuery(
    ['activities', searchQuery, selectedCategory, selectedActivityType, pageIndex],
    async () => {
      const { data } = await axiosInstance().get("/activity/filter", {
        params: {
          Name: searchQuery,
          PageIndex: pageIndex,
          PageSize: pageSize,
          // Only include category filter if not "All"
          ...(selectedCategory !== 'All' && { ActivityCategory: selectedCategory }),
          // Only include activity type filter if not "All"
          ...(selectedActivityType !== 'All' && { ActivityType: selectedActivityType })
        }
      });
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const isLoading = statesLoading || activitiesLoading;

  const filteredActivities = activitiesData.data;

  // Calculate total pages using the count from API
  const totalPages = Math.ceil(activitiesData.count / pageSize);

  // Handle page navigation
  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  // Handle search and filter changes
  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPageIndex(0);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Reset to first page when category changes
    setPageIndex(0);
  };

  const handleActivityTypeChange = (value) => {
    setSelectedActivityType(value);
    // Reset to first page when activity type changes
    setPageIndex(0);
  };

  const handleApply = async (id) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('You need to be logged in to apply for activities.');
        return;
      }
      
      // Call the apply endpoint with the activity ID
      await axiosInstance().post(`/activity/${id}/apply`);
      
      // Add the activity ID to appliedActivityIds
      setAppliedActivityIds([...appliedActivityIds, id]);
      
      toast.success('Successfully applied to the activity!');
    } catch (error) {
      console.error('Error applying to activity:', error);
      
      // Handle 400 Bad Request errors
      if (error.response && error.response.status === 400) {
        // Check if there are validation errors in the response
        if (error.response.data && error.response.data.errors) {
          // Display each validation error message
          const errorMessages = error.response.data.errors;
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach(message => {
              toast.error(message);
            });
          } else if (typeof errorMessages === 'object') {
            // If errors is an object with field names as keys
            Object.values(errorMessages).forEach(messages => {
              if (Array.isArray(messages)) {
                messages.forEach(message => toast.error(message));
              } else {
                toast.error(messages);
              }
            });
          } else {
            // If errors is a single string
            toast.error(errorMessages);
          }
        } else if (error.response.data && error.response.data.message) {
          // If there's a single error message
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to apply to the activity. Please check your input and try again.');
        }
      } else if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        toast.error('You need to be logged in to apply for activities.');
      } else {
        // Generic error for other status codes
        toast.error('Failed to apply to the activity. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Failed to load activities. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <QuickStats 
          totalActivities={statesData?.totalActivities || 0} 
          appliedActivities={(statesData?.appliedEvents || 0) + (statesData?.appliedWorkshops || 0)}
          upcomingActivities={statesData?.upcomingActivities || 0}
        />
        
        <div className="mt-8">
          <SearchAndFilter 
            searchQuery={searchInput}
            setSearchQuery={handleSearchInputChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedActivityType={selectedActivityType}
            setSelectedActivityType={handleActivityTypeChange}
            onSearch={handleSearchSubmit}
          />
        </div>

        {filteredActivities.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] mt-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg w-full max-w-md">
              <p className="text-xl text-gray-300">No activities found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isApplied={appliedActivityIds.includes(activity.id)}
                onApply={() => handleApply(activity.id)}
              />
            ))}
          </div>
        )}

        {filteredActivities.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
              <button
                onClick={handlePrevPage}
                disabled={pageIndex === 0}
                className={`flex items-center justify-center rounded-md px-2 py-1.5 sm:px-3 sm:py-2 ${
                  pageIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </button>
              
              <div className="flex items-center justify-center px-3 py-1.5 bg-gray-700 rounded-md text-sm">
                <span className="text-gray-300">
                  {pageIndex + 1} of {totalPages || 1}
                </span>
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1}
                className={`flex items-center justify-center rounded-md px-2 py-1.5 sm:px-3 sm:py-2 ${
                  pageIndex >= totalPages - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;