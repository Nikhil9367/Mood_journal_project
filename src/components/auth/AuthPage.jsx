import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <RegisterForm 
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <LoginForm 
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default AuthPage;