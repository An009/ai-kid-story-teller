import React, { useState } from 'react';
import { Sparkles, Wand2, User, MapPin, Heart, Clock, BookOpen, Loader2 } from 'lucide-react';
import CharacterSelector from './CharacterSelector';
import SettingSelector from './SettingSelector';
import ThemeSelector from './ThemeSelector';
import { Story, StoryOptions } from '../types/Story';
import { storyService } from '../services/storyService';

interface StoryGeneratorProps {
  onStoryGenerated: (story: Story) => void;
  highContrast: boolean;
  audioEnabled: boolean;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ 
  onStoryGenerated, 
  highContrast,
  audioEnabled 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<StoryOptions>({
    character: '',
    characterName: '',
    setting: '',
    theme: '',
    ageRange: '4-6',
    storyLength: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (type: keyof StoryOptions, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
    setError(null);
  };

  const simulateProgress = () => {
    const steps = [
      { progress: 20, status: 'Preparing your magical story...' },
      { progress: 40, status: 'Choosing the perfect adventure...' },
      { progress: 60, status: 'Adding characters and dialogue...' },
      { progress: 80, status: 'Weaving in the moral lesson...' },
      { progress: 95, status: 'Adding final touches...' },
      { progress: 100, status: 'Story complete!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress(steps[currentStep].progress);
        setGenerationStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return interval;
  };

  const handleGenerate = async () => {
    if (!selectedOptions.character || !selectedOptions.setting || !selectedOptions.theme || !selectedOptions.characterName.trim()) {
      setError('Please complete all fields to generate your story');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setGenerationStatus('Starting story generation...');
    
    const progressInterval = simulateProgress();

    try {
      // Map frontend field names to backend expected field names
      const storyParams = {
        heroName: selectedOptions.characterName,
        heroType: selectedOptions.character,
        setting: selectedOptions.setting,
        theme: selectedOptions.theme,
        ageGroup: selectedOptions.ageRange,
        storyLength: selectedOptions.storyLength
      };

      const story = await storyService.generateStory(storyParams);
      
      // Clear the progress simulation
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStatus('Story ready!');
      
      // Small delay to show completion
      setTimeout(() => {
        onStoryGenerated(story);
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Story generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate story. Please try again.');
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus('');
    }
  };

  const canGenerate = selectedOptions.character && selectedOptions.setting && selectedOptions.theme && selectedOptions.characterName.trim();

  return (
    <div className="max-w-6xl mx-auto">
      <div className={`text-center mb-8 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-4xl font-bold mb-4">Let's Create Your Magical Story!</h2>
        <p className="text-xl opacity-80">Choose your story elements and watch AI magic unfold.</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`mb-6 p-4 rounded-xl ${
          highContrast ? 'bg-red-900 border-red-500 text-white' : 'bg-red-50 border-red-200 text-red-800'
        } border-2`}>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <div className={`mb-8 p-6 rounded-2xl ${
          highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
        } backdrop-blur-sm border shadow-lg`}>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader2 className={`w-8 h-8 animate-spin ${
                highContrast ? 'text-white' : 'text-coral'
              }`} />
              <h3 className={`text-2xl font-bold ${
                highContrast ? 'text-white' : 'text-gray-800'
              }`}>
                Creating Your Story
              </h3>
            </div>
            
            <div className={`w-full bg-gray-200 rounded-full h-3 mb-4 ${
              highContrast ? 'bg-gray-700' : ''
            }`}>
              <div 
                className="bg-gradient-to-r from-coral to-yellow h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            
            <p className={`text-lg ${
              highContrast ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {generationStatus}
            </p>
          </div>
        </div>
      )}

      {/* Character Name Input */}
      <div className={`${
        highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
      } backdrop-blur-sm rounded-2xl p-6 border shadow-lg mb-8`}>
        <div className="flex items-center space-x-3 mb-4">
          <User className={`w-6 h-6 ${highContrast ? 'text-white' : 'text-coral'}`} />
          <h3 className={`text-2xl font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
            Name Your Hero
          </h3>
        </div>
        <input
          type="text"
          value={selectedOptions.characterName}
          onChange={(e) => handleOptionChange('characterName', e.target.value)}
          placeholder="Enter your character's name (e.g., Luna, Max, Bella)"
          className={`w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 ${
            highContrast
              ? 'bg-gray-700 text-white border-white placeholder-gray-400'
              : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
          } border-2 focus:border-coral focus:outline-none`}
          disabled={isGenerating}
        />
      </div>

      {/* Main Selectors */}
      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <CharacterSelector
          selected={selectedOptions.character}
          onSelect={(character) => handleOptionChange('character', character)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
          disabled={isGenerating}
        />
        
        <SettingSelector
          selected={selectedOptions.setting}
          onSelect={(setting) => handleOptionChange('setting', setting)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
          disabled={isGenerating}
        />
        
        <ThemeSelector
          selected={selectedOptions.theme}
          onSelect={(theme) => handleOptionChange('theme', theme)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
          disabled={isGenerating}
        />
      </div>

      {/* Age Range and Story Length */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Age Range Selector */}
        <div className={`${
          highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
        } backdrop-blur-sm rounded-2xl p-6 border shadow-lg`}>
          <div className="flex items-center space-x-3 mb-4">
            <Heart className={`w-6 h-6 ${highContrast ? 'text-white' : 'text-coral'}`} />
            <h3 className={`text-xl font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
              Age Range
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '4-6', label: '4-6 years', desc: 'Simple & Fun' },
              { value: '7-9', label: '7-9 years', desc: 'Adventure Time' },
              { value: '10-12', label: '10-12 years', desc: 'Epic Tales' }
            ].map((age) => (
              <button
                key={age.value}
                onClick={() => handleOptionChange('ageRange', age.value)}
                disabled={isGenerating}
                className={`p-3 rounded-xl text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedOptions.ageRange === age.value
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-coral text-white shadow-lg'
                    : highContrast
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-bold text-sm">{age.label}</div>
                <div className="text-xs opacity-80">{age.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Story Length Selector */}
        <div className={`${
          highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
        } backdrop-blur-sm rounded-2xl p-6 border shadow-lg`}>
          <div className="flex items-center space-x-3 mb-4">
            <Clock className={`w-6 h-6 ${highContrast ? 'text-white' : 'text-teal'}`} />
            <h3 className={`text-xl font-bold ${highContrast ? 'text-white' : 'text-gray-800'}`}>
              Story Length
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'short', label: 'Short', desc: '2-3 min read', words: '200-400 words' },
              { value: 'medium', label: 'Medium', desc: '4-6 min read', words: '400-700 words' },
              { value: 'long', label: 'Long', desc: '7-10 min read', words: '700-1000 words' }
            ].map((length) => (
              <button
                key={length.value}
                onClick={() => handleOptionChange('storyLength', length.value)}
                disabled={isGenerating}
                className={`p-3 rounded-xl text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedOptions.storyLength === length.value
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-teal text-white shadow-lg'
                    : highContrast
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-bold text-sm">{length.label}</div>
                <div className="text-xs opacity-80">{length.desc}</div>
                <div className="text-xs opacity-60">{length.words}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className={`relative px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
            highContrast
              ? 'bg-white text-black hover:bg-gray-200 disabled:hover:bg-white'
              : 'bg-gradient-to-r from-coral to-yellow text-white shadow-lg hover:shadow-xl disabled:hover:shadow-lg'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="inline-block w-6 h-6 animate-spin mr-3" />
              Creating Magic...
            </>
          ) : (
            <>
              <Wand2 className="inline-block w-6 h-6 mr-3" />
              Generate AI Story
              <Sparkles className="inline-block w-5 h-5 ml-2" />
            </>
          )}
        </button>
        
        {!canGenerate && !isGenerating && (
          <div className={`mt-4 text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Please complete all fields to generate your story:</p>
            <div className="flex justify-center space-x-4 mt-2">
              {!selectedOptions.characterName.trim() && (
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Character name</span>
                </span>
              )}
              {!selectedOptions.character && (
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Character type</span>
                </span>
              )}
              {!selectedOptions.setting && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Setting</span>
                </span>
              )}
              {!selectedOptions.theme && (
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>Theme</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryGenerator;