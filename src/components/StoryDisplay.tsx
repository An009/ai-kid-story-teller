import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, ArrowLeft, Volume2, Award } from 'lucide-react';
import { Story } from '../types/Story';

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
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.8);

  const words = story.content.split(' ');

  useEffect(() => {
    return () => {
      if (utterance) {
        speechSynthesis.cancel();
      }
    };
  }, [utterance]);

  const handleReadAloud = () => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    if (isReading) {
      speechSynthesis.pause();
      setIsReading(false);
    } else {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        const newUtterance = new SpeechSynthesisUtterance(story.content);
        newUtterance.rate = readingSpeed;
        newUtterance.pitch = 1.2;
        newUtterance.volume = 0.8;

        // Set voice based on character type
        const voices = speechSynthesis.getVoices();
        const femaleVoices = voices.filter(voice => voice.name.includes('Female') || voice.name.includes('female'));
        const childVoices = voices.filter(voice => voice.name.includes('child') || voice.name.includes('Child'));
        
        if (childVoices.length > 0) {
          newUtterance.voice = childVoices[0];
        } else if (femaleVoices.length > 0) {
          newUtterance.voice = femaleVoices[0];
        }

        let wordIndex = 0;
        newUtterance.onboundary = (event) => {
          if (event.name === 'word') {
            setCurrentWordIndex(wordIndex);
            wordIndex++;
          }
        };

        newUtterance.onend = () => {
          setIsReading(false);
          setCurrentWordIndex(0);
        };

        setUtterance(newUtterance);
        speechSynthesis.speak(newUtterance);
      }
      setIsReading(true);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsReading(false);
    setCurrentWordIndex(0);
  };

  const handleSave = () => {
    onSave(story);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getAgeRangeColor = (ageRange: string) => {
    switch (ageRange) {
      case '4-6': return 'bg-green-100 text-green-800';
      case '7-9': return 'bg-blue-100 text-blue-800';
      case '10-12': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLengthColor = (length: string) => {
    switch (length) {
      case 'short': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'long': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            highContrast
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-white/80 text-gray-700 hover:bg-white shadow-md hover:shadow-lg'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {audioEnabled && (
            <>
              {/* Reading Speed Control */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                highContrast ? 'bg-gray-800 text-white' : 'bg-white/80 text-gray-700'
              }`}>
                <span className="text-sm">Speed:</span>
                <select
                  value={readingSpeed}
                  onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                  className={`text-sm rounded px-2 py-1 ${
                    highContrast ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  <option value={0.6}>Slow</option>
                  <option value={0.8}>Normal</option>
                  <option value={1.0}>Fast</option>
                </select>
              </div>

              <button
                onClick={handleReadAloud}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  highContrast
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-teal text-white hover:bg-teal/80 shadow-md hover:shadow-lg'
                }`}
              >
                {isReading ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isReading ? 'Pause' : 'Read Aloud'}</span>
              </button>

              {isReading && (
                <button
                  onClick={handleStop}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    highContrast
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
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
                : highContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-coral text-white hover:bg-coral/80 shadow-md hover:shadow-lg'
            }`}
          >
            <Save className="w-5 h-5" />
            <span>{isSaved ? 'Saved!' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Story Card */}
      <div className={`${
        highContrast ? 'bg-gray-800 border-white' : 'bg-white/90 border-white/30'
      } backdrop-blur-sm rounded-3xl p-8 border shadow-xl`}>
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            highContrast ? 'text-white' : 'text-gray-800'
          }`}>
            {story.title}
          </h1>
          
          <div className="flex justify-center flex-wrap gap-3 text-sm mb-4">
            <span className={`px-3 py-1 rounded-full ${
              highContrast ? 'bg-gray-700 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              Character: {story.characterName || story.character}
            </span>
            <span className={`px-3 py-1 rounded-full ${
              highContrast ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'
            }`}>
              Setting: {story.setting}
            </span>
            <span className={`px-3 py-1 rounded-full ${
              highContrast ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-800'
            }`}>
              Theme: {story.theme}
            </span>
            {story.ageRange && (
              <span className={`px-3 py-1 rounded-full ${
                highContrast ? 'bg-gray-700 text-white' : getAgeRangeColor(story.ageRange)
              }`}>
                Ages: {story.ageRange}
              </span>
            )}
            {story.storyLength && (
              <span className={`px-3 py-1 rounded-full ${
                highContrast ? 'bg-gray-700 text-white' : getLengthColor(story.storyLength)
              }`}>
                Length: {story.storyLength}
              </span>
            )}
          </div>
        </div>

        {/* Story Content */}
        <div className={`prose prose-lg max-w-none leading-relaxed ${
          highContrast ? 'text-white' : 'text-gray-700'
        }`}>
          <div className="text-xl leading-loose whitespace-pre-line">
            {words.map((word, index) => (
              <span
                key={index}
                className={`${
                  index === currentWordIndex && isReading
                    ? highContrast
                      ? 'bg-yellow text-black'
                      : 'bg-yellow-200 text-gray-900'
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
          <div className={`mt-8 p-6 rounded-xl ${
            highContrast ? 'bg-gray-700 border-white' : 'bg-gradient-to-r from-coral/10 to-yellow/10 border-coral/20'
          } border-2`}>
            <div className="flex items-center space-x-3 mb-3">
              <Award className={`w-6 h-6 ${
                highContrast ? 'text-white' : 'text-coral'
              }`} />
              <h3 className={`text-xl font-bold ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}>
                Story Lesson
              </h3>
            </div>
            <p className={`text-lg italic ${
              highContrast ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {story.moral}
            </p>
          </div>
        )}

        {/* Audio Controls Info */}
        {audioEnabled && (
          <div className={`mt-8 p-4 rounded-xl ${
            highContrast ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <Volume2 className={`w-4 h-4 ${
                highContrast ? 'text-white' : 'text-blue-600'
              }`} />
              <span className={highContrast ? 'text-white' : 'text-blue-800'}>
                Click "Read Aloud" to hear your story with word highlighting! Adjust the speed to your preference.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDisplay;