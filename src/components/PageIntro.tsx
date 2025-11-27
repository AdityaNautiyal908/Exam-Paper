import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function PageIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 2500);
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
        <span className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-lavender-500 text-white animate-float-shift shadow-lg">
          <BookOpen className="w-8 h-8" />
        </span>

        <div className="mt-8 w-64 mx-auto h-1.5 rounded-full bg-lavender-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-lavender-400 via-mint-400 to-sunny-400 animate-progress" />
        </div>
      </div>
    </div>
  );
}
