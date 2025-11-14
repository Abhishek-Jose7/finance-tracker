-- Chat History and User Preferences
-- Run this in your Supabase SQL Editor

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_preferences table (stores AI-learned info about user)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}'::jsonb,
  ai_context TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid()::TEXT IN (
    SELECT clerk_user_id FROM public.users WHERE id = chat_messages.user_id
  ));

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid()::TEXT IN (
    SELECT clerk_user_id FROM public.users WHERE id = chat_messages.user_id
  ));

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid()::TEXT IN (
    SELECT clerk_user_id FROM public.users WHERE id = user_preferences.user_id
  ));

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid()::TEXT IN (
    SELECT clerk_user_id FROM public.users WHERE id = user_preferences.user_id
  ));

-- Create indexes
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Add chat_context field to users table if not exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS chat_context TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

COMMENT ON TABLE public.chat_messages IS 'Stores chat history between users and AI assistant';
COMMENT ON TABLE public.user_preferences IS 'Stores AI-learned preferences and context about users';
