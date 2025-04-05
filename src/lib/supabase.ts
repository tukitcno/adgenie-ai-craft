
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are defined
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL environment variable is not defined')
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY environment variable is not defined')
}

export const supabase = createClient(
  supabaseUrl || '', // Fallback to empty string to prevent immediate error
  supabaseAnonKey || '' // Fallback to empty string to prevent immediate error
)
