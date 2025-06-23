import React, { useState } from 'react';
import { User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

interface AuthButtonProps {
  highContrast: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ highContrast }) => {
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 ${
            highContrast 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-teal hover:bg-teal/80 text-white'
          }`}
          aria-label="User menu"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">
            {user.email?.split('@')[0] || 'User'}
          </span>
        </button>

        {showUserMenu && (
          <div className={`absolute right-0 top-full mt-2 w-48 ${
            highContrast ? 'bg-gray-800 border-white' : 'bg-white border-gray-200'
          } border rounded-xl shadow-lg z-50`}>
            <div className={`p-3 border-b ${
              highContrast ? 'border-gray-600' : 'border-gray-100'
            }`}>
              <p className={`text-sm font-medium ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}>
                Signed in as
              </p>
              <p className={`text-xs ${
                highContrast ? 'text-gray-400' : 'text-gray-600'
              } truncate`}>
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center space-x-2 p-3 text-left transition-colors ${
                highContrast
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        )}

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
          highContrast 
            ? 'bg-white text-black hover:bg-gray-200' 
            : 'bg-teal hover:bg-teal/80 text-white'
        }`}
      >
        <LogIn className="w-5 h-5" />
        <span>Sign In</span>
      </button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={switchToSignUp}
        highContrast={highContrast}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={switchToLogin}
        highContrast={highContrast}
      />
    </>
  );
};

export default AuthButton;