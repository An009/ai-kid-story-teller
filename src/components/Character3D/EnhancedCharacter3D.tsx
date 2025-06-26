import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCharacterAnimations } from './useCharacterAnimations';
import { CharacterState, CharacterPosition } from './types';
import './EnhancedCharacter3D.css';

interface CharacterAnimations {
  idle: string[];
  select: string[];
  celebrate: string[];
  expressions: {
    happy: string;
    excited: string;
    thinking: string;
    surprised: string;
  };
  transitionDuration: string;
  timingFunction: string;
}

interface EnhancedCharacter3DProps {
  position: CharacterPosition;
  state: CharacterState;
  onInteraction?: () => void;
  scale?: number;
  disabled?: boolean;
  reducedMotion?: boolean;
  currentSetting?: string;
  animationIntensity?: number;
}

const characterAnimationConfig: CharacterAnimations = {
  idle: ['breathe', 'blink', 'sway'],
  select: ['bounce', 'glow', 'sparkle'],
  celebrate: ['jump', 'spin', 'confetti'],
  expressions: {
    happy: 'smile-wide',
    excited: 'eyes-sparkle',
    thinking: 'head-tilt',
    surprised: 'eyes-wide'
  },
  transitionDuration: '0.4s',
  timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

const EnhancedCharacter3D: React.FC<EnhancedCharacter3DProps> = ({
  position,
  state,
  onInteraction,
  scale = 1,
  disabled = false,
  reducedMotion = false,
  currentSetting = 'forest',
  animationIntensity = 70
}) => {
  const characterRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('happy');
  const [isInteracting, setIsInteracting] = useState(false);
  const [particleEffects, setParticleEffects] = useState<any[]>([]);
  
  const {
    currentAnimation,
    animationFrames,
    isAnimating,
    triggerAnimation,
    resetToIdle
  } = useCharacterAnimations(state, reducedMotion);

  // Setting-based character appearance
  const characterTheme = useMemo(() => {
    const themes = {
      forest: {
        primaryColor: '#4CAF50',
        secondaryColor: '#8BC34A',
        accentColor: '#FFC107',
        glowColor: 'rgba(76, 175, 80, 0.3)',
        particleColor: '#90EE90'
      },
      ocean: {
        primaryColor: '#2196F3',
        secondaryColor: '#00BCD4',
        accentColor: '#FFE082',
        glowColor: 'rgba(33, 150, 243, 0.3)',
        particleColor: '#87CEEB'
      },
      space: {
        primaryColor: '#9C27B0',
        secondaryColor: '#3F51B5',
        accentColor: '#FFD700',
        glowColor: 'rgba(156, 39, 176, 0.3)',
        particleColor: '#DDA0DD'
      },
      castle: {
        primaryColor: '#E91E63',
        secondaryColor: '#9C27B0',
        accentColor: '#FFD700',
        glowColor: 'rgba(233, 30, 99, 0.3)',
        particleColor: '#FFB6C1'
      },
      mountain: {
        primaryColor: '#607D8B',
        secondaryColor: '#9E9E9E',
        accentColor: '#FFF',
        glowColor: 'rgba(96, 125, 139, 0.3)',
        particleColor: '#E3F2FD'
      },
      village: {
        primaryColor: '#FF9800',
        secondaryColor: '#FFC107',
        accentColor: '#FF5722',
        glowColor: 'rgba(255, 152, 0, 0.3)',
        particleColor: '#FFE082'
      }
    };
    return themes[currentSetting as keyof typeof themes] || themes.forest;
  }, [currentSetting]);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (characterRef.current) {
      observer.observe(characterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle interaction with enhanced feedback
  const handleClick = () => {
    if (disabled || !onInteraction) return;
    
    setIsInteracting(true);
    triggerAnimation('interactive');
    
    // Create particle effect
    createParticleEffect();
    
    // Play interaction sound (if audio enabled)
    playInteractionSound();
    
    onInteraction();
    
    setTimeout(() => setIsInteracting(false), 800);
  };

  const createParticleEffect = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 100,
      color: characterTheme.particleColor
    }));
    
    setParticleEffects(newParticles);
    setTimeout(() => setParticleEffects([]), 2000);
  };

  const playInteractionSound = () => {
    // Simple audio feedback using Web Audio API
    if ('AudioContext' in window) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  // Expression cycling based on state
  useEffect(() => {
    const expressionMap = {
      idle: 'happy',
      welcoming: 'excited',
      encouraging: 'happy',
      celebrating: 'excited',
      guiding: 'thinking',
      reading: 'thinking',
      thinking: 'thinking',
      proud: 'happy'
    };
    
    setCurrentExpression(expressionMap[state] || 'happy');
  }, [state]);

  const getPositionStyles = () => {
    const positions = {
      'homepage-center': {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 15
      },
      'sidebar-right': {
        position: 'fixed' as const,
        top: '20%',
        right: '20px',
        transform: `scale(${scale * 0.8})`,
        zIndex: 15
      },
      'corner-bottom-right': {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        transform: `scale(${scale * 0.6})`,
        zIndex: 15
      },
      'guide-top-left': {
        position: 'fixed' as const,
        top: '20px',
        left: '20px',
        transform: `scale(${scale * 0.7})`,
        zIndex: 15
      },
      'inline': {
        position: 'relative' as const,
        transform: `scale(${scale})`,
        zIndex: 15
      }
    };

    return positions[position];
  };

  return (
    <div
      ref={characterRef}
      className={`enhanced-character-3d ${currentAnimation} ${position} ${currentExpression} ${
        disabled ? 'disabled' : ''
      } ${isInteracting ? 'interacting' : ''} ${currentSetting}-theme`}
      style={{
        ...getPositionStyles(),
        '--primary-color': characterTheme.primaryColor,
        '--secondary-color': characterTheme.secondaryColor,
        '--accent-color': characterTheme.accentColor,
        '--glow-color': characterTheme.glowColor,
        '--animation-intensity': animationIntensity / 100,
        '--transition-duration': characterAnimationConfig.transitionDuration,
        '--timing-function': characterAnimationConfig.timingFunction
      } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Friendly story companion"
      aria-describedby="character-description"
    >
      {/* Character Container */}
      <div className="character-container">
        {/* Enhanced Shadow with glow */}
        <div className="character-shadow" />
        <div className="character-glow" />
        
        {/* Main Character Body */}
        <div className="character-body">
          {/* Head with enhanced expressions */}
          <div className="character-head">
            {/* Dynamic Hair Color */}
            <div className="character-hair" />
            
            {/* Enhanced Face */}
            <div className="character-face">
              {/* Animated Eyes */}
              <div className="character-eyes">
                <div className="eye left-eye">
                  <div className="eyeball">
                    <div className="pupil" />
                    <div className="highlight" />
                    <div className="expression-overlay" />
                  </div>
                  <div className="eyelid" />
                </div>
                <div className="eye right-eye">
                  <div className="eyeball">
                    <div className="pupil" />
                    <div className="highlight" />
                    <div className="expression-overlay" />
                  </div>
                  <div className="eyelid" />
                </div>
              </div>
              
              {/* Enhanced Nose */}
              <div className="character-nose" />
              
              {/* Dynamic Mouth */}
              <div className="character-mouth">
                <div className="smile" />
                <div className="teeth" />
              </div>
              
              {/* Animated Cheeks */}
              <div className="character-cheeks">
                <div className="cheek left-cheek" />
                <div className="cheek right-cheek" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Body */}
          <div className="character-torso">
            {/* Dynamic Shirt */}
            <div className="character-shirt" />
            
            {/* Animated Arms */}
            <div className="character-arms">
              <div className="arm left-arm">
                <div className="upper-arm" />
                <div className="lower-arm" />
                <div className="hand" />
              </div>
              <div className="arm right-arm">
                <div className="upper-arm" />
                <div className="lower-arm" />
                <div className="hand" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Legs */}
          <div className="character-legs">
            <div className="leg left-leg">
              <div className="upper-leg" />
              <div className="lower-leg" />
              <div className="foot" />
            </div>
            <div className="leg right-leg">
              <div className="upper-leg" />
              <div className="lower-leg" />
              <div className="foot" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Interaction Effects */}
        <div className="interaction-effects">
          {/* Animated Sparkles */}
          <div className="sparkle sparkle-1" />
          <div className="sparkle sparkle-2" />
          <div className="sparkle sparkle-3" />
          <div className="sparkle sparkle-4" />
          
          {/* Floating Hearts */}
          <div className="heart heart-1" />
          <div className="heart heart-2" />
          <div className="heart heart-3" />
          
          {/* Magic Particles */}
          <div className="magic-particles">
            {particleEffects.map((particle) => (
              <div
                key={particle.id}
                className="magic-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}ms`,
                  backgroundColor: particle.color
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Mood Indicator */}
        <div className="mood-indicator">
          <div className="mood-ring" />
        </div>
      </div>
      
      {/* Accessibility Description */}
      <div id="character-description" className="sr-only">
        A friendly 3D character with dynamic expressions and animations. 
        The character adapts to different story settings with themed colors and effects.
        Currently in {state} mode with {currentExpression} expression.
      </div>
    </div>
  );
};

export default EnhancedCharacter3D;