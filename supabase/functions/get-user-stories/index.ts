import { corsHeaders } from '../_shared/cors.ts';

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
    if (req.method !== 'GET') {
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

    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const theme = url.searchParams.get('theme');
    const favoritesOnly = url.searchParams.get('favorites') === 'true';

    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    let query = supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (theme) {
      query = query.eq('theme', theme);
    }

    if (favoritesOnly) {
      query = query.eq('is_favorite', true);
    }

    const { data: stories, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch stories' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (theme) {
      countQuery = countQuery.eq('theme', theme);
    }

    if (favoritesOnly) {
      countQuery = countQuery.eq('is_favorite', true);
    }

    const { count } = await countQuery;

    return new Response(
      JSON.stringify({
        success: true,
        stories: stories || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-user-stories function:', error);
    
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