import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

interface HeaderProps {
  totalPapers: number;
}

export default function Header({ totalPapers }: HeaderProps) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  // Change this to match your logo filename in public/logos/ folder
  const logoSrc = '/logos/logo.png';
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400 opacity-10 rounded-full translate-y-36 -translate-x-36 blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Top row with logo and auth buttons */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center">
              {!logoError ? (
                <img 
                  src={logoSrc} 
                  alt="BCA Logo" 
                  className="w-full h-full object-contain"
                  onError={() => {
                    setLogoError(true);
                    console.log('Logo not found at:', logoSrc);
                  }}
                />
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link 
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm text-xs md:text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <div className="flex-shrink-0">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm text-xs md:text-sm whitespace-nowrap">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 md:w-10 md:h-10 border-2 border-white/50"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
        
        {/* Main title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Your BCA<br className="sm:hidden" /> Exam Success Hub
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium">
            {currentDate}
          </p>
        </div>
        
        {/* Description */}
        <p className="text-white/95 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
          Access a comprehensive collection of <span className="font-bold text-white">{totalPapers} question papers</span> across all semesters. Study smarter with organized final and mid-term papers for every subject.
        </p>
        
        {/* Feature badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
          <BookOpen className="w-5 h-5 text-white flex-shrink-0" />
          <span className="text-white font-medium text-sm">All papers organized by semester & category</span>
        </div>
      </div>
    </header>
  );
}
