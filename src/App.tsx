import React, { useState, useEffect } from 'react';
import { BookOpen, Library, Settings, Volume2, VolumeX } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import AuthButton from './components/auth/AuthButton';
import StoryGenerator from './components/StoryGenerator';
import StoryLibrary from './components/StoryLibrary';
import StoryDisplay from './components/StoryDisplay';
import AccessibilityPanel from './components/AccessibilityPanel';
import { CharacterProvider, CharacterIntegration } from './components/Character3D';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Story } from './types/Story';

function AppContent() {
  const [currentView, setCurrentView] = useState<'generator' | 'library' | 'story'>('generator');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  // Add state to trigger Story Library refresh
  const [libraryRefreshTrigger, setLibraryRefreshTrigger] = useState(0);

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
    
    // Trigger Story Library refresh after a story is generated and potentially saved
    // This ensures the library will reload its data from the database
    console.log('🔄 Story generated - triggering library refresh');
    setLibraryRefreshTrigger(prev => prev + 1);
  };

  const handleStorySelect = (story: Story) => {
    setCurrentStory(story);
    setCurrentView('story');
  };

  // Function to manually trigger library refresh
  const refreshStoryLibrary = () => {
    console.log('🔄 Manually triggering library refresh');
    setLibraryRefreshTrigger(prev => prev + 1);
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

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <CharacterProvider 
      initialConfig={{
        enableInteractions: true,
        enableSounds: audioEnabled,
        reducedMotion: prefersReducedMotion,
        scale: 1,
        animationSpeed: 1
      }}
    >
      <div className={`min-h-screen transition-all duration-300 relative overflow-visible bg-gray-900 ${
        textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base'
      }`}>
        
        {/* Animated Background - Base Layer (z-1) */}
        <AnimatedBackground
          particleCount={prefersReducedMotion ? 0 : 65}
          enableParticles={!prefersReducedMotion && !highContrast}
          blurIntensity={highContrast ? 1 : 2.5}
          className={`${highContrast ? 'high-contrast' : ''} z-1`}
        />
        
        {/* High contrast overlay when needed - Base Layer (z-1) */}
        {highContrast && (
          <div className="fixed inset-0 bg-black/80 z-1" />
        )}
        
        {/* 3D Character - Interactive Character Layer (z-15) */}
        <CharacterIntegration
          position={getCharacterPosition()}
          state={getCharacterState()}
          onInteraction={() => {
            // Character interaction feedback
            console.log('Character interaction!');
          }}
        />

        {/* Header - Navigation Layer (z-10) */}
        <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10 relative">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-coral to-yellow rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Story Magic</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-2 rounded-full transition-all duration-200 bg-coral hover:bg-coral/80 text-white"
                  aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  className="p-2 rounded-full transition-all duration-200 bg-teal hover:bg-teal/80 text-white"
                  aria-label="Accessibility settings"
                >
                  <Settings className="w-5 h-5" />
                </button>

                <AuthButton highContrast={false} />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation - Navigation Layer (z-10) */}
        <nav className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700 relative z-2">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentView('generator')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  currentView === 'generator'
                    ? 'bg-coral text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Create Story</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentView('library');
                  // Refresh library when navigating to it
                  refreshStoryLibrary();
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  currentView === 'library'
                    ? 'bg-teal text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Library className="w-5 h-5" />
                <span>My Stories ({savedStories.length})</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Accessibility Panel - Modal Layer (z-1000) */}
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

        {/* Main Content - Base Layer (z-1) */}
        <main className="container mx-auto px-4 py-8 relative z-1">
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
              // Pass refresh trigger to force component to reload data
              refreshTrigger={libraryRefreshTrigger}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;