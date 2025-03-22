import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Your Dream Job Today
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with top employers and discover opportunities that match your skills and aspirations.
            Your next career move starts here.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-300">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords"
                className="flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
              <Button size="sm" className="rounded-full">
                Search
              </Button>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            Popular: Software Engineer, Product Manager, Data Scientist, Remote
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Team collaboration"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
          />
        </div>
      </div>
    </div>
  );
}