import React, { useState } from 'react';
import { Mail, Lock, Github, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your mood journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            leftIcon={<Mail size={18} />}
            placeholder="Enter your email"
          />

          <Input
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            leftIcon={<Lock size={18} />}
            placeholder="Enter your password"
            showPasswordToggle
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              leftIcon={<Chrome size={18} />}
              onClick={() => console.log('Google login')}
            >
              Google
            </Button>
            <Button
              variant="outline"
              leftIcon={<Github size={18} />}
              onClick={() => console.log('GitHub login')}
            >
              GitHub
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Forgot your password?
          </button>
          <div className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;