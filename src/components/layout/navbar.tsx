import { Button } from '@/components/ui/button';
import { BriefcaseIcon, MenuIcon, UserCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JobPortal</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/jobs" className="text-gray-700 hover:text-gray-900">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-gray-900">
              Companies
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-gray-900">
              Resources
            </Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="ml-4">
                    <UserCircleIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" className="ml-4">
                    <UserCircleIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>Create Account</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              to="/jobs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Companies
            </Link>
            <Link
              to="/resources"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Resources
            </Link>
            <div className="mt-4 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full">
                      <UserCircleIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="outline" className="w-full">
                      <UserCircleIcon className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">Create Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}