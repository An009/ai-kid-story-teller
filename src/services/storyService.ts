import { Story, StoryOptions } from '../types/Story';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface GenerateStoryRequest {
  theme: string;
  heroName: string;
  heroType: string;
  setting: string;
  ageGroup: '4-6' | '7-9' | '10-12';
  storyLength: 'short' | 'medium' | 'long';
  mood?: string;
  magicLevel?: 'low' | 'medium' | 'high';
}

interface ApiStoryResponse {
  success: boolean;
  story: {
    id: string;
    title: string;
    content: string;
    moral: string;
    theme: string;
    heroName: string;
    heroType: string;
    setting: string;
    ageGroup: string;
    storyLength: string;
    mood: string;
    magicLevel: string;
    createdAt: string;
  };
}

interface StoriesResponse {
  success: boolean;
  stories: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class StoryService {
  private getAuthHeaders() {
    // In a real implementation, get the actual JWT token from your auth system
    // For now, we'll use a placeholder
    const token = localStorage.getItem('supabase_auth_token') || 'demo-user-id';
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async generateStory(options: StoryOptions): Promise<Story> {
    try {
      const request: GenerateStoryRequest = {
        theme: options.theme,
        heroName: options.characterName,
        heroType: this.getCharacterTypeName(options.character),
        setting: options.setting,
        ageGroup: options.ageRange,
        storyLength: options.storyLength,
        mood: 'happy',
        magicLevel: 'medium'
      };

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-story`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: ApiStoryResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to generate story');
      }

      // Convert API response to Story format
      return {
        id: data.story.id,
        title: data.story.title,
        content: data.story.content,
        character: options.character,
        characterName: data.story.heroName,
        setting: data.story.setting,
        theme: data.story.theme,
        ageRange: data.story.ageGroup,
        storyLength: data.story.storyLength,
        createdAt: data.story.createdAt,
        moral: data.story.moral
      };

    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate story');
    }
  }

  async getUserStories(options: {
    limit?: number;
    offset?: number;
    theme?: string;
    favoritesOnly?: boolean;
  } = {}): Promise<{ stories: Story[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.theme) params.append('theme', options.theme);
      if (options.favoritesOnly) params.append('favorites', 'true');

      const response = await fetch(`${SUPABASE_URL}/functions/v1/get-user-stories?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StoriesResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch stories');
      }

      // Convert API response to Story format
      const stories: Story[] = data.stories.map(story => ({
        id: story.id,
        title: story.title,
        content: story.content,
        character: this.getCharacterTypeFromName(story.hero_type),
        characterName: story.hero_name,
        setting: story.setting,
        theme: story.theme,
        ageRange: story.age_group,
        storyLength: story.story_length,
        createdAt: story.created_at,
        moral: story.moral || ''
      }));

      return {
        stories,
        pagination: data.pagination
      };

    } catch (error) {
      console.error('Error fetching user stories:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch stories');
    }
  }

  async updateStory(storyId: string, updates: {
    isFavorite?: boolean;
    incrementReadCount?: boolean;
  }): Promise<void> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/update-story`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          storyId,
          ...updates
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to update story');
      }

    } catch (error) {
      console.error('Error updating story:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update story');
    }
  }

  private getCharacterTypeName(character: string): string {
    const characterTypes: { [key: string]: string } = {
      cat: 'curious cat',
      rabbit: 'brave bunny',
      dragon: 'friendly dragon',
      princess: 'kind princess',
      astronaut: 'space explorer',
      mermaid: 'magical mermaid'
    };
    return characterTypes[character] || character;
  }

  private getCharacterTypeFromName(heroType: string): string {
    const typeMap: { [key: string]: string } = {
      'curious cat': 'cat',
      'brave bunny': 'rabbit',
      'friendly dragon': 'dragon',
      'kind princess': 'princess',
      'space explorer': 'astronaut',
      'magical mermaid': 'mermaid'
    };
    return typeMap[heroType] || 'cat';
  }
}

export const storyService = new StoryService();