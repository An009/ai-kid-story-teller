export interface Story {
  id?: string;
  title: string;
  content: string;
  character: string;
  characterName?: string;
  setting: string;
  theme: string;
  ageRange: string;
  storyLength: string;
  createdAt: string;
  cover?: string;
  moral?: string;
}

export interface StoryOptions {
  character: string;
  characterName: string;
  setting: string;
  theme: string;
  ageRange: '4-6' | '7-9' | '10-12';
  storyLength: 'short' | 'medium' | 'long';
}

export interface StoryTemplate {
  title: string;
  content: string;
  moral: string;
  supportingCharacters: string[];
}