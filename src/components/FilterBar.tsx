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
    <div className="mb-10 animate-slide-up animate-delay-100">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-14 text-base"
        />
      </div>

      {/* Paper Type Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-4">
        <div className="flex items-center gap-2 text-gray-700 min-w-fit">
          <span className="text-sm font-semibold">Type:</span>
        </div>
        
        {paperTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedPaperType(type.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 min-w-fit ${
              selectedPaperType === type.value
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-200 shadow-sm'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Semester Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-4">
        <div className="flex items-center gap-2 text-gray-700 min-w-fit">
          <span className="text-sm font-semibold">Semester:</span>
        </div>
        
        {semesters.map((sem) => (
          <button
            key={sem.value}
            onClick={() => setSelectedSemester(sem.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 min-w-fit ${
              selectedSemester === sem.value
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-200 shadow-sm'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3">
        <div className="flex items-center gap-2 text-gray-700 min-w-fit">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-semibold">Category:</span>
        </div>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as FilterCategory)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 min-w-fit ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-200 shadow-sm'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
