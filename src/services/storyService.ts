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

interface SavedStory {
  id: string;
  title: string;
  content: string;
  theme: string;
  hero_name: string;
  hero_type: string;
  setting: string;
  age_group: string;
  story_length: string;
  mood: string;
  magic_level: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  read_count: number;
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

  async generateStory(params: StoryGenerationParams, userToken?: string): Promise<GeneratedStory> {
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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': this.supabaseAnonKey
      };

      // Add authorization header if user is authenticated
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
        console.log('🔐 Using authenticated user token');
      } else {
        headers['Authorization'] = `Bearer ${this.supabaseAnonKey}`;
        headers['X-Demo-User-Id'] = '00000000-0000-4000-8000-000000000000';
        console.log('👤 Using demo user for unauthenticated request');
      }

      const apiUrl = `${this.supabaseUrl}/functions/v1/generate-story`;
      console.log('📡 Making API request to:', apiUrl);
      console.log('📋 Request headers:', Object.keys(headers));
      console.log('📦 Request payload:', JSON.stringify(params, null, 2));

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

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

      return data.story;
    } catch (error) {
      console.error('💥 Error in generateStory:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      if (error instanceof Error) {
        // Provide more specific error messages
        if (error.name === 'AbortError') {
          throw new Error('Story generation timed out. Please try again.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to story generation service. Please check your internet connection and try again.');
        } else {
          throw error;
        }
      } else {
        throw new Error('An unexpected error occurred during story generation');
      }
    }
  }

  async saveStory(story: GeneratedStory, userToken?: string): Promise<SavedStory> {
    console.log('💾 Saving story:', story.id);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': this.supabaseAnonKey
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
        console.log('🔐 Using authenticated user token for save');
      } else {
        throw new Error('Authentication required to save stories');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`${this.supabaseUrl}/functions/v1/save-story`, {
        method: 'POST',
        headers,
        body: JSON.stringify(story),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📨 Save story response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error saving story:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Story saved successfully:', data.story.id);
      
      return data.story;
    } catch (error) {
      console.error('💥 Error saving story:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out while saving story. Please try again.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to story service. Please check your internet connection and try again.');
      } else {
        throw new Error('Failed to save story. Please try again.');
      }
    }
  }

  async getUserStories(userToken?: string): Promise<SavedStory[]> {
    console.log('📚 Fetching user stories...');
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': this.supabaseAnonKey
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
        console.log('🔐 Using authenticated user token for stories');
      } else {
        console.log('👤 No authentication - returning empty stories list');
        return [];
      }

      console.log('📡 Making request to get user stories');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.supabaseUrl}/functions/v1/get-user-stories`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

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
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out while fetching stories. Please try again.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to story service. Please check your internet connection and try again.');
      } else {
        throw new Error('Failed to fetch stories. Please try again.');
      }
    }
  }

  async deleteStory(storyId: string, userToken?: string): Promise<void> {
    console.log('🗑️ Deleting story:', storyId);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': this.supabaseAnonKey
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
        console.log('🔐 Using authenticated user token for delete');
      } else {
        throw new Error('Authentication required to delete stories');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.supabaseUrl}/functions/v1/delete-story`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ storyId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📨 Delete story response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error deleting story:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Story deleted successfully');
    } catch (error) {
      console.error('💥 Error deleting story:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out while deleting story. Please try again.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to story service. Please check your internet connection and try again.');
      } else {
        throw new Error('Failed to delete story. Please try again.');
      }
    }
  }

  async updateStory(storyId: string, updates: { isFavorite?: boolean; incrementReadCount?: boolean }, userToken?: string): Promise<void> {
    console.log('📝 Updating story:', storyId, updates);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': this.supabaseAnonKey
      };

      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
        console.log('🔐 Using authenticated user token for update');
      } else {
        headers['Authorization'] = `Bearer ${this.supabaseAnonKey}`;
        headers['X-Demo-User-Id'] = '00000000-0000-4000-8000-000000000000';
        console.log('👤 Using demo user for unauthenticated update');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.supabaseUrl}/functions/v1/update-story`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ storyId, ...updates }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📨 Update story response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error updating story:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Story updated successfully');
    } catch (error) {
      console.error('💥 Error updating story:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out while updating story. Please try again.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to story service. Please check your internet connection and try again.');
      } else {
        throw new Error('Failed to update story. Please try again.');
      }
    }
  }

  // Test connection method for debugging
  async testConnection(): Promise<boolean> {
    console.log('🔍 Testing Supabase connection...');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'apikey': this.supabaseAnonKey,
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

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