/*
  # Job Portal Database Schema

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `description` (text)
      - `requirements` (text)
      - `location` (text)
      - `salary_min` (integer)
      - `salary_max` (integer)
      - `type` (text) - full-time, part-time, contract, etc.
      - `experience_level` (text)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
      - `user_id` (uuid, foreign key) - references the employer who posted the job
    
    - `applications`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `status` (text) - pending, reviewed, shortlisted, rejected
      - `resume_url` (text)
      - `cover_letter` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for job posting and viewing
    - Add policies for job applications
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  location text NOT NULL,
  salary_min integer,
  salary_max integer,
  type text NOT NULL,
  experience_level text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  resume_url text,
  cover_letter text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies for jobs table
CREATE POLICY "Anyone can view jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Employers can create jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update their own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Employers can delete their own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for applications table
CREATE POLICY "Job seekers can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Employers can view applications for their jobs" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create type enum for job status
DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;