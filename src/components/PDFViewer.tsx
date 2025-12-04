import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuestionPaper } from '../types';
import { useEffect, useMemo, useState } from 'react';
import SubjectIcon from './SubjectIcon';
import { getSafeFilePath } from '../utils/filePath';

interface PDFViewerProps {
  paper: QuestionPaper | null;
  onClose: () => void;
}

export default function PDFViewer({ paper, onClose }: PDFViewerProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Function to force download instead of opening in browser
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    if (paper) {
      document.body.style.overflow = 'hidden';
      setActiveFileId(paper.files[0]?.id ?? null);
    } else {
      document.body.style.overflow = 'unset';
      setActiveFileId(null);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [paper]);

  const activeFile = useMemo(() => {
    if (!paper) return null;
    return paper.files.find((file) => file.id === activeFileId) ?? paper.files[0];
  }, [paper, activeFileId]);

  const activeFileIndex = useMemo(() => {
    if (!paper || !activeFile) return 0;
    return paper.files.findIndex((file) => file.id === activeFile.id);
  }, [paper, activeFile]);

  const goToPrevious = () => {
    if (!paper || activeFileIndex <= 0) return;
    setActiveFileId(paper.files[activeFileIndex - 1].id);
  };

  const goToNext = () => {
    if (!paper || activeFileIndex >= paper.files.length - 1) return;
    setActiveFileId(paper.files[activeFileIndex + 1].id);
  };

  if (!paper || !activeFile) return null;

  const isImage = activeFile.fileType === 'image';
  const isMidterm = paper.paperType === 'midterm';
  
  const headerColorMap: Record<string, string> = {
    lavender: 'from-purple-600 to-purple-500',
    mint: 'from-teal-600 to-teal-500',
    sunny: 'from-amber-600 to-amber-500',
    peach: 'from-orange-600 to-orange-500',
  };
  const headerGradient = headerColorMap[paper.color] || 'from-purple-600 to-purple-500';

  // Get properly encoded file path
  const safeFilePath = getSafeFilePath(activeFile.filePath);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-r ${headerGradient} text-white p-4 flex items-center justify-between shadow-lg`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <SubjectIcon iconKey={paper.icon} size="md" className="bg-white/15 border-white/30" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold truncate">{paper.subject}</h2>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                  {isMidterm ? 'Mid-Term' : 'Final'}
                </span>
              </div>
              <p className="text-sm text-white/80 truncate">{activeFile.fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleDownload(safeFilePath, activeFile.fileName)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <a
              href={safeFilePath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File selector */}
        <div className={`pt-24 px-6 pb-2 bg-white/80 backdrop-blur-sm border-b ${isMidterm ? 'border-mint-100' : 'border-lavender-100'}`}>
          <div className="flex flex-wrap gap-3">
            {paper.files.map((file) => {
              const isActive = file.id === activeFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all border ${
                    isActive
                      ? isMidterm 
                        ? 'bg-mint-500 text-white border-transparent shadow-soft'
                        : 'bg-lavender-500 text-white border-transparent shadow-soft'
                      : isMidterm
                        ? 'bg-white text-gray-700 border-mint-200 hover:border-mint-400'
                        : 'bg-white text-gray-700 border-lavender-200 hover:border-lavender-400'
                  }`}
                >
                  {file.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {isImage ? (
          // Image viewer for midterm papers
          <div className="w-full h-full pt-4 pb-8 px-6 overflow-auto bg-gradient-to-b from-white to-gray-50">
            <div className="relative flex flex-col items-center">
              {/* Navigation buttons for multiple images */}
              {paper.files.length > 1 && (
                <div className="flex items-center justify-between w-full max-w-4xl mb-4">
                  <button
                    onClick={goToPrevious}
                    disabled={activeFileIndex <= 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      activeFileIndex <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-mint-100 text-mint-700 hover:bg-mint-200'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  <span className="text-gray-600 font-medium">
                    {activeFileIndex + 1} / {paper.files.length}
                  </span>
                  <button
                    onClick={goToNext}
                    disabled={activeFileIndex >= paper.files.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      activeFileIndex >= paper.files.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-mint-100 text-mint-700 hover:bg-mint-200'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <img
                src={safeFilePath}
                alt={`${paper.subject} - ${activeFile.label}`}
                className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200"
              />
            </div>
          </div>
        ) : isMobile ? (
          // Mobile PDF fallback
          <div className="w-full h-full px-6 pb-8 flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-b from-white to-lavender-50">
            <p className="text-gray-600 text-sm">
              PDF preview is limited on mobile browsers. Tap below to open{' '}
              <span className="font-medium text-gray-800">{activeFile.label}</span> in your device&apos;s
              viewer.
            </p>
            <a
              href={safeFilePath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs btn-primary text-center"
            >
              Open PDF
            </a>
            <button
              onClick={() => handleDownload(safeFilePath, activeFile.fileName)}
              className="w-full max-w-xs btn-secondary text-center"
            >
              Download PDF
            </button>
          </div>
        ) : (
          // Desktop PDF viewer
          <div className="w-full h-full">
            <iframe
              src={safeFilePath}
              className="w-full h-full border-0"
              title={`${paper.subject} - ${activeFile.label}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
