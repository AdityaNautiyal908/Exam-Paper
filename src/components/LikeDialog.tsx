import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '@clerk/clerk-react';
import { recordLike } from '../services/likesService';
import { useAnalytics } from '../hooks/useAnalytics';

interface LikeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LikeDialog({ isOpen, onClose }: LikeDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useUser();
  const { sessionId } = useAnalytics();

  useEffect(() => {
    if (isOpen) {
      setIsLiked(false);
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleLike = async () => {
    if (isLiked) return;

    setIsLiked(true);
    setIsAnimating(true);

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#FF1493', '#C71585', '#DB7093'],
    });

    // Record like in database
    try {
      await recordLike(
        sessionId,
        user?.id,
        user?.fullName || undefined,
        user?.primaryEmailAddress?.emailAddress || undefined
      );
    } catch (error) {
      console.error('Failed to record like:', error);
      // Don't block the UI if recording fails
    }

    // Close dialog after animation
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 opacity-50"></div>
        
        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Heart Icon */}
          <div className="mb-6 flex justify-center">
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <Heart 
                className={`w-20 h-20 transition-all duration-300 ${
                  isLiked 
                    ? 'fill-pink-500 text-pink-500 scale-110' 
                    : 'text-gray-300 hover:text-pink-400 hover:scale-105'
                }`}
              />
              {isLiked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-pink-500/20 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isLiked ? '❤️ Thank You!' : '📚 Download Complete!'}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isLiked 
              ? 'Your support means the world to me! 🎉'
              : 'Please like this website! It motivates me to create more projects like this and help more students. 💪'
            }
          </p>

          {/* Like Button */}
          {!isLiked && (
            <button
              onClick={handleLike}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Heart className="w-6 h-6" />
              <span>Like This Website</span>
            </button>
          )}

          {isLiked && (
            <div className="text-pink-600 font-semibold text-lg">
              You're awesome! 🌟
            </div>
          )}

          {/* Skip button */}
          {!isLiked && (
            <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
