import React, { useState, useEffect } from 'react';
import { BookOpen, Library, Settings, Volume2, VolumeX } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import AuthButton from './components/auth/AuthButton';
import StoryGenerator from './components/StoryGenerator';
import StoryLibrary from './components/StoryLibrary';
import StoryDisplay from './components/StoryDisplay';
import AccessibilityPanel from './components/AccessibilityPanel';
import { CharacterProvider, CharacterIntegration } from './components/Character3D';
import AdaptiveBackground from './components/AnimatedBackground/AdaptiveBackground';
import EnhancedButton from './components/ui/EnhancedButton';
import { PageTransition } from './components/ui/MicroInteractions';
import { Story } from './types/Story';

function AppContent() {
  const [currentView, setCurrentView] = useState<'generator' | 'library' | 'story'>('generator');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [currentSetting, setCurrentSetting] = useState('forest');

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
    // Update background setting based on story
    if (story.setting) {
      setCurrentSetting(story.setting);
    }
  };

  const handleStorySelect = (story: Story) => {
    setCurrentStory(story);
    setCurrentView('story');
    // Update background setting based on story
    if (story.setting) {
      setCurrentSetting(story.setting);
    }
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
      <div className={`min-h-screen transition-all duration-300 relative overflow-visible ${
        textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base'
      }`}>
        
        {/* Adaptive Background - Base Layer (z-1) */}
        <AdaptiveBackground
          setting={currentSetting as any}
          intensity={highContrast ? 40 : 70}
          reducedMotion={prefersReducedMotion}
          className={`${highContrast ? 'high-contrast' : ''} z-1`}
        />
        
        {/* High contrast overlay when needed - Base Layer (z-1) */}
        {highContrast && (
          <div className="fixed inset-0 bg-black/70 z-1" />
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
        <header className={`${
          highContrast ? 'bg-gray-900 border-white' : 'bg-white/80 border-white/20'
        } backdrop-blur-sm border-b sticky top-0 z-10 relative`}>
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
                <EnhancedButton
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  variant="ghost"
                  size="small"
                  icon={audioEnabled ? Volume2 : VolumeX}
                  highContrast={highContrast}
                  aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
                />
                
                <EnhancedButton
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  variant="ghost"
                  size="small"
                  icon={Settings}
                  highContrast={highContrast}
                  aria-label="Accessibility settings"
                />

                <AuthButton highContrast={highContrast} />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation - Navigation Layer (z-10) */}
        <nav className={`${
          highContrast ? 'bg-gray-800' : 'bg-white/60'
        } backdrop-blur-sm border-b border-white/20 relative z-2`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center space-x-4">
              <EnhancedButton
                onClick={() => setCurrentView('generator')}
                variant={currentView === 'generator' ? 'primary' : 'ghost'}
                icon={BookOpen}
                highContrast={highContrast}
                glowColor="rgba(255, 107, 107, 0.3)"
              >
                Create Story
              </EnhancedButton>
              
              <EnhancedButton
                onClick={() => setCurrentView('library')}
                variant={currentView === 'library' ? 'secondary' : 'ghost'}
                icon={Library}
                highContrast={highContrast}
                glowColor="rgba(78, 205, 196, 0.3)"
              >
                My Stories ({savedStories.length})
              </EnhancedButton>
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
          <PageTransition isVisible={currentView === 'generator'} direction="up">
            {currentView === 'generator' && (
              <StoryGenerator 
                onStoryGenerated={handleStoryGenerated}
                highContrast={highContrast}
                audioEnabled={audioEnabled}
              />
            )}
          </PageTransition>
          
          <PageTransition isVisible={currentView === 'library'} direction="up">
            {currentView === 'library' && (
              <StoryLibrary
                stories={savedStories}
                onStorySelect={handleStorySelect}
                onDeleteStory={deleteStory}
                highContrast={highContrast}
              />
            )}
          </PageTransition>
          
          <PageTransition isVisible={currentView === 'story'} direction="up">
            {currentView === 'story' && currentStory && (
              <StoryDisplay
                story={currentStory}
                onSave={saveStory}
                onBack={() => setCurrentView('generator')}
                highContrast={highContrast}
                audioEnabled={audioEnabled}
              />
            )}
          </PageTransition>
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