import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, ArrowLeft, Volume2, Award, CheckCircle, Settings, VolumeX, Loader2, AlertTriangle, Wrench } from 'lucide-react';
import { Story } from '../types/Story';
import { voiceService } from '../services/voiceService';
import { audioService } from '../services/audioService';
import VoiceSelector from './VoiceSelector';
import AudioTroubleshootingPanel from './AudioTroubleshootingPanel';

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
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isVoiceServiceReady, setIsVoiceServiceReady] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioQuality, setAudioQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [retryCount, setRetryCount] = useState(0);

  const words = story.content.split(' ');

  useEffect(() => {
    setIsVoiceServiceReady(voiceService.isReady());
    
    if (voiceService.isReady()) {
      const recommendedVoice = voiceService.getRecommendedVoice(story.content, story.character);
      setSelectedVoice(recommendedVoice);
      testAudioConnection();
    } else {
      setAudioError('The Storyteller engine is warming up. Please check your connection.');
    }

    return () => {
      if (voiceService.isReady()) {
        voiceService.stop();
      }
    };
  }, [story, audioEnabled]);

  const testAudioConnection = async () => {
    try {
      const testResult = await audioService.testApiConnection();
      if (!testResult.success) {
        setAudioError(`Connection test failed: ${testResult.error}`);
        setAudioQuality('low');
      } else {
        setAudioError(null);
        if (testResult.latency && testResult.latency < 1000) {
          setAudioQuality('high');
        } else if (testResult.latency && testResult.latency < 3000) {
          setAudioQuality('medium');
        } else {
          setAudioQuality('low');
        }
      }
    } catch (error) {
      setAudioError('Unable to wake up the Storyteller engine.');
    }
  };

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
        const estimatedWordIndex = Math.floor((progress / 100) * words.length);
        setCurrentWordIndex(estimatedWordIndex);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [isReading, words.length, isVoiceServiceReady]);

  const handleReadAloud = async () => {
    if (!audioEnabled || !isVoiceServiceReady) {
      setAudioError('Audio narration is currently sleeping.');
      return;
    }
    setAudioError(null);
    if (isReading) {
      if (voiceService.isPaused()) {
        voiceService.resume();
      } else {
        voiceService.pause();
        setIsReading(false);
      }
    } else {
      try {
        voiceService.stop();
        setIsReading(true);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        setRetryCount(0);
        await voiceService.speak(story.content, selectedVoice);
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
      } catch (error) {
        setIsReading(false);
        const errorMessage = error instanceof Error ? error.message : 'The narrator lost their place!';
        setAudioError(errorMessage);
      }
    }
  };

  const handleStop = () => {
    if (isVoiceServiceReady) voiceService.stop();
    setIsReading(false);
    setCurrentWordIndex(0);
    setReadingProgress(0);
  };

  const handleSave = () => {
    onSave(story);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (isReading && isVoiceServiceReady) {
      voiceService.stop();
      setIsReading(false);
      setTimeout(() => handleReadAloud(), 500);
    }
  };

  if (!story.content || story.content.trim().length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center p-8 rounded-2xl bg-gray-800 text-white border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Story Disappeared!</h2>
          <p className="mb-4">We couldn't find the pages to this tale.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-lg bg-coral text-white hover:bg-coral/80">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 shadow-md transform hover:scale-105 transition-all">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {audioEnabled && (
            <>
              <button onClick={() => setShowTroubleshooting(true)} className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${audioError ? 'bg-red-600 animate-pulse' : 'bg-gray-600'} text-white`}>
                <Wrench className="w-5 h-5" />
                <span>Fix Audio</span>
              </button>

              <button onClick={() => setShowVoiceSelector(!showVoiceSelector)} disabled={!isVoiceServiceReady} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${showVoiceSelector ? 'bg-purple-500' : 'bg-purple-600'} text-white`}>
                <Settings className="w-5 h-5" />
                <span>Storyteller</span>
              </button>

              <button onClick={handleReadAloud} disabled={!isVoiceServiceReady} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-teal text-white hover:bg-teal/80">
                {isReading && !voiceService.isPaused() ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isReading && !voiceService.isPaused() ? 'Pause' : 'Narrate Story'}</span>
              </button>
            </>
          )}

          <button onClick={handleSave} className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isSaved ? 'bg-green-500' : 'bg-coral'} text-white`}>
            {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{isSaved ? 'Saved!' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">{story.title}</h1>
          <div className="flex justify-center flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-purple-100">Hero: {story.characterName || story.character}</span>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-blue-100">World: {story.setting}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none leading-relaxed text-gray-100">
          <div className="text-xl leading-loose whitespace-pre-line">
            {words.map((word, index) => (
              <span key={index} className={`${index < currentWordIndex && isReading ? 'bg-yellow text-black' : ''} transition-colors duration-200`}>
                {word}{' '}
              </span>
            ))}
          </div>
        </div>

        {story.moral && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-coral/20 to-yellow/20 border-2 border-coral/30">
            <h3 className="text-xl font-bold text-white mb-2">The Heart of the Tale</h3>
            <p className="text-lg italic text-gray-200">{story.moral}</p>
          </div>
        )}
      </div>

      <AudioTroubleshootingPanel isOpen={showTroubleshooting} onClose={() => setShowTroubleshooting(false)} highContrast={highContrast} />
    </div>
  );
};

export default StoryDisplay;
