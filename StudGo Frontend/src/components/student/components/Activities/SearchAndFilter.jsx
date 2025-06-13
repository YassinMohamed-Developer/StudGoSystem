import React from 'react';
import { Search } from 'lucide-react';

function SearchAndFilter({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedActivityType, 
  setSelectedActivityType, 
  onSearch 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // Updated categories to match the correct options
  const categories = ['All', 'Technical', 'NonTechnical', 'Mixed'];
  const activityTypes = ['All', 'Workshop', 'Event', 'Course'];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Find Activities</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by activity name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Category dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Activity Type dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search button */}
        <div className="md:col-span-1">
          <button
            onClick={onSearch}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center justify-center"
          >
            <Search className="h-5 w-5 md:mr-1" />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchAndFilter;