import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Allow initialization with empty values during development
export const supabase = createClient(
  supabaseUrl || 'http://placeholder-url',
  supabaseAnonKey || 'placeholder-key'
);