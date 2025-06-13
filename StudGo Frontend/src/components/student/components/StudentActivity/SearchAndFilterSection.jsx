import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchAndFilterSection = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  organizations, 
  selectedCategory, 
  setSelectedCategory,
  onFilterChange 
}) => {
  const handleClearSearch = () => {
    setSearchQuery("");
    onFilterChange(organizations);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchQuery ? (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-white"
            >
              <FiX className="w-5 h-5" />
            </button>
          ) : (
            <FiSearch className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {["CS", "academic", "Engineering", "Business", "social"].map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              const filtered = category === "all" 
                ? organizations 
                : organizations.filter(org => org.category === category);
              onFilterChange(filtered);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilterSection; 