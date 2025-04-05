
import { supabase } from "@/lib/supabase"

export type AdContent = {
  headlines: string[]
  descriptions: string[]
  cta: string
  hashtags?: string[]
  keywords?: string[]
}

export type AdCampaign = {
  id?: string
  user_id: string
  platform: "google" | "meta" | "tiktok"
  image_path: string
  ad_content: AdContent
  created_at?: string
}

export async function saveAdCampaign(campaign: Omit<AdCampaign, 'id' | 'created_at'>) {
  return supabase
    .from('ad_campaigns')
    .insert(campaign)
    .select()
    .single()
}

export async function getAdCampaigns(userId: string) {
  return supabase
    .from('ad_campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function getAdCampaignById(id: string) {
  return supabase
    .from('ad_campaigns')
    .select('*')
    .eq('id', id)
    .single()
}

export async function uploadProductImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const filePath = `product-images/${fileName}`

  const { error, data } = await supabase.storage
    .from('ad-images')
    .upload(filePath, file)

  if (error) {
    throw error
  }

  return filePath
}

export async function getImageUrl(filePath: string) {
  const { data } = supabase.storage
    .from('ad-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
