import { BookOpen, GraduationCap } from 'lucide-react';
import { useState } from 'react';

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

  // Change this to match your logo filename in public/logos/ folder
  // Examples: '/logos/logo.png', '/logos/bca-logo.svg', '/logos/my-logo.jpg'
  const logoSrc = '/logos/logo.png';
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-10 mb-10 shadow-2xl animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 opacity-10 rounded-full translate-y-36 -translate-x-36 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Logo Image - No background, displays as-is */}
            <div className="w-16 h-16 flex items-center justify-center">
              {!logoError ? (
                <img 
                  src={logoSrc} 
                  alt="BCA Question Papers Logo" 
                  className="w-full h-full object-contain"
                  onError={() => {
                    setLogoError(true);
                    console.log('Logo not found at:', logoSrc);
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">
                BCA Question Papers
              </h1>
              <p className="text-white/80 text-sm font-medium">{currentDate}</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-xl md:text-2xl text-white/95 mb-4 font-semibold leading-tight">
            Your Complete Academic Resource Hub
          </p>
          
          <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
            Access a comprehensive collection of <span className="font-bold text-white">{totalPapers} question papers</span> across all semesters. 
            Study smarter with organized final and mid-term papers for every subject.
          </p>
          
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-fit">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-sm">All papers organized by semester & category</span>
          </div>
        </div>
      </div>
    </header>
  );
}
