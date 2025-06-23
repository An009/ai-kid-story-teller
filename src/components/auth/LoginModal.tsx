import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  highContrast: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignUp,
  highContrast
}) => {
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setError(null);
      setSuccess(null);
      setShowResetPassword(false);
      setResetEmail('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Welcome back! Redirecting...');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!resetEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
        setShowResetPassword(false);
        setResetEmail('');
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-49" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className={`${
          highContrast ? 'bg-gray-900 border-white' : 'bg-white/90 border-white/30'
        } backdrop-blur-sm rounded-3xl p-6 sm:p-8 border shadow-xl w-full max-w-md mx-auto transform transition-all duration-300`}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl sm:text-3xl font-bold ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}>
              {showResetPassword ? 'Reset Password' : 'Welcome Back!'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                highContrast
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className={`mb-6 p-4 rounded-xl ${
              highContrast ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-200'
            } border-2`}>
              <div className="flex items-center space-x-3">
                <CheckCircle className={`w-5 h-5 ${
                  highContrast ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`font-medium ${
                  highContrast ? 'text-green-400' : 'text-green-800'
                }`}>
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl ${
              highContrast ? 'bg-red-900 border-red-500' : 'bg-red-50 border-red-200'
            } border-2`}>
              <div className="flex items-start space-x-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  highContrast ? 'text-red-400' : 'text-red-600'
                }`} />
                <p className={`font-medium ${
                  highContrast ? 'text-red-400' : 'text-red-800'
                }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {showResetPassword ? (
            /* Reset Password Form */
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className={`text-center mb-6 ${
                highContrast ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <div>
                <label htmlFor="resetEmail" className={`block text-sm font-medium mb-2 ${
                  highContrast ? 'text-white' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    highContrast ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      highContrast
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-coral'
                    } focus:outline-none`}
                    placeholder="Enter your email"
                    required
                    disabled={isResetting}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                    highContrast
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={isResetting}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                    highContrast
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-coral text-white hover:bg-coral/80'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isResetting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Email'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                  highContrast ? 'text-white' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    highContrast ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      highContrast
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-coral'
                    } focus:outline-none`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                  highContrast ? 'text-white' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    highContrast ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 ${
                      highContrast
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white'
                        : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-coral'
                    } focus:outline-none`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      highContrast ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className={`text-sm font-medium transition-colors ${
                    highContrast
                      ? 'text-white hover:text-gray-300'
                      : 'text-coral hover:text-coral/80'
                  }`}
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  highContrast
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gradient-to-r from-coral to-yellow text-white hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Switch to Sign Up */}
              <div className={`text-center ${
                highContrast ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className={`font-medium transition-colors ${
                    highContrast
                      ? 'text-white hover:text-gray-300'
                      : 'text-coral hover:text-coral/80'
                  }`}
                  disabled={isLoading}
                >
                  Sign up here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;