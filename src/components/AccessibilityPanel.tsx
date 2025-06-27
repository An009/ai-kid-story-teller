import React, { useRef, useEffect, useState } from 'react';
import { X, Eye, Type, Volume2, VolumeX, Headphones } from 'lucide-react';
import { soundService } from '../services/soundService';
import { voiceService } from '../services/voiceService';

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
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isVoiceServiceReady, setIsVoiceServiceReady] = useState(false);

  // Handle modal open animations and body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    setIsClosing(false);
    
    // Check voice service status
    setIsVoiceServiceReady(voiceService.isReady());
    
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

  const handleSoundEffectsToggle = (enabled: boolean) => {
    setSoundEffectsEnabled(enabled);
    soundService.setEnabled(enabled);
    console.log('🔊 Sound effects', enabled ? 'enabled' : 'disabled');
  };

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    soundService.setMasterVolume(volume);
    console.log('🔊 Master volume set to:', volume);
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
        <div className="w-full rounded-2xl p-6 shadow-2xl bg-gray-800 border-2 border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <h3 
              id="accessibility-modal-title"
              className="text-xl sm:text-2xl font-bold text-white"
            >
              Accessibility Settings
            </h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 text-white hover:bg-gray-700"
              aria-label="Close accessibility panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-medium text-white">
                    High Contrast Mode
                  </h4>
                  <p className="text-sm text-gray-400">
                    Enhanced visibility for low vision users
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 hover:scale-105 ${
                  highContrast ? 'bg-teal' : 'bg-gray-600'
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
                <Type className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-medium text-white">
                    Text Size
                  </h4>
                  <p className="text-sm text-gray-400">
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
                        ? 'bg-coral text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    aria-label={`Set text size to ${size}`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Feedback */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-medium text-white">
                    Audio Feedback
                  </h4>
                  <p className="text-sm text-gray-400">
                    {isVoiceServiceReady 
                      ? 'ElevenLabs voice narration with crystal-clear pronunciation'
                      : 'Voice narration (requires ElevenLabs API key)'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 hover:scale-105 ${
                  audioEnabled ? 'bg-teal' : 'bg-gray-600'
                }`}
                aria-label={`${audioEnabled ? 'Disable' : 'Enable'} audio feedback`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Headphones className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-medium text-white">
                    Sound Effects
                  </h4>
                  <p className="text-sm text-gray-400">
                    Dynamic ambient sounds and story effects powered by ElevenLabs
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSoundEffectsToggle(!soundEffectsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 hover:scale-105 ${
                  soundEffectsEnabled ? 'bg-teal' : 'bg-gray-600'
                }`}
                aria-label={`${soundEffectsEnabled ? 'Disable' : 'Enable'} sound effects`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Master Volume */}
            {(audioEnabled || soundEffectsEnabled) && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  {masterVolume > 0 ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                  <div>
                    <h4 className="font-medium text-white">
                      Master Volume
                    </h4>
                    <p className="text-sm text-gray-400">
                      Control overall audio volume level
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={masterVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="Master volume control"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white min-w-[3rem] text-right">
                    {Math.round(masterVolume * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Audio Technology Info */}
            {audioEnabled && (
              <div className="p-4 rounded-lg bg-gray-700 border border-gray-600">
                <div className="flex items-start space-x-3">
                  <Headphones className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-white mb-1">
                      {isVoiceServiceReady ? 'Premium Audio Experience' : 'Audio Configuration Required'}
                    </h5>
                    <p className="text-sm text-gray-300">
                      {isVoiceServiceReady ? (
                        'This app features ElevenLabs AI-powered voice synthesis for crystal-clear narration and dynamic sound effects that adapt to your story\'s theme and setting.'
                      ) : (
                        'To enable premium voice features, please add your ElevenLabs API key to the environment configuration. This will unlock high-quality voice synthesis and dynamic sound effects.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ElevenLabs Status */}
            <div className={`p-3 rounded-lg border ${
              isVoiceServiceReady 
                ? 'bg-green-900 border-green-500' 
                : 'bg-yellow-900 border-yellow-500'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isVoiceServiceReady ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className={`text-sm font-medium ${
                  isVoiceServiceReady ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  ElevenLabs Service: {isVoiceServiceReady ? 'Ready' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-600">
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-coral text-white hover:bg-coral/80"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4ECDC4;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4ECDC4;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: #374151;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #374151;
        }
      `}</style>
    </>
  );
};

export default AccessibilityPanel;