import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Mic, User, Crown, Zap, Sparkles, Anchor, Bot, BookOpen, Ghost, Leaf } from 'lucide-react';
import { voiceService, voicePersonalities, VoicePersonality } from '../services/voiceService';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  highContrast: boolean;
  disabled?: boolean;
}

const voiceIcons: Record<string, React.ComponentType<any>> = {
  cheerfulChild: User,
  regalPrincess: Crown,
  elderlyWise: BookOpen,
  boomingWizard: Zap,
  squeakyFairy: Sparkles,
  gruffPirate: Anchor,
  friendlyRobot: Bot,
  wiseStoryteller: BookOpen,
  sillyMonster: Ghost,
  calmNatureGuide: Leaf
};

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  highContrast,
  disabled = false
}) => {
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [expandedVoice, setExpandedVoice] = useState<string | null>(null);
  const [availablePersonalities, setAvailablePersonalities] = useState<VoicePersonality[]>([]);

  useEffect(() => {
    setAvailablePersonalities(voiceService.getAvailablePersonalities());
  }, []);

  const handleVoiceTest = async (voiceId: string) => {
    if (isTestingVoice) {
      voiceService.stop();
      setIsTestingVoice(null);
      return;
    }

    try {
      setIsTestingVoice(voiceId);
      await voiceService.testVoice(voiceId);
    } catch (error) {
      console.error('Voice test failed:', error);
    } finally {
      setIsTestingVoice(null);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    if (!disabled) {
      onVoiceChange(voiceId);
      setExpandedVoice(null);
    }
  };

  const getVoiceColor = (voiceId: string) => {
    const colors: Record<string, string> = {
      cheerfulChild: 'from-yellow-400 to-orange-400',
      regalPrincess: 'from-purple-400 to-pink-400',
      elderlyWise: 'from-amber-400 to-brown-400',
      boomingWizard: 'from-indigo-400 to-purple-400',
      squeakyFairy: 'from-pink-400 to-rose-400',
      gruffPirate: 'from-blue-400 to-teal-400',
      friendlyRobot: 'from-gray-400 to-blue-400',
      wiseStoryteller: 'from-green-400 to-teal-400',
      sillyMonster: 'from-red-400 to-orange-400',
      calmNatureGuide: 'from-green-400 to-emerald-400'
    };
    return colors[voiceId] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`${
      highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
    } backdrop-blur-sm rounded-2xl p-6 border shadow-lg ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Volume2 className={`w-6 h-6 ${highContrast ? 'text-white' : 'text-coral'}`} />
        <h3 className={`text-2xl font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          Choose Reading Voice
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availablePersonalities.map((personality) => {
          const IconComponent = voiceIcons[personality.id] || Mic;
          const isSelected = selectedVoice === personality.id;
          const isTesting = isTestingVoice === personality.id;
          const isExpanded = expandedVoice === personality.id;

          return (
            <div
              key={personality.id}
              className={`relative rounded-xl transition-all duration-300 ${
                isSelected
                  ? highContrast
                    ? 'bg-white text-black shadow-lg scale-105'
                    : `bg-gradient-to-br ${getVoiceColor(personality.id)} text-white shadow-lg scale-105`
                  : highContrast
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
              } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Main Voice Card */}
              <div
                className="p-4"
                onClick={() => !disabled && handleVoiceSelect(personality.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected && !highContrast ? 'bg-white/20' : ''
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{personality.name}</h4>
                      <p className={`text-xs opacity-80 ${
                        isSelected && !highContrast ? 'text-white' : ''
                      }`}>
                        {personality.description.substring(0, 40)}...
                      </p>
                    </div>
                  </div>

                  {/* Test Voice Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) handleVoiceTest(personality.id);
                    }}
                    disabled={disabled}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isTesting
                        ? 'bg-red-500 text-white'
                        : isSelected && !highContrast
                          ? 'bg-white/20 hover:bg-white/30'
                          : highContrast
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-white/50 hover:bg-white/70 text-gray-700'
                    }`}
                    aria-label={isTesting ? 'Stop voice test' : 'Test voice'}
                  >
                    {isTesting ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Voice Characteristics Preview */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    isSelected && !highContrast
                      ? 'bg-white/20'
                      : highContrast
                        ? 'bg-gray-600'
                        : 'bg-white/60'
                  }`}>
                    Speed: {personality.characteristics.rate}x
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    isSelected && !highContrast
                      ? 'bg-white/20'
                      : highContrast
                        ? 'bg-gray-600'
                        : 'bg-white/60'
                  }`}>
                    Pitch: {personality.characteristics.pitch}x
                  </span>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedVoice(isExpanded ? null : personality.id);
                  }}
                  className={`mt-3 w-full text-xs py-1 rounded transition-all duration-200 ${
                    isSelected && !highContrast
                      ? 'bg-white/20 hover:bg-white/30'
                      : highContrast
                        ? 'bg-gray-600 hover:bg-gray-500'
                        : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  {isExpanded ? 'Show Less' : 'Show Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className={`border-t p-4 ${
                  isSelected && !highContrast
                    ? 'border-white/20'
                    : highContrast
                      ? 'border-gray-600'
                      : 'border-gray-300'
                }`}>
                  <div className="space-y-3">
                    {/* Sample Phrases */}
                    <div>
                      <h5 className="font-semibold text-sm mb-2">Sample Phrases:</h5>
                      <div className="space-y-1">
                        {personality.samplePhrases.slice(0, 2).map((phrase, index) => (
                          <p key={index} className={`text-xs italic ${
                            isSelected && !highContrast ? 'text-white/80' : 'opacity-80'
                          }`}>
                            "{phrase}"
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Voice Mannerisms */}
                    <div>
                      <h5 className="font-semibold text-sm mb-2">Voice Style:</h5>
                      <div className="flex flex-wrap gap-1">
                        {personality.mannerisms.slice(0, 2).map((mannerism, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isSelected && !highContrast
                                ? 'bg-white/20'
                                : highContrast
                                  ? 'bg-gray-600'
                                  : 'bg-white/60'
                            }`}
                          >
                            {mannerism}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow rounded-full flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice Testing Status */}
      {isTestingVoice && (
        <div className={`mt-4 p-3 rounded-lg ${
          highContrast ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Volume2 className={`w-4 h-4 animate-pulse ${
              highContrast ? 'text-white' : 'text-blue-600'
            }`} />
            <span className={`text-sm ${
              highContrast ? 'text-white' : 'text-blue-800'
            }`}>
              Testing {voicePersonalities[isTestingVoice]?.name} voice...
            </span>
          </div>
        </div>
      )}

      {/* Usage Tip */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${
        highContrast ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
      }`}>
        <p>
          💡 <strong>Tip:</strong> Each voice has unique characteristics perfect for different story types. 
          Try the test button to hear how each voice sounds before selecting!
        </p>
      </div>
    </div>
  );
};

export default VoiceSelector;