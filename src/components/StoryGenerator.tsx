import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, User, MapPin, Heart, Clock, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CharacterSelector from './CharacterSelector';
import SettingSelector from './SettingSelector';
import ThemeSelector from './ThemeSelector';
import EnhancedButton from './ui/EnhancedButton';
import { SelectionFeedback, FloatingElement } from './ui/MicroInteractions';
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
  const { user } = useAuth();
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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Test connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection on component mount...');
        const isConnected = await storyService.testConnection();
        console.log('🔍 Connection test result:', isConnected);
        
        if (!isConnected) {
          setError('Unable to connect to story generation service. Please check your internet connection.');
        }
      } catch (error) {
        console.error('❌ Connection test error:', error);
        setError('Connection test failed. Please refresh the page.');
      }
    };

    testConnection();
  }, []);

  const handleOptionChange = (type: keyof StoryOptions, value: string) => {
    console.log('🎛️ Option changed:', type, '=', value);
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
    setError(null);
    setDebugInfo(null);
  };

  const simulateProgress = () => {
    const steps = [
      { progress: 10, status: 'Connecting to AI service...' },
      { progress: 25, status: 'Preparing your magical story...' },
      { progress: 45, status: 'Choosing the perfect adventure...' },
      { progress: 65, status: 'Adding characters and dialogue...' },
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
    }, 1000);

    return interval;
  };

  const handleGenerate = async () => {
    console.log('🚀 Generate button clicked!');
    console.log('📋 Current options:', selectedOptions);
    console.log('👤 Current user:', user?.email || 'anonymous');

    // Validate required fields
    if (!selectedOptions.character || !selectedOptions.setting || !selectedOptions.theme || !selectedOptions.characterName.trim()) {
      const missingFields = [];
      if (!selectedOptions.characterName.trim()) missingFields.push('Character name');
      if (!selectedOptions.character) missingFields.push('Character type');
      if (!selectedOptions.setting) missingFields.push('Setting');
      if (!selectedOptions.theme) missingFields.push('Theme');
      
      const errorMsg = `Please complete all fields: ${missingFields.join(', ')}`;
      console.error('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }

    console.log('✅ Validation passed, starting generation...');

    setIsGenerating(true);
    setError(null);
    setDebugInfo(null);
    setGenerationProgress(0);
    setGenerationStatus('Initializing...');
    
    const progressInterval = simulateProgress();

    // Declare storyParams outside the try block so it's accessible in catch
    let storyParams;

    try {
      // Map frontend field names to backend expected field names
      storyParams = {
        heroName: selectedOptions.characterName.trim(),
        heroType: selectedOptions.character,
        setting: selectedOptions.setting,
        theme: selectedOptions.theme,
        ageGroup: selectedOptions.ageRange,
        storyLength: selectedOptions.storyLength,
        mood: 'happy',
        magicLevel: 'medium'
      };

      console.log('📦 Sending story generation request with params:', storyParams);

      // Get user token if authenticated
      let userToken: string | undefined;
      if (user) {
        // In a real app, you'd get the session token from Supabase
        // For now, we'll use the anon key but with proper user context
        console.log('🔐 User is authenticated, using user context');
      }

      const generatedStory = await storyService.generateStory(storyParams, userToken);
      
      console.log('🎉 Story generation successful!', generatedStory);

      // Clear the progress simulation
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStatus('Story ready!');
      
      // Transform to our Story interface
      const story: Story = {
        id: generatedStory.id,
        title: generatedStory.title,
        content: generatedStory.content,
        character: generatedStory.heroType,
        characterName: generatedStory.heroName,
        setting: generatedStory.setting,
        theme: generatedStory.theme,
        ageRange: generatedStory.ageGroup,
        storyLength: generatedStory.storyLength,
        createdAt: generatedStory.createdAt,
        moral: generatedStory.moral
      };

      console.log('📖 Transformed story for display:', story);
      
      // Small delay to show completion
      setTimeout(() => {
        onStoryGenerated(story);
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 1000);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('💥 Story generation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story. Please try again.';
      
      // Set debug info for troubleshooting
      setDebugInfo({
        error: errorMessage,
        params: storyParams,
        user: user?.email || 'anonymous',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      setError(errorMessage);
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus('');
    }
  };

  const canGenerate = selectedOptions.character && selectedOptions.setting && selectedOptions.theme && selectedOptions.characterName.trim();

  return (
    <div className="max-w-6xl mx-auto">
      <FloatingElement intensity={30} direction="vertical" duration={4000}>
        <div className={`text-center mb-8 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          <h2 className="text-4xl font-bold mb-4">Let's Create Your Magical Story!</h2>
          <p className="text-xl opacity-80">Choose your story elements and watch AI magic unfold.</p>
          {user && (
            <p className={`text-sm mt-2 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
              ✨ Signed in as {user.email} - Your stories will be saved automatically!
            </p>
          )}
        </div>
      </FloatingElement>

      {/* Debug Info Panel (only shown when there's debug info) */}
      {debugInfo && (
        <div className={`mb-6 p-4 rounded-xl ${
          highContrast ? 'bg-gray-900 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
        } border-2`}>
          <details>
            <summary className="cursor-pointer font-medium mb-2">🔍 Debug Information (Click to expand)</summary>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`mb-6 p-4 rounded-xl ${
          highContrast ? 'bg-red-900 border-red-500 text-white' : 'bg-red-50 border-red-200 text-red-800'
        } border-2`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              {error.includes('connect') && (
                <p className="text-sm mt-2 opacity-80">
                  Try refreshing the page or check your internet connection.
                </p>
              )}
            </div>
          </div>
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
            
            <p className={`text-sm mt-2 ${
              highContrast ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Progress: {generationProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Character Name Input */}
      <SelectionFeedback
        isSelected={!!selectedOptions.characterName.trim()}
        glowColor="#FF6B6B"
        className="mb-8"
      >
        <div className={`${
          highContrast ? 'bg-gray-800 border-white' : 'bg-white/80 border-white/30'
        } backdrop-blur-sm rounded-2xl p-6 border shadow-lg`}>
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
            } border-2 focus:border-coral focus:outline-none focus:ring-4 focus:ring-coral/20`}
            disabled={isGenerating}
          />
        </div>
      </SelectionFeedback>

      {/* Main Selectors */}
      <div className="grid gap-8 md:grid-cols-3 mb-8">
        <SelectionFeedback
          isSelected={!!selectedOptions.character}
          glowColor="#FF6B6B"
        >
          <CharacterSelector
            selected={selectedOptions.character}
            onSelect={(character) => handleOptionChange('character', character)}
            highContrast={highContrast}
            audioEnabled={audioEnabled}
            disabled={isGenerating}
          />
        </SelectionFeedback>
        
        <SelectionFeedback
          isSelected={!!selectedOptions.setting}
          glowColor="#4ECDC4"
        >
          <SettingSelector
            selected={selectedOptions.setting}
            onSelect={(setting) => handleOptionChange('setting', setting)}
            highContrast={highContrast}
            audioEnabled={audioEnabled}
            disabled={isGenerating}
          />
        </SelectionFeedback>
        
        <SelectionFeedback
          isSelected={!!selectedOptions.theme}
          glowColor="#9C27B0"
        >
          <ThemeSelector
            selected={selectedOptions.theme}
            onSelect={(theme) => handleOptionChange('theme', theme)}
            highContrast={highContrast}
            audioEnabled={audioEnabled}
            disabled={isGenerating}
          />
        </SelectionFeedback>
      </div>

      {/* Age Range and Story Length */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Age Range Selector */}
        <SelectionFeedback
          isSelected={!!selectedOptions.ageRange}
          glowColor="#FFE66D"
        >
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
                <EnhancedButton
                  key={age.value}
                  onClick={() => handleOptionChange('ageRange', age.value)}
                  disabled={isGenerating}
                  variant={selectedOptions.ageRange === age.value ? 'primary' : 'ghost'}
                  size="small"
                  fullWidth
                  highContrast={highContrast}
                  className="flex-col h-auto py-3"
                >
                  <div className="font-bold text-sm">{age.label}</div>
                  <div className="text-xs opacity-80">{age.desc}</div>
                </EnhancedButton>
              ))}
            </div>
          </div>
        </SelectionFeedback>

        {/* Story Length Selector */}
        <SelectionFeedback
          isSelected={!!selectedOptions.storyLength}
          glowColor="#4ECDC4"
        >
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
                <EnhancedButton
                  key={length.value}
                  onClick={() => handleOptionChange('storyLength', length.value)}
                  disabled={isGenerating}
                  variant={selectedOptions.storyLength === length.value ? 'secondary' : 'ghost'}
                  size="small"
                  fullWidth
                  highContrast={highContrast}
                  className="flex-col h-auto py-3"
                >
                  <div className="font-bold text-sm">{length.label}</div>
                  <div className="text-xs opacity-80">{length.desc}</div>
                  <div className="text-xs opacity-60">{length.words}</div>
                </EnhancedButton>
              ))}
            </div>
          </div>
        </SelectionFeedback>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <FloatingElement intensity={20} direction="vertical" duration={3000}>
          <EnhancedButton
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            variant="primary"
            size="large"
            icon={isGenerating ? Loader2 : Wand2}
            iconPosition="left"
            loading={isGenerating}
            highContrast={highContrast}
            glowColor="rgba(255, 107, 107, 0.4)"
            animationIntensity={80}
            className="text-xl px-12 py-5"
          >
            {isGenerating ? 'Creating Magic...' : (
              <>
                Generate AI Story
                <Sparkles className="inline-block w-5 h-5 ml-2" />
              </>
            )}
          </EnhancedButton>
        </FloatingElement>
        
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