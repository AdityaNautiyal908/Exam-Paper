import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AnalyticsProvider from './components/AnalyticsProvider';

// Lazy load components for better performance
const Home = lazy(() => import('./App'));
const SignInPage = lazy(() => import('./components/auth/SignInPage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AnalyticsDashboard = lazy(() => import('./components/admin/AnalyticsDashboard'));
const NotesDashboard = lazy(() => import('./components/admin/NotesDashboard'));

const AppRoutes = () => {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AnalyticsProvider>
      <AnimatePresence mode="wait">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/sign-in" element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminProtectedRoute>
                  <AnalyticsDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/notes"
              element={
                <AdminProtectedRoute>
                  <NotesDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </AnalyticsProvider>
  );
};

export default AppRoutes;
