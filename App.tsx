import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppContextProvider';
import { useAppContext } from './hooks/useAppContext';
import { FullPageSpinner } from './components/UI';
import { DashboardLayout } from './components/Layout';

// Lazy load pages for better initial load performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const EmailVerificationPage = React.lazy(() => import('./pages/EmailVerificationPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const RedditAccountsView = React.lazy(() => import('./pages/dashboard/RedditAccountsView'));
const PostsView = React.lazy(() => import('./pages/dashboard/PostsView'));
const CreatePostView = React.lazy(() => import('./pages/dashboard/CreatePostView'));


const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAppContext();

    if (isLoading) {
        return <FullPageSpinner />;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-8"><FullPageSpinner /></div>}>
                <Outlet />
            </Suspense>
        </DashboardLayout>
    );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<Navigate to="accounts" replace />} />
            <Route path="accounts" element={<RedditAccountsView />} />
            <Route path="posts" element={<PostsView />} />
            <Route path="create-post" element={<CreatePostView />} />
          </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<FullPageSpinner />}>
            <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;