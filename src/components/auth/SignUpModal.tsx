import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  highContrast: boolean;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  highContrast
}) => {
  const { signUp } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle modal open/close animations and body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setIsClosing(false);
      
      // Reset form when modal opens
      setFormData({ email: '', password: '', confirmPassword: '' });
      setError(null);
      setSuccess(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      // Trigger enter animations
      if (modalRef.current && backdropRef.current) {
        modalRef.current.classList.add('modal-enter');
        backdropRef.current.classList.add('backdrop-enter');
      }
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    // Trigger exit animations
    if (modalRef.current && backdropRef.current) {
      modalRef.current.classList.remove('modal-enter');
      modalRef.current.classList.add('modal-exit');
      backdropRef.current.classList.remove('backdrop-enter');
      backdropRef.current.classList.add('backdrop-exit');
    }
    
    // Close modal after animation
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Too short', color: 'text-red-500' };
    if (password.length < 8) return { strength: 2, label: 'Weak', color: 'text-orange-500' };
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: 'Good', color: 'text-yellow-500' };
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 4, label: 'Strong', color: 'text-green-500' };
    }
    return { strength: 2, label: 'Fair', color: 'text-yellow-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Account created successfully! Welcome to Story Magic!');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        ref={backdropRef}
        className="modal-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="modal-container auth"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
      >
        <div className={`
          w-full rounded-3xl p-8 shadow-2xl
          ${highContrast 
            ? 'bg-gray-900 border-2 border-white' 
            : 'bg-white border border-white/30'
          }
          backdrop-blur-sm
        `}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 
              id="signup-modal-title"
              className={`text-3xl font-bold ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}
            >
              Join Story Magic!
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
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
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              highContrast ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-200'
            }`}>
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
            <div className={`mb-6 p-4 rounded-xl border-2 ${
              highContrast ? 'bg-red-900 border-red-500' : 'bg-red-50 border-red-200'
            }`}>
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

          {/* Sign Up Form */}
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
                  } focus:outline-none focus:ring-2 focus:ring-coral/20`}
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
                  } focus:outline-none focus:ring-2 focus:ring-coral/20`}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    highContrast ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                          passwordStrength.strength === 2 ? 'bg-orange-500 w-2/4' :
                          passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/4' :
                          passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${
                highContrast ? 'text-white' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  highContrast ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 ${
                    highContrast
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-white'
                      : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-coral'
                  } focus:outline-none focus:ring-2 focus:ring-coral/20 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    highContrast ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || passwordStrength.strength < 2}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                highContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gradient-to-r from-coral to-yellow text-white hover:shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Switch to Login */}
            <div className={`text-center ${
              highContrast ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className={`font-medium transition-all duration-200 hover:scale-105 ${
                  highContrast
                    ? 'text-white hover:text-gray-300'
                    : 'text-coral hover:text-coral/80'
                }`}
                disabled={isLoading}
              >
                Sign in here
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;