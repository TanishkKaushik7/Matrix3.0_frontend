import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import Dashboard from './pages/Dashboard';

// Admin Pages & Layout
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
import AdminIssuers from './pages/AdminIssuers';

/**
 * Guard 1: ProtectedRoute
 * Prevents unauthenticated users from accessing private dashboards.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null; 
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

/**
 * Guard 2: PublicRoute
 * Prevents logged-in users from seeing Login/Signup pages.
 * If they hit 'Back' from the dashboard, this kicks them forward again.
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    // Redirect based on role stored in memory
    const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="relative min-h-screen bg-[#050506] selection:bg-[#5E6AD2]/30 selection:text-white">
      {/* Background elements like grids or ambient blobs should be 
          placed here if you want them globally persistent.
      */}
      
      <div className="relative z-10">
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Auth Pages (Protected against authenticated users) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />

          {/* Issuer Dashboard Area */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Panel Area (Nested) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="issuers" element={<AdminIssuers />} />
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;