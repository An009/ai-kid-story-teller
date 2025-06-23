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

interface GeneratedStory {
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
}

interface StoryResponse {
  success: boolean;
  story?: GeneratedStory;
  error?: string;
  message?: string;
}

class StoryService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('StoryService initialized with:', {
      supabaseUrl: this.supabaseUrl ? 'Set' : 'Missing',
      supabaseAnonKey: this.supabaseAnonKey ? 'Set' : 'Missing'
    });
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        VITE_SUPABASE_URL: !!this.supabaseUrl,
        VITE_SUPABASE_ANON_KEY: !!this.supabaseAnonKey
      });
    }
  }

  async generateStory(params: StoryGenerationParams): Promise<GeneratedStory> {
    console.log('🎯 Starting story generation with params:', params);
    
    try {
      // Validate required parameters
      const requiredFields = ['theme', 'heroName', 'heroType', 'setting', 'ageGroup', 'storyLength'];
      const missingFields = requiredFields.filter(field => !params[field as keyof StoryGenerationParams]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('✅ Parameters validated successfully');

      // Prepare request headers
      const headers = {
        'Authorization': `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'X-Demo-User-Id': 'demo-user-id' // Add demo user header for testing
      };

      console.log('📡 Making API request to:', `${this.supabaseUrl}/functions/v1/generate-story`);
      console.log('📋 Request headers:', Object.keys(headers));
      console.log('📦 Request payload:', JSON.stringify(params, null, 2));

      const response = await fetch(`${this.supabaseUrl}/functions/v1/generate-story`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If parsing fails, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);

      let data: StoryResponse;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Successfully parsed response JSON:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      if (!data.success) {
        console.error('❌ API returned error:', data.error || data.message);
        throw new Error(data.error || data.message || 'Story generation failed');
      }

      if (!data.story) {
        console.error('❌ No story data in response:', data);
        throw new Error('No story data received from server');
      }

      console.log('🎉 Story generated successfully:', {
        id: data.story.id,
        title: data.story.title,
        contentLength: data.story.content.length,
        theme: data.story.theme
      });

      // Transform the response to match our Story interface
      const story: GeneratedStory = {
        id: data.story.id,
        title: data.story.title,
        content: data.story.content,
        moral: data.story.moral,
        theme: data.story.theme,
        heroName: data.story.heroName,
        heroType: data.story.heroType,
        setting: data.story.setting,
        ageGroup: data.story.ageGroup,
        storyLength: data.story.storyLength,
        mood: data.story.mood,
        magicLevel: data.story.magicLevel,
        createdAt: data.story.createdAt
      };

      return story;
    } catch (error) {
      console.error('💥 Error in generateStory:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during story generation');
      }
    }
  }

  async getUserStories(): Promise<any[]> {
    console.log('📚 Fetching user stories...');
    
    try {
      const headers = {
        'Authorization': `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'X-Demo-User-Id': 'demo-user-id'
      };

      console.log('📡 Making request to get user stories');

      const response = await fetch(`${this.supabaseUrl}/functions/v1/get-user-stories`, {
        method: 'GET',
        headers,
      });

      console.log('📨 Get stories response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error fetching stories:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Stories fetched successfully:', data.stories?.length || 0, 'stories');
      
      return data.stories || [];
    } catch (error) {
      console.error('💥 Error fetching user stories:', error);
      throw new Error('Failed to fetch stories. Please try again.');
    }
  }

  async updateStory(storyId: string, updates: { isFavorite?: boolean; incrementReadCount?: boolean }): Promise<void> {
    console.log('📝 Updating story:', storyId, updates);
    
    try {
      const headers = {
        'Authorization': `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'X-Demo-User-Id': 'demo-user-id'
      };

      const response = await fetch(`${this.supabaseUrl}/functions/v1/update-story`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ storyId, ...updates }),
      });

      console.log('📨 Update story response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error updating story:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Story updated successfully');
    } catch (error) {
      console.error('💥 Error updating story:', error);
      throw new Error('Failed to update story. Please try again.');
    }
  }

  // Test connection method for debugging
  async testConnection(): Promise<boolean> {
    console.log('🔍 Testing Supabase connection...');
    
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Connection test response:', response.status);
      return response.status < 500; // Accept any non-server error as connection success
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export const storyService = new StoryService();

// Export for debugging in browser console
(window as any).storyService = storyService;