import { corsHeaders } from '../_shared/cors.ts';

interface UpdateStoryRequest {
  storyId: string;
  isFavorite?: boolean;
  incrementReadCount?: boolean;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    if (req.method !== 'PUT') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check for demo user header first
    const demoUserHeader = req.headers.get('X-Demo-User-Id');
    let userId: string;

    if (demoUserHeader === 'demo-user-id') {
      // Use hardcoded demo user ID for database compatibility
      userId = '00000000-0000-0000-0000-000000000001';
    } else {
      // Get authorization header for real users
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

      // Extract user ID from JWT token
      const token = authHeader.replace('Bearer ', '');
      userId = token; // In a real implementation, decode and verify the JWT
    }

    // Parse request body
    const requestBody: UpdateStoryRequest = await req.json();

    if (!requestBody.storyId) {
      return new Response(
        JSON.stringify({ error: 'Story ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Build update object
    const updateData: any = {};
    
    if (typeof requestBody.isFavorite === 'boolean') {
      updateData.is_favorite = requestBody.isFavorite;
    }

    if (requestBody.incrementReadCount) {
      // First get current read count
      const { data: currentStory } = await supabase
        .from('stories')
        .select('read_count')
        .eq('id', requestBody.storyId)
        .eq('user_id', userId)
        .single();

      if (currentStory) {
        updateData.read_count = (currentStory.read_count || 0) + 1;
      }
    }

    // Update the story
    const { data: updatedStory, error } = await supabase
      .from('stories')
      .update(updateData)
      .eq('id', requestBody.storyId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update story' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!updatedStory) {
      return new Response(
        JSON.stringify({ error: 'Story not found or access denied' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        story: updatedStory
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in update-story function:', error);
    
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