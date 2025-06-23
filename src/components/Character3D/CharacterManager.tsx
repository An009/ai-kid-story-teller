import React, { createContext, useContext, useState, useCallback } from 'react';
import { CharacterState, CharacterPosition, CharacterConfig } from './types';

interface CharacterContextType {
  characterState: CharacterState;
  characterPosition: CharacterPosition;
  config: CharacterConfig;
  updateCharacterState: (state: CharacterState) => void;
  updateCharacterPosition: (position: CharacterPosition) => void;
  updateConfig: (config: Partial<CharacterConfig>) => void;
  triggerCelebration: () => void;
  triggerEncouragement: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

interface CharacterProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<CharacterConfig>;
}

export const CharacterProvider: React.FC<CharacterProviderProps> = ({
  children,
  initialConfig = {}
}) => {
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [characterPosition, setCharacterPosition] = useState<CharacterPosition>('homepage-center');
  const [config, setConfig] = useState<CharacterConfig>({
    enableInteractions: true,
    enableSounds: true,
    animationSpeed: 1,
    scale: 1,
    reducedMotion: false,
    ...initialConfig
  });

  const updateCharacterState = useCallback((state: CharacterState) => {
    setCharacterState(state);
  }, []);

  const updateCharacterPosition = useCallback((position: CharacterPosition) => {
    setCharacterPosition(position);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<CharacterConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const triggerCelebration = useCallback(() => {
    setCharacterState('celebrating');
    setTimeout(() => setCharacterState('idle'), 2000);
  }, []);

  const triggerEncouragement = useCallback(() => {
    setCharacterState('encouraging');
    setTimeout(() => setCharacterState('idle'), 1000);
  }, []);

  const value: CharacterContextType = {
    characterState,
    characterPosition,
    config,
    updateCharacterState,
    updateCharacterPosition,
    updateConfig,
    triggerCelebration,
    triggerEncouragement
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};