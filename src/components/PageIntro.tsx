import { useEffect, useState } from 'react';
import { GraduationCap, FileText, BookOpen } from 'lucide-react';

export default function PageIntro() {
  const [visible, setVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(hideTimer);
  }, []);

  if (!visible) return null;

  const logoSrc = '/logos/logo.png';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-3 h-3 rounded-full bg-indigo-300 animate-stream"
            style={{
              left: `${(index / 12) * 100}%`,
              animationDelay: `${index * 150}ms`,
              animationDuration: `${2800 + index * 50}ms`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center animate-intro-pop max-w-md px-6">
        {/* Logo or Icon */}
        <div className="flex justify-center mb-6">
          {!logoError ? (
            <div className="w-20 h-20 flex items-center justify-center">
              <img 
                src={logoSrc} 
                alt="BCA Question Papers Logo" 
                className="w-full h-full object-contain animate-float-shift"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float-shift">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          BCA Question Papers
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-700 mb-2 font-semibold">
          Your Academic Resource Hub
        </p>
        
        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Access previous year question papers for all BCA semesters. 
          Study smarter with organized final and mid-term papers.
        </p>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">All Semesters</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="font-medium">Organized</span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-72 mx-auto h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-progress" />
        </div>
      </div>
    </div>
  );
}
