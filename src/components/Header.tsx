import { BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalPapers: number;
}

export default function Header({ totalPapers }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-lavender-500 via-lavender-400 to-lavender-300 rounded-3xl p-8 md:p-12 mb-8 shadow-soft-lg animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender-600 opacity-20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/90 text-sm font-medium">{currentDate}</p>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
          Hey, Student! 👋
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
          Ready to ace your exams?
        </p>
        
        <p className="text-white/80 text-base md:text-lg max-w-2xl mb-6">
          Access previous year BCA question papers anytime, anywhere. 
          Study smart with our collection of <span className="font-semibold text-white">{totalPapers} papers</span> across all subjects.
        </p>
        
        <div className="flex items-center gap-2 text-white/90">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">All the best for your upcoming exams! 🎯</span>
        </div>
      </div>
    </header>
  );
}
