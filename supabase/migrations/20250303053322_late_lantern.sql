/*
  # Initial Schema Setup for Candidate Application System

  1. New Tables
    - `profiles` - User profiles with admin flag
    - `jobs` - Available job positions
    - `applications` - Candidate applications
    - `feedback` - Reviewer feedback on applications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL,
  resume_text TEXT,
  resume_keywords TEXT[],
  status TEXT DEFAULT 'New' NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  match_score INTEGER,
  summary TEXT
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert applications"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Feedback policies
CREATE POLICY "Admins can insert feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can view all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can view feedback on their applications"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = feedback.application_id
      AND applications.user_id = auth.uid()
    )
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample jobs
INSERT INTO jobs (title, department, location, type, description, requirements)
VALUES 
  ('Frontend Developer Intern', 'Engineering', 'Remote', 'Full-time', 
   'Join our engineering team to build modern web applications using React, Next.js, and TypeScript. You''ll work on real projects and gain hands-on experience with industry-standard tools and practices.',
   ARRAY['React.js', 'JavaScript/TypeScript', 'HTML/CSS', 'Git', 'Problem-solving skills']),
  
  ('Backend Developer Intern', 'Engineering', 'Hybrid', 'Full-time', 
   'Work on our backend services and APIs using Node.js, Express, and MongoDB. You''ll learn about database design, API development, and server-side architecture.',
   ARRAY['Node.js', 'Express', 'MongoDB/SQL', 'RESTful APIs', 'Basic understanding of web servers']),
  
  ('Data Science Intern', 'Data', 'Remote', 'Part-time', 
   'Analyze data and build machine learning models to extract insights and drive business decisions. You''ll work with Python, pandas, and scikit-learn.',
   ARRAY['Python', 'Data analysis', 'Basic statistics', 'Machine learning concepts', 'SQL']);