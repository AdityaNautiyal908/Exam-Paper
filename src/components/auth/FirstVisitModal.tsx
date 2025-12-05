import { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

const FirstVisitModal = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Set a longer delay to ensure all animations are complete
    const animationTimer = setTimeout(() => {
      setIsPageReady(true);
    }, 3000); // 3 seconds delay to ensure all animations complete

    return () => clearTimeout(animationTimer);
  }, []);

  useEffect(() => {
    if (!isSignedIn && isPageReady) {
      // Small additional delay after page is ready
      const signInTimer = setTimeout(() => {
        openSignIn();
      }, 500);
      
      return () => clearTimeout(signInTimer);
    }
  }, [openSignIn, isSignedIn, isPageReady]);

  return null; // This component doesn't render anything
};

export default FirstVisitModal;
