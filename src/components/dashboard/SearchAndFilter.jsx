import React, { useState } from 'react';
import { Search, Filter, X, Tag } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { MOODS } from '../../constants/moods';
import Button from '../ui/Button';

const SearchAndFilter = () => {
  const {
    searchQuery,
    selectedTags,
    selectedMood,
    setSearchQuery,
    setSelectedTags,
    setSelectedMood,
    getAllTags,
  } = useJournal();
  
  const [showFilters, setShowFilters] = useState(false);
  const availableTags = getAllTags();

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(selectedMood?.value === mood.value ? null : mood);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedMood(null);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedMood;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter size={16} />}
        >
          Filters
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Tag size={12} className="mr-1" />
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-blue-600"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          
          {selectedMood && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="mr-1">{selectedMood.emoji}</span>
              {selectedMood.label}
              <button
                onClick={() => setSelectedMood(null)}
                className="ml-1 hover:text-green-600"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Mood Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Mood</h4>
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-2 rounded-lg border transition-colors ${
                    selectedMood?.value === mood.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-gray-600 truncate">{mood.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;