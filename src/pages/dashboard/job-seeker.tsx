import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { JobApplication, UserProfile } from '@/lib/types';

export function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    rejectedApplications: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(*)
        `)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (profileError && profileError.code !== 'PGRST116')
        throw profileError;

      setApplications(applicationsData);
      setProfile(profileData);

      // Calculate statistics
      setStats({
        totalApplications: applicationsData.length,
        pendingApplications: applicationsData.filter(
          (app) => app.status === 'pending'
        ).length,
        shortlistedApplications: applicationsData.filter(
          (app) => app.status === 'shortlisted'
        ).length,
        rejectedApplications: applicationsData.filter(
          (app) => app.status === 'rejected'
        ).length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <Button onClick={() => navigate('/profile')}>Edit Profile</Button>
        </div>

        {/* Profile Summary */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.full_name || 'Complete Your Profile'}
              </h2>
              <p className="mt-1 text-gray-500">{profile?.headline}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Experience</p>
              <p className="text-lg font-medium text-gray-900">
                {profile?.experience_years} years
              </p>
            </div>
          </div>
          {profile?.skills && profile.skills.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application Statistics */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <BriefcaseIcon className="h-10 w-10 text-blue-500" />
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
              <ClockIcon className="h-10 w-10 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.shortlistedApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <XCircleIcon className="h-10 w-10 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejectedApplications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            My Applications
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Company
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
                        {application.jobs?.title}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {application.jobs?.company}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/jobs/${application.jobs?.id}`)
                        }
                      >
                        View Job
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}