import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setError(null);
      setMessage(response.data.message);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send reset link');
      setMessage(null);
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
          <h2>Forgot Password</h2>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <p>
          <button onClick={() => navigate('/login')}>Back to Login</button>
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

export default ForgotPassword;
