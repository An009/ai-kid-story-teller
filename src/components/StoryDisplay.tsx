import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, ArrowLeft, Volume2, Award, CheckCircle, Settings, VolumeX, Loader2 } from 'lucide-react';
import { Story } from '../types/Story';
import { voiceService } from '../services/voiceService';
import { soundService } from '../services/soundService';
import VoiceSelector from './VoiceSelector';

interface StoryDisplayProps {
  story: Story;
  onSave: (story: Story) => void;
  onBack: () => void;
  highContrast: boolean;
  audioEnabled: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  story,
  onSave,
  onBack,
  highContrast,
  audioEnabled
}) => {
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('wiseStoryteller');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isVoiceServiceReady, setIsVoiceServiceReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const words = story.content.split(' ');

  console.log('📖 StoryDisplay rendered with story:', {
    id: story.id,
    title: story.title,
    contentLength: story.content.length,
    wordsCount: words.length,
    elevenLabsEnabled: voiceService.isElevenLabsEnabled()
  });

  useEffect(() => {
    // Check if voice service is ready
    setIsVoiceServiceReady(voiceService.isReady());
    
    if (voiceService.isReady()) {
      // Get recommended voice based on story content and character
      const recommendedVoice = voiceService.getRecommendedVoice(story.content, story.character);
      setSelectedVoice(recommendedVoice);
      console.log('🎤 Recommended voice for story:', recommendedVoice);

      // Play ambient sound for the story setting
      if (audioEnabled && soundEffectsEnabled) {
        soundService.playThematicSound(story.theme, story.setting, 'ambient');
      }
    } else {
      setAudioError('ElevenLabs service is not available. Please check your API key configuration.');
    }

    return () => {
      // Cleanup audio when component unmounts
      if (voiceService.isReady()) {
        voiceService.stop();
      }
      soundService.stopAll();
    };
  }, [story, audioEnabled, soundEffectsEnabled]);

  // Update audio progress for ElevenLabs
  useEffect(() => {
    if (!isVoiceServiceReady || !isReading) return;

    const updateProgress = () => {
      const currentTime = voiceService.getCurrentTime();
      const duration = voiceService.getDuration();
      
      setCurrentAudioTime(currentTime);
      setAudioDuration(duration);
      
      if (duration > 0) {
        const progress = (currentTime / duration) * 100;
        setReadingProgress(progress);
        
        // Estimate word progress based on audio progress
        const estimatedWordIndex = Math.floor((progress / 100) * words.length);
        setCurrentWordIndex(estimatedWordIndex);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [isReading, words.length, isVoiceServiceReady]);

  const handleReadAloud = async () => {
    if (!audioEnabled || !isVoiceServiceReady) {
      console.log('🔇 Audio disabled or ElevenLabs service not available');
      setAudioError('Audio service is not available. Please check your configuration.');
      return;
    }

    console.log('🔊 Read aloud clicked, isReading:', isReading);
    setAudioError(null);

    if (isReading) {
      if (voiceService.isPaused()) {
        voiceService.resume();
        console.log('▶️ Speech resumed');
      } else {
        voiceService.pause();
        setIsReading(false);
        console.log('⏸️ Speech paused');
      }
    } else {
      try {
        setIsReading(true);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        
        console.log('🎤 Starting speech with voice:', selectedVoice);
        
        // Play story transition sound effect
        if (soundEffectsEnabled) {
          await soundService.playEmotionalCue('anticipation', 'low');
        }

        // Speak the entire story with ElevenLabs
        await voiceService.speak(story.content, selectedVoice);
        
        console.log('🎤 Speech completed');
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        
        // Play completion sound effect
        if (soundEffectsEnabled) {
          await soundService.playEmotionalCue('joy', 'medium');
        }
        
      } catch (error) {
        console.error('🎤 Speech error:', error);
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        setAudioError(error instanceof Error ? error.message : 'Speech synthesis failed');
      }
    }
  };

  const handleStop = () => {
    console.log('⏹️ Stop reading clicked');
    if (isVoiceServiceReady) {
      voiceService.stop();
    }
    setIsReading(false);
    setCurrentWordIndex(0);
    setReadingProgress(0);
    setCurrentAudioTime(0);
    setAudioDuration(0);
    setAudioError(null);
  };

  const handleSave = () => {
    console.log('💾 Save story clicked:', story.id);
    try {
      onSave(story);
      setIsSaved(true);
      console.log('✅ Story saved successfully');
      
      // Play save confirmation sound
      if (audioEnabled && soundEffectsEnabled) {
        soundService.playEmotionalCue('success', 'low');
      }
      
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('❌ Error saving story:', error);
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    console.log('🎤 Voice changed to:', voiceId);
    
    // If currently reading, stop and restart with new voice
    if (isReading && isVoiceServiceReady) {
      voiceService.stop();
      setIsReading(false);
      setTimeout(() => {
        handleReadAloud();
      }, 500);
    }
  };

  const toggleSoundEffects = () => {
    setSoundEffectsEnabled(!soundEffectsEnabled);
    soundService.setEnabled(!soundEffectsEnabled);
    
    if (!soundEffectsEnabled) {
      // Re-enable and play ambient sound
      soundService.playThematicSound(story.theme, story.setting, 'ambient');
    } else {
      // Disable and stop all sounds
      soundService.stopAll();
    }
  };

  const getAgeRangeColor = (ageRange: string) => {
    switch (ageRange) {
      case '4-6': return 'bg-green-600 text-green-100';
      case '7-9': return 'bg-blue-600 text-blue-100';
      case '10-12': return 'bg-purple-600 text-purple-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const getLengthColor = (length: string) => {
    switch (length) {
      case 'short': return 'bg-yellow-600 text-yellow-100';
      case 'medium': return 'bg-orange-600 text-orange-100';
      case 'long': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  // Validate story content
  if (!story.content || story.content.trim().length === 0) {
    console.error('❌ Story content is empty or invalid');
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center p-8 rounded-2xl bg-gray-800 text-white border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Story Not Available</h2>
          <p className="mb-4">The story content could not be loaded.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-coral text-white hover:bg-coral/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {audioEnabled && (
            <>
              {/* Sound Effects Toggle */}
              <button
                onClick={toggleSoundEffects}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  soundEffectsEnabled
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
                title={soundEffectsEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              >
                {soundEffectsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="hidden sm:inline">Effects</span>
              </button>

              {/* Voice Settings Button */}
              <button
                onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                disabled={!isVoiceServiceReady}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  showVoiceSelector
                    ? 'bg-purple-500 text-white'
                    : isVoiceServiceReady
                      ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md hover:shadow-lg'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Voice</span>
              </button>

              {/* Reading Controls */}
              <button
                onClick={handleReadAloud}
                disabled={!isVoiceServiceReady || (isReading && voiceService.isSpeaking() && !voiceService.isPaused())}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  isVoiceServiceReady
                    ? 'bg-teal text-white hover:bg-teal/80'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                } disabled:opacity-50 disabled:transform-none`}
              >
                {isReading && !voiceService.isPaused() ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>
                  {isReading && !voiceService.isPaused() ? 'Pause' : 'Read Aloud'}
                </span>
              </button>

              {isReading && (
                <button
                  onClick={handleStop}
                  className="p-2 rounded-full transition-all duration-200 transform hover:scale-105 bg-gray-600 text-white hover:bg-gray-500"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
              isSaved
                ? 'bg-green-500 text-white'
                : 'bg-coral text-white hover:bg-coral/80'
            }`}
          >
            {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{isSaved ? 'Saved!' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Audio Error Display */}
      {audioError && (
        <div className="mb-6 p-4 rounded-xl bg-red-900 border border-red-500">
          <div className="flex items-center space-x-3">
            <VolumeX className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Audio Service Error</p>
              <p className="text-sm text-red-300">{audioError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Selector Modal */}
      {showVoiceSelector && audioEnabled && isVoiceServiceReady && (
        <div className="mb-8">
          <VoiceSelector
            selectedVoice={selectedVoice}
            onVoiceChange={handleVoiceChange}
            highContrast={highContrast}
            disabled={false}
          />
        </div>
      )}

      {/* Reading Progress Bar */}
      {isReading && readingProgress > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-300">
              Reading Progress
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-400">
                {Math.round(readingProgress)}%
              </span>
              {audioDuration > 0 && (
                <span className="text-xs text-gray-400">
                  {Math.floor(currentAudioTime)}s / {Math.floor(audioDuration)}s
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center space-x-2">
            <span>🎤 ElevenLabs Enhanced Audio</span>
            {soundEffectsEnabled && <span>🔊 Sound Effects Active</span>}
          </div>
        </div>
      )}

      {/* Story Card */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            {story.title}
          </h1>
          
          <div className="flex justify-center flex-wrap gap-3 text-sm mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-purple-100">
              Character: {story.characterName || story.character}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-blue-100">
              Setting: {story.setting}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-600 text-green-100">
              Theme: {story.theme}
            </span>
            {story.ageRange && (
              <span className={`px-3 py-1 rounded-full ${getAgeRangeColor(story.ageRange)}`}>
                Ages: {story.ageRange}
              </span>
            )}
            {story.storyLength && (
              <span className={`px-3 py-1 rounded-full ${getLengthColor(story.storyLength)}`}>
                Length: {story.storyLength}
              </span>
            )}
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none leading-relaxed text-gray-100">
          <div className="text-xl leading-loose whitespace-pre-line">
            {words.map((word, index) => (
              <span
                key={index}
                className={`${
                  index < currentWordIndex && isReading
                    ? 'bg-yellow text-black'
                    : ''
                } transition-colors duration-200`}
              >
                {word}{' '}
              </span>
            ))}
          </div>
        </div>

        {/* Moral Section */}
        {story.moral && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-coral/20 to-yellow/20 border-2 border-coral/30">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-6 h-6 text-coral" />
              <h3 className="text-xl font-bold text-white">
                Story Lesson
              </h3>
            </div>
            <p className="text-lg italic text-gray-200">
              {story.moral}
            </p>
          </div>
        )}

        {/* Audio Features Info */}
        {audioEnabled && (
          <div className="mt-8 p-4 rounded-xl bg-gray-700 border border-gray-600">
            <div className="flex items-center space-x-2 text-sm">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200">
                {isVoiceServiceReady ? (
                  <>
                    <strong>ElevenLabs Enhanced Audio:</strong> Professional voice synthesis with dynamic sound effects! 
                    Choose from 10 unique character voices with crystal-clear pronunciation and immersive ambient sounds.
                  </>
                ) : (
                  <>
                    <strong>Audio Service:</strong> ElevenLabs API key required for premium voice features. 
                    Please configure your API key to enable high-quality voice synthesis.
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Debug Info for Story */}
        <div className="mt-4 p-3 rounded-lg text-xs bg-gray-900 text-gray-400 border border-gray-700">
          <details>
            <summary className="cursor-pointer">📊 Story Stats</summary>
            <div className="mt-2 space-y-1">
              <div>Story ID: {story.id}</div>
              <div>Word Count: {words.length}</div>
              <div>Character Count: {story.content.length}</div>
              <div>Selected Voice: {selectedVoice}</div>
              <div>ElevenLabs Ready: {isVoiceServiceReady ? 'Yes' : 'No'}</div>
              <div>Sound Effects: {soundEffectsEnabled ? 'Enabled' : 'Disabled'}</div>
              <div>Created: {story.createdAt}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;