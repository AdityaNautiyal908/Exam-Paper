import { X, Download, ExternalLink } from 'lucide-react';
import { QuestionPaper } from '../types';
import { useEffect, useMemo, useState } from 'react';
import SubjectIcon from './SubjectIcon';

interface PDFViewerProps {
  paper: QuestionPaper | null;
  onClose: () => void;
}

export default function PDFViewer({ paper, onClose }: PDFViewerProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

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

  if (!paper || !activeFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <SubjectIcon iconKey={paper.icon} size="md" className="bg-white/15 border-white/30" />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate">{paper.subject}</h2>
              <p className="text-sm text-white/80 truncate">{activeFile.fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <a
              href={activeFile.filePath}
              download
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </a>
            
            <a
              href={activeFile.filePath}
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
        <div className="pt-24 px-6 pb-2 bg-white/80 backdrop-blur-sm border-b border-lavender-100">
          <div className="flex flex-wrap gap-3">
            {paper.files.map((file) => {
              const isActive = file.id === activeFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-lavender-500 text-white border-transparent shadow-soft'
                      : 'bg-white text-gray-700 border-lavender-200 hover:border-lavender-400'
                  }`}
                >
                  {file.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="w-full h-full">
          <iframe
            src={activeFile.filePath}
            className="w-full h-full border-0"
            title={`${paper.subject} - ${activeFile.label}`}
          />
        </div>
      </div>
    </div>
  );
}
