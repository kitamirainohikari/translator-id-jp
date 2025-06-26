
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabaseUrl = 'https://vefgzorseudueesyhwmb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZmd6b3JzZXVkdWVlc3lod21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzIzNjIsImV4cCI6MjA2NTk0ODM2Mn0.qeBQGXMu_sJwgU2vhfOkcBKlaXMlAE2s0gdX4INdJak'

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
