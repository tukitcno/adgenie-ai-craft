
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          id: string
          created_at: string
          user_id: string
          platform: "google" | "meta" | "tiktok"
          image_path: string
          ad_content: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          platform: "google" | "meta" | "tiktok"
          image_path: string
          ad_content: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          platform?: "google" | "meta" | "tiktok"
          image_path?: string
          ad_content?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
