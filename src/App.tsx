import { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import SubjectCard from './components/SubjectCard';
import PDFViewer from './components/PDFViewer';
import Footer from './components/Footer';
import AnimatedBackdrop from './components/AnimatedBackdrop';
import PageIntro from './components/PageIntro';
import { questionPapers, categories } from './utils/papers';
import { QuestionPaper, FilterCategory } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);

  // Filter papers based on search and category
  const totalFileCount = useMemo(
    () => questionPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    []
  );

  const filteredPapers = useMemo(() => {
    return questionPapers.filter((paper) => {
      const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || paper.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredFileCount = useMemo(
    () => filteredPapers.reduce((sum, subject) => sum + subject.files.length, 0),
    [filteredPapers]
  );

  const groupedPapers = useMemo(() => {
    return filteredPapers.reduce((acc, paper) => {
      if (!acc[paper.category]) {
        acc[paper.category] = [];
      }
      acc[paper.category].push(paper);
      return acc;
    }, {} as Record<string, QuestionPaper[]>);
  }, [filteredPapers]);

  const orderedCategories = categories.filter((category) => category !== 'All');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageIntro />
      <AnimatedBackdrop />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header totalPapers={totalFileCount} />

        {/* Stats */}
        <StatsCard 
          totalPapers={totalFileCount}
          totalCategories={categories.length - 1} // Exclude 'All'
          filteredCount={filteredFileCount}
        />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Papers Grid */}
        {filteredPapers.length > 0 ? (
          orderedCategories.map((category) => {
            const papersInCategory = groupedPapers[category];
            if (!papersInCategory || papersInCategory.length === 0) return null;
            const categoryFileCount = papersInCategory.reduce(
              (sum, subject) => sum + subject.files.length,
              0
            );

            return (
              <section key={category} className="mb-10 animate-slide-up">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
                    <p className="text-sm text-gray-500">
                      {categoryFileCount} paper{categoryFileCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {papersInCategory.map((paper, index) => (
                    <SubjectCard
                      key={paper.id}
                      paper={paper}
                      onClick={() => setSelectedPaper(paper)}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No papers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewer 
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </div>
  );
}

export default App;
