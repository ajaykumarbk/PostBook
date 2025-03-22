import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/navbar';
import { HeroSection } from './components/home/hero-section';
import { AuthPage } from './pages/auth';
import { JobsPage } from './pages/jobs';
import { JobDetailsPage } from './pages/job-details';
import { PostJobPage } from './pages/post-job';
import { EmployerDashboard } from './pages/dashboard/employer';
import { JobSeekerDashboard } from './pages/dashboard/job-seeker';

function HomePage() {
  return (
    <div>
      <HeroSection />
      {/* We'll add more sections here later */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/jobs/post" element={<PostJobPage />} />
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App