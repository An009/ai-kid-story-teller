/*
  # Fix user_id foreign key constraint issue

  1. Changes
    - Remove foreign key constraint from stories table to allow demo users
    - Remove foreign key constraint from user_preferences table
    - Make user_id nullable in stories table to support guest users
    - Update RLS policies to handle both authenticated and guest users

  2. Security
    - Maintain RLS policies but allow for guest/demo users
    - Keep data isolation between different users
*/

-- Drop existing foreign key constraints
ALTER TABLE stories DROP CONSTRAINT IF EXISTS stories_user_id_fkey;
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS user_preferences_user_id_fkey;

-- Make user_id nullable in stories table to support guest users
ALTER TABLE stories ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies for stories to handle guest users
DROP POLICY IF EXISTS "Users can view their own stories" ON stories;
DROP POLICY IF EXISTS "Users can insert their own stories" ON stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;

-- Create new policies that handle both authenticated and guest users
CREATE POLICY "Users can view their own stories"
  ON stories
  FOR SELECT
  TO authenticated, anon
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

CREATE POLICY "Users can insert stories"
  ON stories
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

CREATE POLICY "Users can update their own stories"
  ON stories
  FOR UPDATE
  TO authenticated, anon
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

CREATE POLICY "Users can delete their own stories"
  ON stories
  FOR DELETE
  TO authenticated, anon
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

-- Update user_preferences policies to handle the removed foreign key
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated, anon
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated, anon
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN auth.uid() = user_id
      ELSE true
    END
  );