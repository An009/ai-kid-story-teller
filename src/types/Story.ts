export interface Story {
  id?: string;
  title: string;
  content: string;
  character: string;
  setting: string;
  theme: string;
  createdAt: string;
  cover?: string;
}

export interface StoryOptions {
  character: string;
  setting: string;
  theme: string;
}