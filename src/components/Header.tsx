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
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Change this to match your logo filename in public/logos/ folder
  // Examples: '/logos/logo.png', '/logos/bca-logo.svg', '/logos/my-logo.jpg'
  const logoSrc = '/logos/logo.png';
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 md:mb-10 shadow-2xl animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 opacity-10 rounded-full translate-y-36 -translate-x-36 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
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
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight break-words">
                BCA Question Papers
              </h1>
              <p className="text-white/80 text-sm font-medium">{currentDate}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            {isAdmin && (
              <Link 
                to="/admin"
                className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm text-sm sm:text-base"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Admin</span>
              </Link>
            )}
            <div className="flex-shrink-0">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm text-sm sm:text-base">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-10 sm:h-10 border-2 border-white/50"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-3 sm:mb-4 font-semibold leading-tight">
            Your Complete Academic Resource Hub
          </p>
          
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
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
