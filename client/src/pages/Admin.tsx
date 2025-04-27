import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username?: string;
  role: string;
  createdAt: string;
}

const Admin = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authContext?.accessToken) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${authContext.accessToken}` },
      })
      .then((response) => setUsers(response.data))
      .catch((err) => {
        console.error('Fetch users error:', err);
        setError('Failed to load users');
      });
  }, [authContext?.accessToken]);

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
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <section className="admin-panel">
        <h2>Admin Dashboard</h2>
        {error && <p className="error">{error}</p>}
        <h3>All Users</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id}>
              {user.email} ({user.username || 'No username'}, {user.role}) - Joined: {new Date(user.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
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

export default Admin;
