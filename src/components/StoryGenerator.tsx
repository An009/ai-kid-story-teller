import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import CharacterSelector from './CharacterSelector';
import SettingSelector from './SettingSelector';
import ThemeSelector from './ThemeSelector';
import { Story, StoryOptions } from '../types/Story';
import { generateStory } from '../utils/storyGenerator';

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
    setting: '',
    theme: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionChange = (type: keyof StoryOptions, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedOptions.character || !selectedOptions.setting || !selectedOptions.theme) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const story = generateStory(selectedOptions);
    onStoryGenerated(story);
    setIsGenerating(false);
  };

  const canGenerate = selectedOptions.character && selectedOptions.setting && selectedOptions.theme;

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`text-center mb-8 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-4xl font-bold mb-4">Let's Create a Magical Story!</h2>
        <p className="text-xl opacity-80">Choose your favorite character, setting, and theme to begin your adventure.</p>
      </div>

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
              Creating Magic...
            </>
          ) : (
            <>
              <Wand2 className="inline-block w-6 h-6 mr-3" />
              Generate Story
              <Sparkles className="inline-block w-5 h-5 ml-2" />
            </>
          )}
        </button>
        
        {!canGenerate && (
          <p className={`mt-4 text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
            Please select a character, setting, and theme to generate your story
          </p>
        )}
      </div>
    </div>
  );
};

export default StoryGenerator;