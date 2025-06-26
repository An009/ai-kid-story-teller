import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
}

interface DeleteStoryParams {
  storyId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🗑️ Delete story function called')
    
    // Get request body
    const { storyId }: DeleteStoryParams = await req.json()
    console.log('📋 Story ID to delete:', storyId)

    if (!storyId) {
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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required to delete stories' 
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

    // Delete the story (only if it belongs to the user)
    const { error: deleteError } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to delete story from database' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Story deleted successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Story deleted successfully' 
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
        error: 'An unexpected error occurred while deleting the story' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})