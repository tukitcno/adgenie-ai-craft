
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Config
const CLIENT_ID = Deno.env.get('META_CLIENT_ID') || '';
const CLIENT_SECRET = Deno.env.get('META_CLIENT_SECRET') || '';
const REDIRECT_URI = Deno.env.get('META_REDIRECT_URI') || '';

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
      const authUrl = new URL('https://www.facebook.com/v17.0/dialog/oauth');
      authUrl.searchParams.append('client_id', CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.append('scope', 'ads_management,ads_read,business_management');
      authUrl.searchParams.append('response_type', 'code');
      
      return new Response(JSON.stringify({ url: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v17.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Get user details from the token
    const userInfoResponse = await fetch(`https://graph.facebook.com/v17.0/me?access_token=${tokenData.access_token}`);
    const userInfo = await userInfoResponse.json();

    // Store in database (this would need the user's ID from auth context)
    // In a real implementation, this would be securely stored with the user's Supabase ID
    
    return new Response(JSON.stringify({
      success: true,
      platform: 'meta',
      account_id: userInfo.id,
      message: 'Successfully authenticated with Meta'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in Meta auth:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to authenticate with Meta'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
