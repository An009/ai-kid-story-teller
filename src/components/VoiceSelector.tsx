import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Mic, User, Crown, Zap, Sparkles, Anchor, Bot, BookOpen, Smile, Leaf } from 'lucide-react';
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
  adventurousCaptain: Anchor,
  friendlyRobot: Bot,
  wiseStoryteller: BookOpen,
  playfulFriend: Smile,
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
      cheerfulChild: 'from-amber-500 to-orange-500',
      regalPrincess: 'from-purple-500 to-pink-500',
      elderlyWise: 'from-amber-600 to-orange-600',
      boomingWizard: 'from-indigo-500 to-purple-500',
      squeakyFairy: 'from-pink-500 to-rose-500',
      adventurousCaptain: 'from-blue-500 to-teal-500',
      friendlyRobot: 'from-gray-500 to-blue-500',
      wiseStoryteller: 'from-green-500 to-teal-500',
      playfulFriend: 'from-red-500 to-orange-500',
      calmNatureGuide: 'from-green-500 to-emerald-500'
    };
    return colors[voiceId] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Volume2 className="w-6 h-6 text-coral" />
        <h3 className="text-2xl font-bold text-white">
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
                  ? `bg-gradient-to-br ${getVoiceColor(personality.id)} text-white shadow-lg scale-105`
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {/* Main Voice Card */}
              <div
                className="p-4"
                onClick={() => !disabled && handleVoiceSelect(personality.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : 'bg-gray-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{personality.name}</h4>
                      <p className="text-xs opacity-80">
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
                        : isSelected
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-gray-600 hover:bg-gray-500 text-white'
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
                    isSelected ? 'bg-white/20' : 'bg-gray-600'
                  }`}>
                    Speed: {personality.characteristics.rate}x
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-gray-600'
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
                    isSelected ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  {isExpanded ? 'Show Less' : 'Show Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className={`border-t p-4 ${
                  isSelected ? 'border-white/20' : 'border-gray-600'
                }`}>
                  <div className="space-y-3">
                    {/* Sample Phrases */}
                    <div>
                      <h5 className="font-semibold text-sm mb-2">Sample Phrases:</h5>
                      <div className="space-y-1">
                        {personality.samplePhrases.slice(0, 2).map((phrase, index) => (
                          <p key={index} className="text-xs italic opacity-80">
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
                              isSelected ? 'bg-white/20' : 'bg-gray-600'
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
        <div className="mt-4 p-3 rounded-lg bg-gray-700">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 animate-pulse text-blue-400" />
            <span className="text-sm text-white">
              Testing {voicePersonalities[isTestingVoice]?.name} voice...
            </span>
          </div>
        </div>
      )}

      {/* Usage Tip */}
      <div className="mt-4 p-3 rounded-lg text-xs bg-gray-700 text-gray-300">
        <p>
          💡 <strong>Tip:</strong> All voices use clear, standard English pronunciation. 
          Each voice has unique characteristics perfect for different story types. 
          Try the test button to hear how each voice sounds before selecting!
        </p>
      </div>
    </div>
  );
};

export default VoiceSelector;