
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type AdContent = {
  headlines: string[];
  descriptions: string[];
  cta: string;
  hashtags?: string[];
  keywords?: string[];
}

export type AdCampaign = {
  id?: string;
  user_id: string;
  platform: "google" | "meta" | "tiktok";
  image_path: string;
  ad_content: AdContent;
  created_at?: string;
}

export async function saveAdCampaign(campaign: Omit<AdCampaign, 'id' | 'created_at'>) {
  return supabase
    .from('ad_campaigns')
    .insert(campaign)
    .select()
    .single();
}

export async function getAdCampaigns(userId: string) {
  const { data, error } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Type assertion to ensure platform is one of the expected values
  return {
    data: data?.map(campaign => ({
      ...campaign,
      platform: campaign.platform as "google" | "meta" | "tiktok",
      ad_content: campaign.ad_content as AdContent
    })) as AdCampaign[],
    error
  };
}

export async function getAdCampaignById(id: string) {
  const { data, error } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return { data: null, error };
  
  // Type assertion for the single campaign
  return {
    data: data ? {
      ...data,
      platform: data.platform as "google" | "meta" | "tiktok",
      ad_content: data.ad_content as AdContent
    } as AdCampaign : null,
    error
  };
}

export async function uploadProductImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `product-images/${fileName}`;

  const { error, data } = await supabase.storage
    .from('ad-images')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  return filePath;
}

export async function getImageUrl(filePath: string) {
  const { data } = supabase.storage
    .from('ad-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
