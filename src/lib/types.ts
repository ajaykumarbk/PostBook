export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  type: string;
  experience_level: string;
  created_at: string;
  expires_at: string;
  user_id: string;
  category_id: string | null;
  is_remote: boolean;
  application_count: number;
  views_count: number;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
  interview_date: string | null;
  interview_notes: string | null;
  skills_match_score: number | null;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  category?: string;
  isRemote?: boolean;
  skills?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  resume_url: string | null;
  skills: string[];
  experience_years: number | null;
  created_at: string;
  updated_at: string;
}

export interface JobSkill {
  job_id: string;
  skill_id: string;
}