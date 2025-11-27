import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterCategory, PaperType, Semester } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FilterCategory;
  setSelectedCategory: (category: FilterCategory) => void;
  categories: string[];
  selectedPaperType: PaperType | 'All';
  setSelectedPaperType: (type: PaperType | 'All') => void;
  selectedSemester: Semester | 'All';
  setSelectedSemester: (sem: Semester | 'All') => void;
}

const paperTypes: { value: PaperType | 'All'; label: string }[] = [
  { value: 'All', label: 'All Types' },
  { value: 'final', label: 'Final' },
  { value: 'midterm', label: 'Mid-Term' },
];

const semesters: { value: Semester | 'All'; label: string }[] = [
  { value: 'All', label: 'All Semesters' },
  { value: 1, label: 'Sem 1' },
  { value: 2, label: 'Sem 2' },
  { value: 3, label: 'Sem 3' },
  { value: 4, label: 'Sem 4' },
  { value: 5, label: 'Sem 5' },
  { value: 6, label: 'Sem 6' },
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedPaperType,
  setSelectedPaperType,
  selectedSemester,
  setSelectedSemester,
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

      {/* Semester Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
        <div className="flex items-center gap-2 text-gray-600 min-w-fit">
          <span className="text-sm font-medium">Semester:</span>
        </div>
        
        {semesters.map((sem) => (
          <button
            key={sem.value}
            onClick={() => setSelectedSemester(sem.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 min-w-fit ${
              selectedSemester === sem.value
                ? 'bg-gradient-to-r from-sunny-400 to-sunny-300 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-sunny-50 border border-sunny-200'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>

      {/* Paper Type Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-3">
        <div className="flex items-center gap-2 text-gray-600 min-w-fit">
          <span className="text-sm font-medium">Type:</span>
        </div>
        
        {paperTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedPaperType(type.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 min-w-fit ${
              selectedPaperType === type.value
                ? 'bg-gradient-to-r from-mint-400 to-mint-300 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-mint-50 border border-mint-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-gray-600 min-w-fit">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Category:</span>
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
