import React, { useState } from 'react';
import { Sparkles, Wand2, User, MapPin, Heart, Clock, BookOpen } from 'lucide-react';
import CharacterSelector from './CharacterSelector';
import SettingSelector from './SettingSelector';
import ThemeSelector from './ThemeSelector';
import { Story, StoryOptions } from '../types/Story';
import { generateAdvancedStory } from '../utils/advancedStoryGenerator';

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

  const handleOptionChange = (type: keyof StoryOptions, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedOptions.character || !selectedOptions.setting || !selectedOptions.theme || !selectedOptions.characterName.trim()) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay with progress
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const story = generateAdvancedStory(selectedOptions);
    onStoryGenerated(story);
    setIsGenerating(false);
  };

  const canGenerate = selectedOptions.character && selectedOptions.setting && selectedOptions.theme && selectedOptions.characterName.trim();

  return (
    <div className="max-w-6xl mx-auto">
      <div className={`text-center mb-8 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-4xl font-bold mb-4">Let's Create Your Magical Story!</h2>
        <p className="text-xl opacity-80">Choose your story elements and watch the magic unfold.</p>
      </div>

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
        />
      </div>

      {/* Main Selectors */}
      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <CharacterSelector
          selected={selectedOptions.character}
          onSelect={(character) => handleOptionChange('character', character)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
        />
        
        <SettingSelector
          selected={selectedOptions.setting}
          onSelect={(setting) => handleOptionChange('setting', setting)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
        />
        
        <ThemeSelector
          selected={selectedOptions.theme}
          onSelect={(theme) => handleOptionChange('theme', theme)}
          highContrast={highContrast}
          audioEnabled={audioEnabled}
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
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
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
              { value: 'short', label: 'Short', desc: '2-3 min read', words: '200-300 words' },
              { value: 'medium', label: 'Medium', desc: '4-5 min read', words: '400-600 words' },
              { value: 'long', label: 'Long', desc: '6-8 min read', words: '700-1000 words' }
            ].map((length) => (
              <button
                key={length.value}
                onClick={() => handleOptionChange('storyLength', length.value)}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
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
          className={`relative px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
            highContrast
              ? 'bg-white text-black hover:bg-gray-200 disabled:hover:bg-white'
              : 'bg-gradient-to-r from-coral to-yellow text-white shadow-lg hover:shadow-xl disabled:hover:shadow-lg'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
              Weaving Your Story...
            </>
          ) : (
            <>
              <Wand2 className="inline-block w-6 h-6 mr-3" />
              Create My Story
              <Sparkles className="inline-block w-5 h-5 ml-2" />
            </>
          )}
        </button>
        
        {!canGenerate && (
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