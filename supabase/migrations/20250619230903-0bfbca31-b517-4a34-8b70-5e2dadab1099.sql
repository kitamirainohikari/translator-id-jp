
-- Create translations table for storing translation history
CREATE TABLE public.translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  romaji TEXT,
  jlpt_level TEXT,
  translation_direction TEXT CHECK (translation_direction IN ('id_to_jp', 'jp_to_id')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for users to access their own translations
CREATE POLICY "Users can view their own translations" ON public.translations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own translations" ON public.translations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translations" ON public.translations
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_translations_user_id ON public.translations(user_id);
CREATE INDEX idx_translations_created_at ON public.translations(created_at DESC);
