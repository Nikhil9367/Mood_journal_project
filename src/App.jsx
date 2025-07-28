import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JournalProvider } from './context/JournalContext';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <JournalProvider>
                <Dashboard />
              </JournalProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />}
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;