import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-demo-user-id',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
}

interface UpdateStoryParams {
  storyId: string;
  isFavorite?: boolean;
  incrementReadCount?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📝 Update story function called')
    
    // Get request body
    const params: UpdateStoryParams = await req.json()
    console.log('📋 Update params:', params)

    if (!params.storyId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Story ID is required' 
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

    // Get user ID from header
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

    // If no authenticated user, return error for update operations
    if (!userId) {
      console.log('👤 No authenticated user - cannot update story')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required to update stories' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('👤 Updating story for user ID:', userId)

    // Prepare update data
    const updateData: any = {}
    
    if (params.isFavorite !== undefined) {
      updateData.is_favorite = params.isFavorite
    }
    
    if (params.incrementReadCount) {
      // First get current read count
      const { data: currentStory } = await supabase
        .from('stories')
        .select('read_count')
        .eq('id', params.storyId)
        .eq('user_id', userId)
        .single()
      
      if (currentStory) {
        updateData.read_count = (currentStory.read_count || 0) + 1
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No valid update fields provided' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update the story
    const { error } = await supabase
      .from('stories')
      .update(updateData)
      .eq('id', params.storyId)
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Database update error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to update story in database' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Story updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Story updated successfully' 
      }),
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