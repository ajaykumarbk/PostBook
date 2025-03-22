import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import type { Job, JobApplication } from '@/lib/types';

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob();
      checkApplication();
    }
  }, [id]);

  async function loadJob() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  }

  async function checkApplication() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  }

  async function handleApply() {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setApplying(true);
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying for job:', error);
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="mb-6 border-b pb-6">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="mb-4 text-xl text-gray-600">{job.company}</p>
              <div className="flex flex-wrap gap-4 text-gray-500">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="mr-2 h-5 w-5" />
                  {job.type}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
                {job.salary_min && job.salary_max && (
                  <div className="flex items-center">
                    <DollarSignIcon className="mr-2 h-5 w-5" />
                    {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Job Description</h2>
              <div className="prose max-w-none">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Requirements</h2>
              <div className="prose max-w-none">
                {job.requirements.split('\n').map((requirement, index) => (
                  <p key={index} className="mb-4 text-gray-600">
                    {requirement}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              {hasApplied ? (
                <Button disabled className="w-full sm:w-auto">
                  Application Submitted
                </Button>
              ) : (
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full sm:w-auto"
                >
                  {applying ? 'Submitting Application...' : 'Apply Now'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}