
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://chpnawgfalchfqmmtmhb.supabase.co";//import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocG5hd2dmYWxjaGZxbW10bWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjUxNDYsImV4cCI6MjA2NjQ0MTE0Nn0.pCy_4IIvXiJcfRjHALLz3w0Z6vCUtej1IU6UgIcYXzk";//import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export type Translation = {
  id: string
  user_id: string
  input_text: string
  output_text: string
  romaji?: string
  jlpt_level?: string
  translation_direction: 'id_to_jp' | 'jp_to_id'
  created_at: string
}
