import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '@store/index';
import Layout from '@components/Layout';
import { useAuth } from '@hooks/useAuth';
import '@i18n/config';

// Pages
const Welcome = React.lazy(() => import('@pages/Welcome'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Login = React.lazy(() => import('@pages/Login'));
const Inversiones = React.lazy(() => import('@pages/Inversiones'));
const Personal = React.lazy(() => import('@pages/Personal'));
const Biohacking = React.lazy(() => import('@pages/Biohacking'));
const Cursos = React.lazy(() => import('@pages/Cursos'));
const Planes = React.lazy(() => import('@pages/Planes'));
const Comunidad = React.lazy(() => import('@pages/Comunidad'));
const AIAnalytics = React.lazy(() => import('@pages/AIAnalytics'));
const Gamification = React.lazy(() => import('@pages/Gamification'));

// Admin Pages
const Analytics = React.lazy(() => import('@pages/Analytics'));
const ContentManager = React.lazy(() => import('@pages/ContentManager'));
const UserManagement = React.lazy(() => import('@pages/UserManagement'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { fetchCurrentUser, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchCurrentUser().catch(() => {
        // Handle error
      });
    }
  }, [token]);

  return (
    <Router>
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen bg-slate-900">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inversiones" element={<Inversiones />} />
                    <Route path="/personal" element={<Personal />} />
                    <Route path="/biohacking" element={<Biohacking />} />
                    <Route path="/cursos" element={<Cursos />} />
                    <Route path="/planes" element={<Planes />} />
                    <Route path="/comunidad" element={<Comunidad />} />
                    <Route path="/ai-analytics" element={<AIAnalytics />} />
                    <Route path="/gamification" element={<Gamification />} />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    <Route path="/admin/content" element={<ContentManager />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
