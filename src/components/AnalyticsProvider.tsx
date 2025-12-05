import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Initialize analytics tracking for all pages
  useAnalytics();
  
  return <>{children}</>;
}
