interface StoryGenerationParams {
  theme: string;
  heroName: string;
  heroType: string;
  setting: string;
  ageGroup: string;
  storyLength: string;
  mood?: string;
  magicLevel?: string;
}

interface StoryResponse {
  content: string;
  error?: string;
}

class StoryService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
    }
  }

  async generateStory(params: StoryGenerationParams): Promise<string> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/generate-story`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StoryResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.content;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  async getUserStories(): Promise<any[]> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/get-user-stories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stories || [];
    } catch (error) {
      console.error('Error fetching user stories:', error);
      throw new Error('Failed to fetch stories. Please try again.');
    }
  }

  async updateStory(storyId: string, updates: Partial<StoryGenerationParams>): Promise<void> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/update-story`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating story:', error);
      throw new Error('Failed to update story. Please try again.');
    }
  }
}

export const storyService = new StoryService();