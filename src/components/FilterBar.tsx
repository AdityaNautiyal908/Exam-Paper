import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterCategory } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FilterCategory;
  setSelectedCategory: (category: FilterCategory) => void;
  categories: string[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: FilterBarProps) {
  return (
    <div className="mb-8 animate-slide-up animate-delay-100">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12 text-base"
        />
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-gray-600 min-w-fit">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as FilterCategory)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 min-w-fit ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-lavender-50 border border-lavender-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
