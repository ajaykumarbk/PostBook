import { AuthForm } from '@/components/auth/auth-form';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function AuthPage() {
  const location = useLocation();
  const { user } = useAuth();
  const mode = location.pathname === '/signin' ? 'signin' : 'signup';

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm mode={mode} />
      </div>
    </div>
  );
}