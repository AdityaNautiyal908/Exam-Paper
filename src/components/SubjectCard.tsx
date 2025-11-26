import { FileText, Download, ArrowRight } from 'lucide-react';
import { QuestionPaper } from '../types';
import SubjectIcon from './SubjectIcon';

interface SubjectCardProps {
  paper: QuestionPaper;
  onClick: () => void;
  index: number;
}

const colorMap = {
  lavender: 'from-lavender-100 to-lavender-200 hover:from-lavender-200 hover:to-lavender-300 border-lavender-300',
  mint: 'from-mint-100 to-mint-200 hover:from-mint-200 hover:to-mint-300 border-mint-300',
  sunny: 'from-sunny-100 to-sunny-200 hover:from-sunny-200 hover:to-sunny-300 border-sunny-300',
  peach: 'from-peach-100 to-peach-200 hover:from-peach-200 hover:to-peach-300 border-peach-300',
};

export default function SubjectCard({ paper, onClick, index }: SubjectCardProps) {
  const animationDelay = `animate-delay-${Math.min(index * 100, 400)}`;
  const gradientClass = colorMap[paper.color as keyof typeof colorMap];

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradientClass} rounded-3xl p-6 border-2 shadow-soft card-hover cursor-pointer animate-scale-in ${animationDelay} group relative overflow-hidden`}
    >
      {/* Decorative circle */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        {/* Icon and Category */}
        <div className="flex items-start justify-between mb-4">
          <SubjectIcon iconKey={paper.icon} />
          <span className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {paper.category}
          </span>
        </div>

        {/* Subject Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[3.5rem]">
          {paper.subject}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {paper.files.length} paper{paper.files.length > 1 ? 's' : ''}
        </p>

        {/* File Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <FileText className="w-4 h-4" />
          <span className="truncate">{paper.files[0].fileName.replace('.pdf', '')}</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-lavender-700 transition-colors">
            <span>View Paper</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href={paper.files[0].filePath}
            download
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 bg-white/70 hover:bg-white rounded-xl flex items-center justify-center transition-all hover:scale-110"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-gray-700" />
          </a>
        </div>
      </div>
    </div>
  );
}
