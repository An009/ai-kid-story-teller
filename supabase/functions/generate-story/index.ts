import { corsHeaders } from '../_shared/cors.ts';

interface StoryRequest {
  theme: string;
  heroName: string;
  heroType: string;
  setting: string;
  ageGroup: '4-6' | '7-9' | '10-12';
  storyLength: 'short' | 'medium' | 'long';
  mood?: string;
  magicLevel?: 'low' | 'medium' | 'high';
}

interface StoryResponse {
  title: string;
  content: string;
  moral: string;
}

const COHERE_API_KEY = Deno.env.get('COHERE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Age-appropriate vocabulary and complexity settings
const ageSettings = {
  '4-6': {
    vocabularyLevel: 'simple',
    sentenceLength: 'short (5-8 words)',
    concepts: 'basic emotions and actions',
    wordCount: { short: 200, medium: 300, long: 400 },
    instructions: 'Use very simple words, short sentences, and repetitive patterns. Include lots of sounds (whoosh, splash, giggle) and simple emotions.'
  },
  '7-9': {
    vocabularyLevel: 'intermediate',
    sentenceLength: 'medium (8-12 words)',
    concepts: 'problem-solving and friendship',
    wordCount: { short: 300, medium: 500, long: 700 },
    instructions: 'Use slightly more complex vocabulary, varied sentence lengths, and introduce simple problem-solving scenarios.'
  },
  '10-12': {
    vocabularyLevel: 'advanced',
    sentenceLength: 'varied (8-15 words)',
    concepts: 'complex emotions and moral reasoning',
    wordCount: { short: 400, medium: 600, long: 900 },
    instructions: 'Use richer vocabulary, complex sentence structures, and deeper character development with meaningful life lessons.'
  }
};

const themePrompts = {
  adventure: 'an exciting journey with challenges to overcome and discoveries to make',
  friendship: 'the importance of kindness, understanding, and helping others',
  magic: 'discovering special abilities and using them responsibly to help others',
  dreams: 'pursuing goals with determination and never giving up',
  mystery: 'solving puzzles through curiosity, observation, and teamwork',
  kindness: 'how small acts of kindness create positive changes in the world'
};

const settingDescriptions = {
  forest: 'an enchanted woodland with talking animals, magical trees, and hidden clearings filled with wonder',
  ocean: 'an underwater kingdom with coral castles, friendly sea creatures, and mysterious depths',
  mountain: 'magical peaks with crystal caves, wise mountain spirits, and breathtaking views',
  castle: 'a magnificent royal palace with secret passages, grand ballrooms, and beautiful gardens',
  space: 'the vast cosmos with twinkling stars, colorful planets, and friendly alien civilizations',
  village: 'a cozy town with cobblestone streets, friendly neighbors, and charming shops'
};

function constructPrompt(request: StoryRequest): string {
  const ageConfig = ageSettings[request.ageGroup];
  const targetWordCount = ageConfig.wordCount[request.storyLength];
  const themeDescription = themePrompts[request.theme as keyof typeof themePrompts] || request.theme;
  const settingDescription = settingDescriptions[request.setting as keyof typeof settingDescriptions] || request.setting;
  
  return `Write a ${request.storyLength} children's story for ages ${request.ageGroup} (approximately ${targetWordCount} words).

STORY REQUIREMENTS:
- Main character: ${request.heroName}, a ${request.heroType}
- Setting: ${settingDescription}
- Theme: ${themeDescription}
- Mood: ${request.mood || 'happy and uplifting'}
- Magic level: ${request.magicLevel || 'medium'} magical elements
- Age-appropriate content: ${ageConfig.instructions}

STRUCTURE REQUIREMENTS:
1. Create a compelling title that includes the character's name
2. Write a complete story with clear beginning, middle, and end
3. Include 2-3 supporting characters that help drive the plot
4. Use dialogue to bring characters to life
5. Include sensory details (what characters see, hear, feel)
6. Add gentle humor and whimsical elements appropriate for children
7. Ensure the story teaches the theme naturally through the plot
8. End with a clear, positive resolution

LANGUAGE REQUIREMENTS:
- Vocabulary: ${ageConfig.vocabularyLevel}
- Sentence length: ${ageConfig.sentenceLength}
- Include onomatopoeia (sound words like "whoosh," "splash," "giggle")
- Use active voice and engaging descriptions
- Create vivid imagery that sparks imagination

FORMAT:
Return the response as a JSON object with this exact structure:
{
  "title": "Story title here",
  "content": "Complete story content with proper paragraph breaks",
  "moral": "The key lesson or moral of the story"
}

The story should be engaging, age-appropriate, and inspire wonder while teaching valuable life lessons.`;
}

async function generateStoryWithCohere(prompt: string): Promise<StoryResponse> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-xlarge-nightly',
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.8,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.generations[0].text.trim();
    
    // Try to parse as JSON first
    try {
      const parsedStory = JSON.parse(generatedText);
      if (parsedStory.title && parsedStory.content && parsedStory.moral) {
        return parsedStory;
      }
    } catch {
      // If JSON parsing fails, extract content manually
      console.log('JSON parsing failed, extracting content manually');
    }
    
    // Fallback: extract title, content, and moral from text
    const lines = generatedText.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^["']|["']$/g, '') || 'A Magical Story';
    const content = lines.slice(1).join('\n\n').trim() || generatedText;
    const moral = 'Every adventure teaches us something valuable about ourselves and others.';
    
    return { title, content, moral };
  } catch (error) {
    console.error('Error generating story with Cohere:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
}

async function saveStoryToDatabase(story: StoryResponse, request: StoryRequest, userId: string) {
  try {
    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        title: story.title,
        content: story.content,
        theme: request.theme,
        hero_name: request.heroName,
        hero_type: request.heroType,
        setting: request.setting,
        age_group: request.ageGroup,
        story_length: request.storyLength,
        mood: request.mood || 'happy',
        magic_level: request.magicLevel || 'medium'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save story to database');
    }

    return data;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check for required environment variables
    if (!COHERE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Cohere API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extract user ID from JWT token and handle demo user case
    const token = authHeader.replace('Bearer ', '');
    let userId = token;
    
    // If it's the demo user ID, replace with a valid UUID for database compatibility
    if (userId === 'demo-user-id') {
      userId = '00000000-0000-0000-0000-000000000001';
    }

    // Parse request body
    const requestBody: StoryRequest = await req.json();

    // Validate required fields
    const requiredFields = ['theme', 'heroName', 'heroType', 'setting', 'ageGroup', 'storyLength'];
    for (const field of requiredFields) {
      if (!requestBody[field as keyof StoryRequest]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Validate enum values
    if (!['4-6', '7-9', '10-12'].includes(requestBody.ageGroup)) {
      return new Response(
        JSON.stringify({ error: 'Invalid age group' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!['short', 'medium', 'long'].includes(requestBody.storyLength)) {
      return new Response(
        JSON.stringify({ error: 'Invalid story length' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate story prompt
    const prompt = constructPrompt(requestBody);

    // Generate story using Cohere API
    const story = await generateStoryWithCohere(prompt);

    // Save story to database
    const savedStory = await saveStoryToDatabase(story, requestBody, userId);

    // Return the generated story
    return new Response(
      JSON.stringify({
        success: true,
        story: {
          id: savedStory.id,
          title: story.title,
          content: story.content,
          moral: story.moral,
          theme: requestBody.theme,
          heroName: requestBody.heroName,
          heroType: requestBody.heroType,
          setting: requestBody.setting,
          ageGroup: requestBody.ageGroup,
          storyLength: requestBody.storyLength,
          mood: requestBody.mood || 'happy',
          magicLevel: requestBody.magicLevel || 'medium',
          createdAt: savedStory.created_at
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-story function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});