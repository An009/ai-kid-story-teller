const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-demo-user-id',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📚 Get user stories function called')

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

    // If no authenticated user, return empty array
    if (!userId) {
      console.log('👤 No authenticated user - returning empty stories')
      return new Response(
        JSON.stringify({ 
          success: true, 
          stories: [] 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('👤 Fetching stories for user ID:', userId)

    // Fetch user stories from database
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch stories from database' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Successfully fetched', stories?.length || 0, 'stories')

    return new Response(
      JSON.stringify({ 
        success: true, 
        stories: stories || [] 
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