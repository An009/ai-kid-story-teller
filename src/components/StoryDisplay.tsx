import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, ArrowLeft, Volume2, Award, CheckCircle, Settings } from 'lucide-react';
import { Story } from '../types/Story';
import { voiceService } from '../services/voiceService';
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

  const words = story.content.split(' ');

  console.log('📖 StoryDisplay rendered with story:', {
    id: story.id,
    title: story.title,
    contentLength: story.content.length,
    wordsCount: words.length
  });

  useEffect(() => {
    // Get recommended voice based on story content and character
    const recommendedVoice = voiceService.getRecommendedVoice(story.content, story.character);
    setSelectedVoice(recommendedVoice);
    console.log('🎤 Recommended voice for story:', recommendedVoice);
  }, [story]);

  useEffect(() => {
    return () => {
      voiceService.stop();
    };
  }, []);

  const handleReadAloud = async () => {
    if (!audioEnabled || !('speechSynthesis' in window)) {
      console.log('🔇 Audio disabled or speech synthesis not available');
      return;
    }

    console.log('🔊 Read aloud clicked, isReading:', isReading);

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
        
        // Create a version of the story with word tracking
        const sentences = story.content.split(/[.!?]+/).filter(s => s.trim());
        let totalWordsRead = 0;
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i].trim();
          if (!sentence) continue;
          
          const sentenceWords = sentence.split(' ');
          
          // Speak each sentence
          await voiceService.speak(sentence, selectedVoice);
          
          // Update progress
          totalWordsRead += sentenceWords.length;
          setCurrentWordIndex(totalWordsRead);
          setReadingProgress((totalWordsRead / words.length) * 100);
          
          // Small pause between sentences
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        console.log('🎤 Speech completed');
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
        
      } catch (error) {
        console.error('🎤 Speech error:', error);
        setIsReading(false);
        setCurrentWordIndex(0);
        setReadingProgress(0);
      }
    }
  };

  const handleStop = () => {
    console.log('⏹️ Stop reading clicked');
    voiceService.stop();
    setIsReading(false);
    setCurrentWordIndex(0);
    setReadingProgress(0);
  };

  const handleSave = () => {
    console.log('💾 Save story clicked:', story.id);
    try {
      onSave(story);
      setIsSaved(true);
      console.log('✅ Story saved successfully');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('❌ Error saving story:', error);
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    console.log('🎤 Voice changed to:', voiceId);
    
    // If currently reading, stop and restart with new voice
    if (isReading) {
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
          className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 bg-gray-700 text-white hover:bg-gray-600 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {audioEnabled && (
            <>
              {/* Voice Settings Button */}
              <button
                onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  showVoiceSelector
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-500 shadow-md hover:shadow-lg'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Voice</span>
              </button>

              {/* Reading Controls */}
              <button
                onClick={handleReadAloud}
                disabled={isReading && voiceService.isSpeaking() && !voiceService.isPaused()}
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 bg-teal text-white hover:bg-teal/80 shadow-md hover:shadow-lg disabled:opacity-50"
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
                  className="p-2 rounded-full transition-all duration-200 bg-gray-600 text-white hover:bg-gray-500"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isSaved
                ? 'bg-green-500 text-white'
                : 'bg-coral text-white hover:bg-coral/80 shadow-md hover:shadow-lg'
            }`}
          >
            {isSaved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{isSaved ? 'Saved!' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Voice Selector Modal */}
      {showVoiceSelector && audioEnabled && (
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
            <span className="text-sm text-blue-400">
              {Math.round(readingProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
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

        {/* Audio Controls Info */}
        {audioEnabled && (
          <div className="mt-8 p-4 rounded-xl bg-gray-700 border border-gray-600">
            <div className="flex items-center space-x-2 text-sm">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200">
                Choose from 10 unique character voices! Each voice uses clear, standard English pronunciation with its own personality and speaking style perfect for different story types.
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
              <div>Created: {story.createdAt}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;