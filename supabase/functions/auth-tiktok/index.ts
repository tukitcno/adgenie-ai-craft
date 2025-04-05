
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Config
const CLIENT_ID = Deno.env.get('TIKTOK_CLIENT_ID') || '';
const CLIENT_SECRET = Deno.env.get('TIKTOK_CLIENT_SECRET') || '';
const REDIRECT_URI = Deno.env.get('TIKTOK_REDIRECT_URI') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      // If no code, this is the initial authorization redirect
      const authUrl = new URL('https://ads.tiktok.com/marketing_api/auth');
      authUrl.searchParams.append('app_id', CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.append('state', 'your-state');
      
      return new Response(JSON.stringify({ url: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: CLIENT_ID,
        secret: CLIENT_SECRET,
        auth_code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.data || !tokenData.data.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Store in database (this would need the user's ID from auth context)
    // In a real implementation, this would be securely stored with the user's Supabase ID
    
    return new Response(JSON.stringify({
      success: true,
      platform: 'tiktok',
      account_id: tokenData.data.advertiser_ids?.[0] || null,
      message: 'Successfully authenticated with TikTok'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in TikTok auth:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to authenticate with TikTok'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
