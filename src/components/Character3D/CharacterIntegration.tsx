import React, { useEffect } from 'react';
import Character3D from './Character3D';
import { useCharacter } from './CharacterManager';
import { CharacterPosition, CharacterState } from './types';

interface CharacterIntegrationProps {
  position: CharacterPosition;
  state?: CharacterState;
  onInteraction?: () => void;
  className?: string;
}

const CharacterIntegration: React.FC<CharacterIntegrationProps> = ({
  position,
  state,
  onInteraction,
  className
}) => {
  const { 
    characterState, 
    characterPosition, 
    config, 
    updateCharacterState, 
    updateCharacterPosition 
  } = useCharacter();

  // Update character position when component mounts or position changes
  useEffect(() => {
    updateCharacterPosition(position);
  }, [position, updateCharacterPosition]);

  // Update character state if provided
  useEffect(() => {
    if (state) {
      updateCharacterState(state);
    }
  }, [state, updateCharacterState]);

  const handleInteraction = () => {
    if (onInteraction) {
      onInteraction();
    }
    // Trigger interactive animation
    updateCharacterState('encouraging');
    setTimeout(() => updateCharacterState('idle'), 1000);
  };

  return (
    <div className={className}>
      <Character3D
        position={characterPosition}
        state={characterState}
        onInteraction={handleInteraction}
        scale={config.scale}
        disabled={!config.enableInteractions}
        reducedMotion={config.reducedMotion}
      />
    </div>
  );
};

export default CharacterIntegration;