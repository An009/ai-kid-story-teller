/*
  # Stories and User Preferences Schema

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `theme` (text)
      - `hero_name` (text)
      - `hero_type` (text)
      - `setting` (text)
      - `age_group` (text)
      - `story_length` (text)
      - `mood` (text)
      - `magic_level` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_favorite` (boolean)
      - `read_count` (integer)

    - `user_preferences`
      - `user_id` (uuid, primary key, foreign key to auth.users)
      - `preferred_themes` (jsonb)
      - `default_hero_name` (text)
      - `preferred_age_group` (text)
      - `preferred_story_length` (text)
      - `narration_speed` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  theme text NOT NULL,
  hero_name text NOT NULL,
  hero_type text NOT NULL,
  setting text NOT NULL,
  age_group text NOT NULL CHECK (age_group IN ('4-6', '7-9', '10-12')),
  story_length text NOT NULL CHECK (story_length IN ('short', 'medium', 'long')),
  mood text DEFAULT 'happy',
  magic_level text DEFAULT 'medium' CHECK (magic_level IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_favorite boolean DEFAULT false,
  read_count integer DEFAULT 0
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_themes jsonb DEFAULT '[]'::jsonb,
  default_hero_name text,
  preferred_age_group text DEFAULT '4-6' CHECK (preferred_age_group IN ('4-6', '7-9', '10-12')),
  preferred_story_length text DEFAULT 'medium' CHECK (preferred_story_length IN ('short', 'medium', 'long')),
  narration_speed text DEFAULT 'normal' CHECK (narration_speed IN ('slow', 'normal', 'fast')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for stories table
CREATE POLICY "Users can view their own stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_preferences table
CREATE POLICY "Users can view their own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS stories_theme_idx ON stories(theme);
CREATE INDEX IF NOT EXISTS stories_is_favorite_idx ON stories(is_favorite) WHERE is_favorite = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();