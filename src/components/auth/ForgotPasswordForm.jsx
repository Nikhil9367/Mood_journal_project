import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by context
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          
          <Button
            variant="outline"
            onClick={onSwitchToLogin}
            leftIcon={<ArrowLeft size={18} />}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={handleChange}
            error={emailError}
            leftIcon={<Mail size={18} />}
            placeholder="Enter your email"
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
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;