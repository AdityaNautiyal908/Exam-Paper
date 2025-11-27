import { FileText, Download, ArrowRight } from 'lucide-react';
import { QuestionPaper } from '../types';
import SubjectIcon from './SubjectIcon';

interface SubjectCardProps {
  paper: QuestionPaper;
  onClick: () => void;
  index: number;
}

const colorMap = {
  lavender: 'bg-white border-lavender-200 hover:border-lavender-400 hover:shadow-xl',
  mint: 'bg-white border-mint-200 hover:border-mint-400 hover:shadow-xl',
  sunny: 'bg-white border-sunny-200 hover:border-sunny-400 hover:shadow-xl',
  peach: 'bg-white border-peach-200 hover:border-peach-400 hover:shadow-xl',
};

const accentColorMap = {
  lavender: 'text-lavender-600 bg-lavender-50',
  mint: 'text-mint-600 bg-mint-50',
  sunny: 'text-amber-600 bg-sunny-50',
  peach: 'text-rose-600 bg-peach-50',
};

export default function SubjectCard({ paper, onClick, index }: SubjectCardProps) {
  const animationDelay = `animate-delay-${Math.min(index * 100, 400)}`;
  const borderClass = colorMap[paper.color as keyof typeof colorMap];
  const accentClass = accentColorMap[paper.color as keyof typeof accentColorMap];

  return (
    <div
      onClick={onClick}
      className={`${borderClass} rounded-xl p-6 border-2 shadow-md card-hover cursor-pointer animate-scale-in ${animationDelay} group relative overflow-hidden bg-white`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${paper.color === 'lavender' ? 'from-lavender-50/50' : paper.color === 'mint' ? 'from-mint-50/50' : paper.color === 'sunny' ? 'from-sunny-50/50' : 'from-peach-50/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* Icon and Category */}
        <div className="flex items-start justify-between mb-5">
          <SubjectIcon iconKey={paper.icon} />
          <span className={`px-3 py-1.5 ${accentClass} rounded-lg text-xs font-semibold uppercase tracking-wide`}>
            {paper.category}
          </span>
        </div>

        {/* Subject Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] leading-tight">
          {paper.subject}
        </h3>
        
        <div className="flex items-center gap-4 mb-5">
          <p className="text-sm font-medium text-gray-600">
            {paper.files.length} paper{paper.files.length > 1 ? 's' : ''}
          </p>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sem {paper.semester}
          </span>
        </div>

        {/* File Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 px-3 py-2 bg-gray-50 rounded-lg">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="truncate font-medium">{paper.files[0].fileName.replace(/\.(pdf|png|jpg|jpeg|webp)$/i, '')}</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
            <span>View Papers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href={paper.files[0].filePath}
            download
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-gray-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-all hover:scale-110 group"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
