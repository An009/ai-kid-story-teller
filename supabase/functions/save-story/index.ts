import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SaveStoryParams {
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('💾 Save story function called')
    
    // Get request body
    const storyData: SaveStoryParams = await req.json()
    console.log('📋 Story data to save:', {
      id: storyData.id,
      title: storyData.title,
      contentLength: storyData.content?.length || 0
    })

    // Validate required parameters
    const requiredFields = ['title', 'content', 'theme', 'heroName', 'heroType', 'setting', 'ageGroup', 'storyLength']
    const missingFields = requiredFields.filter(field => !storyData[field as keyof SaveStoryParams])
    
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required to save stories' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('❌ Authentication error:', authError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid authentication token' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('👤 Authenticated user:', user.email)

    // Prepare story data for database
    const dbStoryData = {
      user_id: user.id,
      title: storyData.title,
      content: storyData.content,
      theme: storyData.theme,
      hero_name: storyData.heroName,
      hero_type: storyData.heroType,
      setting: storyData.setting,
      age_group: storyData.ageGroup,
      story_length: storyData.storyLength,
      mood: storyData.mood || 'happy',
      magic_level: storyData.magicLevel || 'medium',
      is_favorite: false,
      read_count: 0
    }

    console.log('💾 Saving story to database...')

    // Save story to database
    const { data: savedStory, error: saveError } = await supabase
      .from('stories')
      .insert(dbStoryData)
      .select()
      .single()

    if (saveError) {
      console.error('❌ Database save error:', saveError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save story to database' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Story saved successfully with ID:', savedStory.id)

    // Return the saved story
    const response = {
      success: true,
      story: savedStory
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
        error: 'An unexpected error occurred while saving the story' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})