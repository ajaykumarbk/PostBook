import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3Icon, BriefcaseIcon, UsersIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Job, JobApplication } from '@/lib/types';

export function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    averageApplications: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setJobs(jobsData);
      setApplications(applicationsData);

      // Calculate statistics
      const activeJobs = jobsData.filter(
        (job) => new Date(job.expires_at) > new Date()
      ).length;

      setStats({
        totalJobs: jobsData.length,
        activeJobs,
        totalApplications: applicationsData.length,
        averageApplications:
          jobsData.length > 0
            ? Math.round(applicationsData.length / jobsData.length)
            : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(applicationId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <Button onClick={() => navigate('/jobs/post')}>Post New Job</Button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <BriefcaseIcon className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <ClockIcon className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <UsersIcon className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <BarChart3Icon className="h-10 w-10 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg. Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageApplications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Recent Applications
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.job_title}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {application.user_email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          {
                            pending: 'bg-yellow-100 text-yellow-800',
                            reviewed: 'bg-blue-100 text-blue-800',
                            shortlisted: 'bg-green-100 text-green-800',
                            rejected: 'bg-red-100 text-red-800',
                          }[application.status]
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusUpdate(application.id, e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Active Jobs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs
              .filter((job) => new Date(job.expires_at) > new Date())
              .map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg border border-gray-200 p-6"
                >
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    {job.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">{job.company}</p>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {job.application_count} applications
                    </span>
                    <span className="text-sm text-gray-500">
                      {job.views_count} views
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}