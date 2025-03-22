import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FilterIcon, BriefcaseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Job, JobFilters } from '@/lib/types';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, [filters]);

  async function loadJobs() {
    try {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*')
        .gte('expires_at', new Date().toISOString());

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.salaryMin) {
        query = query.gte('salary_min', filters.salaryMin);
      }
      if (filters.salaryMax) {
        query = query.lte('salary_max', filters.salaryMax);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <Button onClick={() => navigate('/jobs/post')}>
            Post a Job
          </Button>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {/* Add filter modal/drawer */}}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white text-center">
            <BriefcaseIcon className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <h2 className="mb-2 text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="mb-4 text-gray-600">{job.company}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {job.type}
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{job.experience_level}</span>
                  <span>
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}