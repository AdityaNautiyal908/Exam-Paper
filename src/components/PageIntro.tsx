import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function PageIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 3200);
    return () => window.clearTimeout(hideTimer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-lavender-100 via-white to-mint-100" />

      <div className="absolute inset-0 opacity-60">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-lavender-400 animate-stream"
            style={{
              left: `${(index / 14) * 100}%`,
              animationDelay: `${index * 120}ms`,
              animationDuration: `${2400 + index * 40}ms`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center animate-intro-pop">
        <div className="mb-6">
          <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 shadow-soft">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-lavender-500 text-white animate-float-shift">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="font-medium text-gray-700 tracking-wide">BCA Papers</span>
          </span>
        </div>

        <div className="overflow-hidden mb-4 h-14">
          <div className="animate-typewriter text-3xl md:text-4xl font-display font-semibold text-gray-800 whitespace-nowrap">
            Ready to ace your exams?
          </div>
        </div>

        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We are spinning up your personalized study dashboard. Grab a cup of coffee while we lay out
          the papers.
        </p>

        <div className="w-64 mx-auto h-1.5 rounded-full bg-lavender-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-lavender-400 via-mint-400 to-sunny-400 animate-progress" />
        </div>
      </div>
    </div>
  );
}

