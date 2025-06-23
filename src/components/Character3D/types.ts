export type CharacterPosition = 
  | 'homepage-center'
  | 'sidebar-right'
  | 'corner-bottom-right'
  | 'guide-top-left'
  | 'inline';

export type CharacterState = 
  | 'idle'
  | 'welcoming'
  | 'encouraging'
  | 'celebrating'
  | 'guiding'
  | 'reading'
  | 'thinking'
  | 'proud';

export type AnimationType = 
  | 'idle'
  | 'interactive'
  | 'happy'
  | 'excited'
  | 'thoughtful'
  | 'proud'
  | 'reading'
  | 'pointing'
  | 'celebrating';

export interface CharacterConfig {
  enableInteractions: boolean;
  enableSounds: boolean;
  animationSpeed: number;
  scale: number;
  reducedMotion: boolean;
}