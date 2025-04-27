import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authContext?.login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">BookSwap 📚</div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/books">Browse Books</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </nav>

      <section className="auth-form">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
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

export default Login;
