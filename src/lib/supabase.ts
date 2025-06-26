
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

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
