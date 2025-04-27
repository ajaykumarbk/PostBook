import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState(authContext?.user?.username || '');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authContext?.updateProfile(username);
      setMessage('Profile updated successfully');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setMessage(null);
    }
  };

  const handleLogout = () => {
    authContext?.logout();
    navigate('/login');
  };

  if (!authContext?.user) return null;

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">BookSwap 📚</div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/books">Browse Books</a>
          <a href="/profile">Profile</a>
          {authContext.user?.role === 'admin' && <a href="/admin">Admin</a>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <section className="auth-form">
        <h2>Profile</h2>
        <p>Email: {authContext.user.email}</p>
        <p>Role: {authContext.user.role}</p>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <button type="submit">Update Username</button>
        </form>
      </section>

      <footer>
        <p>© 2025 BookSwap. All rights reserved.</p>
        <p>
          <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/terms">Terms</a>
        </p>
      </footer>
    </div>
  );
};

export default Profile;
