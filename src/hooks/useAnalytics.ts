import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { AnalyticsService } from '../services/analyticsService';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get device info
const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
};

export const useAnalytics = () => {
  const { user, isLoaded } = useUser();
  const location = useLocation();
  const [sessionId] = useState(getSessionId());
  const pageStartTime = useRef<number>(Date.now());
  const currentPath = useRef<string>(location.pathname);

  // Initialize or update session
  useEffect(() => {
    if (!isLoaded) return;

    const initSession = async () => {
      const sessionData: any = {
        session_id: sessionId,
        device_info: getDeviceInfo(),
      };

      // If user is logged in, add user info
      if (user) {
        sessionData.user_id = user.id;
        sessionData.user_name = user.fullName || user.firstName || 'Unknown';
        sessionData.user_email = user.primaryEmailAddress?.emailAddress;
        sessionData.user_photo = user.imageUrl;
        sessionData.signup_date = user.createdAt ? new Date(user.createdAt).toISOString() : null;
      }

      await AnalyticsService.createOrUpdateSession(sessionData);
    };

    initSession();
  }, [user, isLoaded, sessionId]);

  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      // Track previous page time spent
      if (currentPath.current !== location.pathname && currentPath.current) {
        const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);
        
        await AnalyticsService.trackPageView({
          session_id: sessionId,
          page_path: currentPath.current,
          page_title: document.title,
          time_spent: timeSpent,
        });

        // Update session with time spent
        await AnalyticsService.createOrUpdateSession({
          session_id: sessionId,
          total_time_spent: timeSpent,
        } as any);
      }

      // Reset for new page
      currentPath.current = location.pathname;
      pageStartTime.current = Date.now();
    };

    trackPageView();

    // Track on page unload
    const handleBeforeUnload = async () => {
      const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);
      
      await AnalyticsService.trackPageView({
        session_id: sessionId,
        page_path: currentPath.current,
        page_title: document.title,
        time_spent: timeSpent,
      });

      await AnalyticsService.createOrUpdateSession({
        session_id: sessionId,
        total_time_spent: timeSpent,
      } as any);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, sessionId]);

  // Track action function
  const trackAction = async (actionType: string, actionData?: any) => {
    await AnalyticsService.trackAction({
      session_id: sessionId,
      action_type: actionType,
      action_data: actionData,
    });
  };

  return { trackAction, sessionId };
};
