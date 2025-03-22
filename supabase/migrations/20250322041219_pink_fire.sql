/*
  # Enhanced Job Portal Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category_id` (uuid, foreign key)

    - `job_skills`
      - `job_id` (uuid, foreign key)
      - `skill_id` (uuid, foreign key)

    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `full_name` (text)
      - `headline` (text)
      - `bio` (text)
      - `resume_url` (text)
      - `skills` (text[])
      - `experience_years` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Updates
    - Add new columns to jobs table
    - Add new columns to applications table
    
  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, category_id)
);

-- Create job_skills junction table
CREATE TABLE IF NOT EXISTS job_skills (
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text,
  headline text,
  bio text,
  resume_url text,
  skills text[],
  experience_years integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_remote boolean DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_count integer DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;

-- Add new columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date timestamptz;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_notes text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS skills_match_score float;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- RLS Policies for skills
CREATE POLICY "Skills are viewable by everyone" ON skills
  FOR SELECT USING (true);

-- RLS Policies for job_skills
CREATE POLICY "Job skills are viewable by everyone" ON job_skills
  FOR SELECT USING (true);

CREATE POLICY "Employers can manage job skills" ON job_skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_skills.job_id
      AND jobs.user_id = auth.uid()
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update application count
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs
    SET application_count = application_count + 1
    WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs
    SET application_count = application_count - 1
    WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for application count
CREATE TRIGGER update_job_application_count_trigger
AFTER INSERT OR DELETE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_job_application_count();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updated_at
CREATE TRIGGER update_profile_updated_at_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at();