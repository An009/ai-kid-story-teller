import React from 'react';
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
  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-49" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className={`${
          highContrast ? 'bg-gray-900 border-white' : 'bg-white border-gray-200'
        } rounded-2xl p-6 border shadow-2xl max-w-md w-full`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}>
              Accessibility Settings
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                highContrast
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
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
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-teal' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
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
              <div className="flex gap-3">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      textSize === size
                        ? highContrast
                          ? 'bg-white text-black'
                          : 'bg-coral text-white'
                        : highContrast
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  audioEnabled ? 'bg-teal' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
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