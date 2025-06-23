const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-demo-user-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Generate story function called')
    
    // Get request body
    const params: StoryGenerationParams = await req.json()
    console.log('📋 Request params:', params)

    // Validate required parameters
    const requiredFields = ['theme', 'heroName', 'heroType', 'setting', 'ageGroup', 'storyLength']
    const missingFields = requiredFields.filter(field => !params[field as keyof StoryGenerationParams])
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user ID from header or use null for anonymous users
    const demoUserId = req.headers.get('x-demo-user-id')
    const authHeader = req.headers.get('Authorization')
    let userId: string | null = null

    // If we have an auth header, try to get the real user
    if (authHeader && !demoUserId) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        userId = user.id
      }
    }

    console.log('👤 Using user ID:', userId || 'anonymous')

    // Generate story using Cohere API
    const cohereApiKey = Deno.env.get('COHERE_API_KEY')
    if (!cohereApiKey) {
      console.error('❌ Missing COHERE_API_KEY')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Story generation service not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create story prompt
    const prompt = `Write a ${params.storyLength} children's story for ages ${params.ageGroup} with the following details:
- Theme: ${params.theme}
- Hero: ${params.heroName} (a ${params.heroType})
- Setting: ${params.setting}
- Mood: ${params.mood || 'happy'}
- Magic level: ${params.magicLevel || 'medium'}

The story should be engaging, age-appropriate, and include a positive moral lesson. Format the response as a complete story with a clear beginning, middle, and end.`

    console.log('🤖 Generating story with Cohere...')

    // Call Cohere API
    const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: params.storyLength === 'short' ? 500 : params.storyLength === 'medium' ? 800 : 1200,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    })

    if (!cohereResponse.ok) {
      console.error('❌ Cohere API error:', cohereResponse.status)
      const errorText = await cohereResponse.text()
      console.error('❌ Cohere error details:', errorText)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to generate story content' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const cohereData = await cohereResponse.json()
    const storyContent = cohereData.generations[0].text.trim()

    console.log('✅ Story generated successfully')

    // Create story title
    const title = `${params.heroName} and the ${params.theme.charAt(0).toUpperCase() + params.theme.slice(1)} Adventure`

    // Generate a simple moral based on theme
    const morals: Record<string, string> = {
      'friendship': 'True friendship means being there for each other through good times and bad.',
      'adventure': 'Every adventure teaches us something new about ourselves and the world.',
      'magic': 'The greatest magic comes from believing in yourself and helping others.',
      'animals': 'All creatures deserve our kindness and respect.',
      'family': 'Family love gives us strength and courage to face any challenge.',
      'school': 'Learning new things helps us grow and discover our talents.',
      'nature': 'Taking care of our environment is taking care of our future.',
      'space': 'The universe is vast and full of wonders waiting to be discovered.',
      'underwater': 'Even in the deepest waters, courage and friendship light the way.',
      'fairy tale': 'Kindness and courage can overcome any obstacle.'
    }

    const moral = morals[params.theme] || 'Every challenge is an opportunity to grow and learn.'

    let savedStory = null

    // Only save to database if we have a valid user ID
    if (userId) {
      // Save story to database
      const storyData = {
        user_id: userId,
        title: title,
        content: storyContent,
        theme: params.theme,
        hero_name: params.heroName,
        hero_type: params.heroType,
        setting: params.setting,
        age_group: params.ageGroup,
        story_length: params.storyLength,
        mood: params.mood || 'happy',
        magic_level: params.magicLevel || 'medium',
        is_favorite: false,
        read_count: 0
      }

      console.log('💾 Saving story to database...')

      const { data, error: saveError } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single()

      if (saveError) {
        console.error('❌ Database save error:', saveError)
        // Don't fail the entire request if database save fails for authenticated users
        console.log('⚠️ Continuing without saving to database')
      } else {
        savedStory = data
        console.log('✅ Story saved to database with ID:', savedStory.id)
      }
    } else {
      console.log('👤 Anonymous user - story not saved to database')
    }

    // Return the generated story
    const response = {
      success: true,
      story: {
        id: savedStory?.id || `temp-${Date.now()}`,
        title: title,
        content: storyContent,
        moral: moral,
        theme: params.theme,
        heroName: params.heroName,
        heroType: params.heroType,
        setting: params.setting,
        ageGroup: params.ageGroup,
        storyLength: params.storyLength,
        mood: params.mood || 'happy',
        magicLevel: params.magicLevel || 'medium',
        createdAt: savedStory?.created_at || new Date().toISOString(),
        isTemporary: !savedStory
      }
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})