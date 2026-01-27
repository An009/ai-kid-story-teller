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

  console.log('📖 StoryDisplay rendered with story:', {
    id: story.id,
    title: story.title,
    contentLength: story.content.length,
    wordsCount: words.length,
    elevenLabsEnabled: voiceService.isElevenLabsEnabled()
  });

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
        
        const recommendedSettings = audioService.getRecommendedSettings(story.content);
        await voiceService.speak(story.content, selectedVoice);
        
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        
      } catch (error) {
        setIsReading(false);
        const errorMessage = error instanceof Error ? error.message : 'The narrator lost their place!';
        setAudioError(errorMessage);
        
        if (retryCount < 2 && (
          errorMessage.includes('network') || 
          errorMessage.includes('timeout') ||
          errorMessage.includes('rate limit')
        )) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            handleReadAloud();
          }, 2000 * (retryCount + 1));
        }
      }
    }
  };

  const handleStop = () => {
    if (isVoiceServiceReady) {
      voiceService.stop();
    }
    setIsReading(false);
    setCurrentWordIndex(0);
    setReadingProgress(0);
    setCurrentAudioTime(0);
    setAudioDuration(0);
    setAudioError(null);
    setRetryCount(0);
  };

  const handleSave = () => {
    try {
      onSave(story);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('❌ Error saving story:', error);
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (isReading && isVoiceServiceReady) {
      voiceService.stop();
      setIsReading(false);
      setTimeout(() => {
        handleReadAloud();
      }, 500);
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

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!story.content || story.content.trim().length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center p-8 rounded-2xl bg-gray-800 text-white border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Story Disappeared!</h2>
          <p className="mb-4">We couldn't find the pages to this tale.</p>
