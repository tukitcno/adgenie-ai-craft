
import { supabase } from "@/integrations/supabase/client";

export type AdPlatform = "google" | "meta" | "tiktok";

export type AdAccount = {
  id: string;
  user_id: string;
  platform: AdPlatform;
  account_id: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
};

// Get the current user's profile
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const { data, error } = await supabase
    .from('users_meta')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) throw error;
  
  return data as UserProfile;
}

// Check if the current user is an admin
export async function isUserAdmin() {
  try {
    const profile = await getUserProfile();
    return profile.role === 'admin';
  } catch (error) {
    return false;
  }
}

// Get all ad accounts for the current user
export async function getUserAdAccounts() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const { data, error } = await supabase
    .from('ad_accounts')
    .select('*')
    .eq('user_id', user.id);
    
  if (error) throw error;
  
  return data as AdAccount[];
}

// Start the OAuth flow for a specific platform
export async function initiatePlatformAuth(platform: AdPlatform) {
  const response = await supabase.functions.invoke(`auth-${platform}`, {
    method: 'GET',
  });
  
  if (response.error) {
    throw new Error(`Failed to initiate ${platform} authentication: ${response.error.message}`);
  }
  
  return response.data;
}

// Complete the OAuth flow by saving the tokens
export async function completePlatformAuth(platform: AdPlatform, code: string) {
  const response = await supabase.functions.invoke(`auth-${platform}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    queryParams: {
      code: code,
    },
  });
  
  if (response.error) {
    throw new Error(`Failed to complete ${platform} authentication: ${response.error.message}`);
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  // Save the account information in the database
  const { data, error } = await supabase
    .from('ad_accounts')
    .insert({
      user_id: user.id,
      platform: platform,
      account_id: response.data.account_id || '',
      // Note: tokens are handled securely in the edge function and not exposed here
    })
    .select();
    
  if (error) {
    throw error;
  }
  
  return data;
}

// Admin functions
export async function getAllUsers() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  
  const { data, error } = await supabase
    .from('users_meta')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data as UserProfile[];
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  
  const { data, error } = await supabase
    .from('users_meta')
    .update({ role })
    .eq('id', userId)
    .select();
    
  if (error) throw error;
  
  return data;
}

export async function getAllAdAccounts() {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  
  const { data, error } = await supabase
    .from('ad_accounts')
    .select(`
      *,
      users_meta (
        id, 
        email, 
        full_name
      )
    `);
    
  if (error) throw error;
  
  return data;
}
