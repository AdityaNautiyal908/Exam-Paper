import { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import SubjectCard from './components/SubjectCard';
import PDFViewer from './components/PDFViewer';
import Footer from './components/Footer';
import AnimatedBackdrop from './components/AnimatedBackdrop';
import PageIntro from './components/PageIntro';
import FirstVisitModal from './components/auth/FirstVisitModal';
import { usePapers } from './hooks/usePapers';
import { useAnalytics } from './hooks/useAnalytics';
import { categories } from './utils/papers';
import { QuestionPaper, FilterCategory, PaperType, Semester } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  // Get trackAction for tracking paper views
  const { trackAction } = useAnalytics();
  
  // Load papers dynamically from Supabase
  const { finalPapers, midtermPapers, isLoading, error } = usePapers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType | 'All'>('All');
  const [selectedSemester, setSelectedSemester] = useState<Semester | 'All'>('All');

  // Total counts
  const totalFinalCount = useMemo(
    () => finalPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    [finalPapers]
  );
  const totalMidtermCount = useMemo(
    () => midtermPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    [midtermPapers]
  );
  const totalFileCount = totalFinalCount + totalMidtermCount;

  // Filter papers based on search, category, and semester
  const filterPapers = (papers: QuestionPaper[]) => {
    return papers.filter((paper) => {
      const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || paper.category === selectedCategory;
      const matchesSemester = selectedSemester === 'All' || paper.semester === selectedSemester;
      return matchesSearch && matchesCategory && matchesSemester;
    });
  };

  const filteredFinalPapers = useMemo(() => filterPapers(finalPapers), [searchQuery, selectedCategory, selectedSemester]);
  const filteredMidtermPapers = useMemo(() => filterPapers(midtermPapers), [searchQuery, selectedCategory, selectedSemester]);

  const filteredFinalCount = useMemo(
    () => filteredFinalPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    [filteredFinalPapers]
  );
  const filteredMidtermCount = useMemo(
    () => filteredMidtermPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    [filteredMidtermPapers]
  );
  const filteredFileCount = filteredFinalCount + filteredMidtermCount;

  // Group papers by semester then category
  const groupPapersBySemester = (papers: QuestionPaper[]) => {
    const grouped: Record<number, Record<string, QuestionPaper[]>> = {};
    papers.forEach((paper) => {
      if (!grouped[paper.semester]) {
        grouped[paper.semester] = {};
      }
      if (!grouped[paper.semester][paper.category]) {
        grouped[paper.semester][paper.category] = [];
      }
      grouped[paper.semester][paper.category].push(paper);
    });
    return grouped;
  };

  const groupedFinalPapers = useMemo(() => groupPapersBySemester(filteredFinalPapers), [filteredFinalPapers]);
  const groupedMidtermPapers = useMemo(() => groupPapersBySemester(filteredMidtermPapers), [filteredMidtermPapers]);

  const orderedCategories = categories.filter((category) => category !== 'All');
  const semesterList = [1, 2, 3, 4, 5, 6] as Semester[];

  const showFinal = selectedPaperType === 'All' || selectedPaperType === 'final';
  const showMidterm = selectedPaperType === 'All' || selectedPaperType === 'midterm';

  const renderPapersSection = (
    title: string,
    papers: QuestionPaper[],
    groupedPapers: Record<number, Record<string, QuestionPaper[]>>,
    badgeColor: string
  ) => {
    if (papers.length === 0) return null;
    const fileCount = papers.reduce((sum, subject) => sum + subject.files.length, 0);

    const semestersToShow = selectedSemester === 'All' 
      ? semesterList.filter(sem => groupedPapers[sem] && Object.keys(groupedPapers[sem]).length > 0)
      : [selectedSemester].filter(sem => groupedPapers[sem] && Object.keys(groupedPapers[sem]).length > 0);

    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="section-title">{title}</h2>
          <span className={`px-4 py-1.5 ${badgeColor} rounded-lg text-sm font-bold text-gray-700 shadow-sm`}>
            {fileCount} paper{fileCount !== 1 ? 's' : ''}
          </span>
        </div>

        {semestersToShow.map((semester) => {
          const semesterPapers = groupedPapers[semester];
          if (!semesterPapers) return null;

          const semesterFileCount = Object.values(semesterPapers)
            .flat()
            .reduce((sum, paper) => sum + paper.files.length, 0);

          return (
            <div key={`${title}-sem${semester}`} className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-lg text-sm font-bold shadow-md">
                  Semester {semester}
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {semesterFileCount} paper{semesterFileCount !== 1 ? 's' : ''}
                </span>
              </div>

              {orderedCategories.map((category) => {
                const papersInCategory = semesterPapers[category];
                if (!papersInCategory || papersInCategory.length === 0) return null;
                const categoryFileCount = papersInCategory.reduce(
                  (sum, subject) => sum + subject.files.length,
                  0
                );

                return (
                  <section key={`${title}-sem${semester}-${category}`} className="mb-8 ml-2 animate-slide-up">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">
                          {categoryFileCount} paper{categoryFileCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {papersInCategory.map((paper, index) => (
                        <SubjectCard
                          key={paper.id}
                          paper={paper}
                          onClick={() => {
                            setSelectedPaper(paper);
                            trackAction('view_paper', {
                              subject: paper.subject,
                              category: paper.category,
                              semester: paper.semester,
                              paperType: paper.paperType,
                            });
                          }}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const hasResults = filteredFinalPapers.length > 0 || filteredMidtermPapers.length > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-700 font-medium">Loading papers from Supabase...</p>
        <p className="text-gray-500 text-sm mt-2">This may take a moment on first load</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Papers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageIntro />
      <AnimatedBackdrop />
      <FirstVisitModal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header totalPapers={totalFileCount} />

        {/* Stats */}
        <StatsCard 
          totalPapers={totalFileCount}
          totalCategories={categories.length - 1}
          filteredCount={filteredFileCount}
          finalCount={totalFinalCount}
          midtermCount={totalMidtermCount}
        />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          selectedPaperType={selectedPaperType}
          setSelectedPaperType={setSelectedPaperType}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
        />

        {/* Papers Grid */}
        {hasResults ? (
          <>
            {showFinal && renderPapersSection(
              '📝 Final Papers',
              filteredFinalPapers,
              groupedFinalPapers,
              'bg-lavender-100 text-lavender-700'
            )}
            {showMidterm && renderPapersSection(
              '📋 Mid-Term Papers',
              filteredMidtermPapers,
              groupedMidtermPapers,
              'bg-mint-100 text-mint-700'
            )}
          </>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No papers found</h3>
            <p className="text-gray-600 font-medium">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* PDF/Image Viewer Modal */}
      <PDFViewer 
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </div>
  );
}

export default App;
