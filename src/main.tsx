import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">We're working on fixing this issue. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Debug function to log environment variables
const logEnvironment = () => {
  console.log('Environment Variables:', {
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '*** Present ***' : 'MISSING',
    NODE_ENV: import.meta.env.MODE,
  });
};

// Main App Initialization
const initApp = async () => {
  try {
    logEnvironment();
    
    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (!PUBLISHABLE_KEY) {
      throw new Error('Missing Clerk Publishable Key. Please check your environment variables.');
    }

    // Clerk appearance configuration
    const clerkAppearance = {
      elements: {
        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
        footerActionLink: 'text-blue-600 hover:text-blue-700',
      },
    };

    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl="/"
            appearance={clerkAppearance}
          >
            <App />
          </ClerkProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #dc2626;">Application Error</h1>
          <p style="color: #4b5563; margin: 10px 0;">${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          <p style="color: #4b5563;">Please check the console for more details.</p>
        </div>
      `;
    }
  }
};

// Start the application
initApp();
