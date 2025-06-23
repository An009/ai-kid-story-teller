import React, { useState, useEffect } from 'react';
import { BookOpen, Library, Settings, Volume2, VolumeX } from 'lucide-react';
import StoryGenerator from './components/StoryGenerator';
import StoryLibrary from './components/StoryLibrary';
import StoryDisplay from './components/StoryDisplay';
import AccessibilityPanel from './components/AccessibilityPanel';
import { CharacterProvider, CharacterIntegration } from './components/Character3D';
import { Story } from './types/Story';

function App() {
  const [currentView, setCurrentView] = useState<'generator' | 'library' | 'story'>('generator');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    const saved = localStorage.getItem('savedStories');
    if (saved) {
      setSavedStories(JSON.parse(saved));
    }
    
    const accessibility = localStorage.getItem('accessibility');
    if (accessibility) {
      const settings = JSON.parse(accessibility);
      setHighContrast(settings.highContrast || false);
      setTextSize(settings.textSize || 'medium');
      setAudioEnabled(settings.audioEnabled !== false);
    }
  }, []);

  const saveStory = (story: Story) => {
    const updatedStories = [...savedStories, { ...story, id: Date.now().toString() }];
    setSavedStories(updatedStories);
    localStorage.setItem('savedStories', JSON.stringify(updatedStories));
  };

  const deleteStory = (storyId: string) => {
    const updatedStories = savedStories.filter(story => story.id !== storyId);
    setSavedStories(updatedStories);
    localStorage.setItem('savedStories', JSON.stringify(updatedStories));
  };

  const updateAccessibilitySettings = () => {
    const settings = { highContrast, textSize, audioEnabled };
    localStorage.setItem('accessibility', JSON.stringify(settings));
  };

  useEffect(() => {
    updateAccessibilitySettings();
  }, [highContrast, textSize, audioEnabled]);

  const handleStoryGenerated = (story: Story) => {
    setCurrentStory(story);
    setCurrentView('story');
  };

  const handleStorySelect = (story: Story) => {
    setCurrentStory(story);
    setCurrentView('story');
  };

  const getCharacterPosition = () => {
    switch (currentView) {
      case 'generator':
        return 'sidebar-right' as const;
      case 'library':
        return 'guide-top-left' as const;
      case 'story':
        return 'corner-bottom-right' as const;
      default:
        return 'homepage-center' as const;
    }
  };

  const getCharacterState = () => {
    switch (currentView) {
      case 'generator':
        return 'encouraging' as const;
      case 'library':
        return 'guiding' as const;
      case 'story':
        return 'reading' as const;
      default:
        return 'welcoming' as const;
    }
  };

  return (
    <CharacterProvider 
      initialConfig={{
        enableInteractions: true,
        enableSounds: audioEnabled,
        reducedMotion: false,
        scale: 1,
        animationSpeed: 1
      }}
    >
      <div className={`min-h-screen transition-all duration-300 ${
        highContrast 
          ? 'bg-black text-white' 
          : 'bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100'
      } ${textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base'}`}>
        
        {/* 3D Character */}
        <CharacterIntegration
          position={getCharacterPosition()}
          state={getCharacterState()}
          onInteraction={() => {
            // Character interaction feedback
            console.log('Character interaction!');
          }}
        />

        {/* Header */}
        <header className={`${
          highContrast ? 'bg-gray-900 border-white' : 'bg-white/80 border-white/20'
        } backdrop-blur-sm border-b sticky top-0 z-10`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-coral to-yellow rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-2xl font-bold ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}>Story Magic</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    highContrast 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-coral hover:bg-coral/80 text-white'
                  }`}
                  aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    highContrast 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-teal hover:bg-teal/80 text-white'
                  }`}
                  aria-label="Accessibility settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className={`${
          highContrast ? 'bg-gray-800' : 'bg-white/60'
        } backdrop-blur-sm border-b border-white/20`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentView('generator')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  currentView === 'generator'
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-coral text-white shadow-lg'
                    : highContrast
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Create Story</span>
              </button>
              
              <button
                onClick={() => setCurrentView('library')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  currentView === 'library'
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-teal text-white shadow-lg'
                    : highContrast
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>My Stories ({savedStories.length})</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Accessibility Panel */}
        {isAccessibilityOpen && (
          <AccessibilityPanel
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            textSize={textSize}
            setTextSize={setTextSize}
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
            onClose={() => setIsAccessibilityOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {currentView === 'generator' && (
            <StoryGenerator 
              onStoryGenerated={handleStoryGenerated}
              highContrast={highContrast}
              audioEnabled={audioEnabled}
            />
          )}
          
          {currentView === 'library' && (
            <StoryLibrary
              stories={savedStories}
              onStorySelect={handleStorySelect}
              onDeleteStory={deleteStory}
              highContrast={highContrast}
            />
          )}
          
          {currentView === 'story' && currentStory && (
            <StoryDisplay
              story={currentStory}
              onSave={saveStory}
              onBack={() => setCurrentView('generator')}
              highContrast={highContrast}
              audioEnabled={audioEnabled}
            />
          )}
        </main>
      </div>
    </CharacterProvider>
  );
}

export default App;