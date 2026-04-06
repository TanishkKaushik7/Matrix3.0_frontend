import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';


// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null; 
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="relative min-h-screen bg-[#050506] selection:bg-accent/30 selection:text-white">
      {/* This must be rendered here to show up on EVERY page. 
         It provides the grids and blobs you see in the design.
      */}

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/admin" element={<Admin />} />
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