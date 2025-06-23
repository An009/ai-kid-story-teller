import React, { useRef, useEffect, useState } from 'react';
import { X, Eye, Type, Volume2 } from 'lucide-react';

interface AccessibilityPanelProps {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  textSize: 'small' | 'medium' | 'large';
  setTextSize: (size: 'small' | 'medium' | 'large') => void;
  audioEnabled: boolean;
  setAudioEnabled: (value: boolean) => void;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  highContrast,
  setHighContrast,
  textSize,
  setTextSize,
  audioEnabled,
  setAudioEnabled,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle modal open animations and body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    setIsClosing(false);
    
    // Trigger enter animations
    if (modalRef.current && backdropRef.current) {
      modalRef.current.classList.add('modal-enter');
      backdropRef.current.classList.add('backdrop-enter');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

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
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-modal-title"
      >
        <div className={`
          w-full rounded-2xl p-6 shadow-2xl
          ${highContrast 
            ? 'bg-gray-900 border-2 border-white' 
            : 'bg-white border border-gray-200'
          }
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 
              id="accessibility-modal-title"
              className={`text-xl sm:text-2xl font-bold ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}
            >
              Accessibility Settings
            </h3>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                highContrast
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Close accessibility panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className={`w-6 h-6 ${
                  highContrast ? 'text-white' : 'text-gray-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    highContrast ? 'text-white' : 'text-gray-800'
                  }`}>
                    High Contrast Mode
                  </h4>
                  <p className={`text-sm ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Better visibility for low vision
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 hover:scale-105 ${
                  highContrast ? 'bg-teal' : 'bg-gray-300'
                }`}
                aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Text Size */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Type className={`w-6 h-6 ${
                  highContrast ? 'text-white' : 'text-gray-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    highContrast ? 'text-white' : 'text-gray-800'
                  }`}>
                    Text Size
                  </h4>
                  <p className={`text-sm ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Choose comfortable reading size
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size as any)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                      textSize === size
                        ? highContrast
                          ? 'bg-white text-black'
                          : 'bg-coral text-white'
                        : highContrast
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label={`Set text size to ${size}`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className={`w-6 h-6 ${
                  highContrast ? 'text-white' : 'text-gray-600'
                }`} />
                <div>
                  <h4 className={`font-medium ${
                    highContrast ? 'text-white' : 'text-gray-800'
                  }`}>
                    Audio Feedback
                  </h4>
                  <p className={`text-sm ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Sound effects and narration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 hover:scale-105 ${
                  audioEnabled ? 'bg-teal' : 'bg-gray-300'
                }`}
                aria-label={`${audioEnabled ? 'Disable' : 'Enable'} audio feedback`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                highContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-coral text-white hover:bg-coral/80'
              }`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityPanel;