import React, { useState, useEffect, useRef } from 'react';
import { useCharacterAnimations } from './useCharacterAnimations';
import { CharacterState, CharacterPosition } from './types';
import './Character3D.css';

interface Character3DProps {
  position: CharacterPosition;
  state: CharacterState;
  onInteraction?: () => void;
  scale?: number;
  disabled?: boolean;
  reducedMotion?: boolean;
}

const Character3D: React.FC<Character3DProps> = ({
  position,
  state,
  onInteraction,
  scale = 1,
  disabled = false,
  reducedMotion = false
}) => {
  const characterRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const {
    currentAnimation,
    animationFrames,
    isAnimating,
    triggerAnimation,
    resetToIdle
  } = useCharacterAnimations(state, reducedMotion);

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

  // Animation frame cycling
  useEffect(() => {
    if (!isVisible || reducedMotion || !isAnimating) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % animationFrames);
    }, 100); // 10fps for smooth animation

    return () => clearInterval(interval);
  }, [isVisible, reducedMotion, isAnimating, animationFrames]);

  const handleClick = () => {
    if (disabled || !onInteraction) return;
    
    triggerAnimation('interactive');
    onInteraction();
  };

  const getPositionStyles = () => {
    const positions = {
      'homepage-center': {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 10
      },
      'sidebar-right': {
        position: 'fixed' as const,
        top: '20%',
        right: '20px',
        transform: `scale(${scale * 0.8})`,
        zIndex: 5
      },
      'corner-bottom-right': {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        transform: `scale(${scale * 0.6})`,
        zIndex: 5
      },
      'guide-top-left': {
        position: 'fixed' as const,
        top: '20px',
        left: '20px',
        transform: `scale(${scale * 0.7})`,
        zIndex: 5
      },
      'inline': {
        position: 'relative' as const,
        transform: `scale(${scale})`,
        zIndex: 1
      }
    };

    return positions[position];
  };

  return (
    <div
      ref={characterRef}
      className={`character-3d ${currentAnimation} ${position} ${disabled ? 'disabled' : ''}`}
      style={getPositionStyles()}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Friendly story companion"
      aria-describedby="character-description"
    >
      {/* Character Container */}
      <div className="character-container">
        {/* Shadow */}
        <div className="character-shadow" />
        
        {/* Main Character Body */}
        <div className="character-body">
          {/* Head */}
          <div className="character-head">
            {/* Hair */}
            <div className="character-hair" />
            
            {/* Face */}
            <div className="character-face">
              {/* Eyes */}
              <div className="character-eyes">
                <div className="eye left-eye">
                  <div className="eyeball">
                    <div className="pupil" />
                    <div className="highlight" />
                  </div>
                  <div className="eyelid" />
                </div>
                <div className="eye right-eye">
                  <div className="eyeball">
                    <div className="pupil" />
                    <div className="highlight" />
                  </div>
                  <div className="eyelid" />
                </div>
              </div>
              
              {/* Nose */}
              <div className="character-nose" />
              
              {/* Mouth */}
              <div className="character-mouth">
                <div className="smile" />
                <div className="teeth" />
              </div>
              
              {/* Cheeks */}
              <div className="character-cheeks">
                <div className="cheek left-cheek" />
                <div className="cheek right-cheek" />
              </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="character-torso">
            {/* Shirt */}
            <div className="character-shirt" />
            
            {/* Arms */}
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
          
          {/* Legs */}
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
        
        {/* Interaction Effects */}
        <div className="interaction-effects">
          <div className="sparkle sparkle-1" />
          <div className="sparkle sparkle-2" />
          <div className="sparkle sparkle-3" />
          <div className="heart heart-1" />
          <div className="heart heart-2" />
        </div>
      </div>
      
      {/* Accessibility Description */}
      <div id="character-description" className="sr-only">
        A friendly 3D character with orange hair, yellow skin, and turquoise clothing. 
        The character has large expressive eyes and a warm smile, ready to help with your storytelling adventure.
      </div>
    </div>
  );
};

export default Character3D;