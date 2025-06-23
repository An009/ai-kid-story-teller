import { useState, useEffect, useCallback } from 'react';
import { CharacterState, AnimationType } from './types';

interface UseCharacterAnimationsReturn {
  currentAnimation: AnimationType;
  animationFrames: number;
  isAnimating: boolean;
  triggerAnimation: (animation: AnimationType) => void;
  resetToIdle: () => void;
}

export const useCharacterAnimations = (
  state: CharacterState,
  reducedMotion: boolean = false
): UseCharacterAnimationsReturn => {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('idle');
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationQueue, setAnimationQueue] = useState<AnimationType[]>([]);

  // Animation frame counts for sprite-based animations
  const animationFrames = {
    idle: 60,
    interactive: 24,
    happy: 30,
    excited: 20,
    thoughtful: 45,
    proud: 36,
    reading: 40,
    pointing: 30,
    celebrating: 48
  };

  // Map character states to animations
  const stateToAnimation: Record<CharacterState, AnimationType> = {
    idle: 'idle',
    welcoming: 'happy',
    encouraging: 'excited',
    celebrating: 'celebrating',
    guiding: 'pointing',
    reading: 'reading',
    thinking: 'thoughtful',
    proud: 'proud'
  };

  // Update animation based on state
  useEffect(() => {
    if (reducedMotion) {
      setCurrentAnimation('idle');
      setIsAnimating(false);
      return;
    }

    const newAnimation = stateToAnimation[state];
    if (newAnimation !== currentAnimation) {
      setCurrentAnimation(newAnimation);
      setIsAnimating(true);
    }
  }, [state, reducedMotion, currentAnimation]);

  // Process animation queue
  useEffect(() => {
    if (animationQueue.length === 0) return;

    const nextAnimation = animationQueue[0];
    setCurrentAnimation(nextAnimation);
    setIsAnimating(true);

    // Remove processed animation from queue
    const timer = setTimeout(() => {
      setAnimationQueue(prev => prev.slice(1));
      if (animationQueue.length === 1) {
        // Return to state-based animation when queue is empty
        setCurrentAnimation(stateToAnimation[state]);
      }
    }, getAnimationDuration(nextAnimation));

    return () => clearTimeout(timer);
  }, [animationQueue, state]);

  const getAnimationDuration = (animation: AnimationType): number => {
    const durations = {
      idle: Infinity,
      interactive: 800,
      happy: 1000,
      excited: 500,
      thoughtful: 3000,
      proud: 2000,
      reading: 3000,
      pointing: 2000,
      celebrating: 2000
    };
    return durations[animation] || 1000;
  };

  const triggerAnimation = useCallback((animation: AnimationType) => {
    if (reducedMotion) return;
    
    setAnimationQueue(prev => [...prev, animation]);
  }, [reducedMotion]);

  const resetToIdle = useCallback(() => {
    setAnimationQueue([]);
    setCurrentAnimation('idle');
    setIsAnimating(true);
  }, []);

  return {
    currentAnimation,
    animationFrames: animationFrames[currentAnimation] || 30,
    isAnimating,
    triggerAnimation,
    resetToIdle
  };
};