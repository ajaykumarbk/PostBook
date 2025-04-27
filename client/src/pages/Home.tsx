import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/books/featured`)
      .then((response) => setBooks(response.data))
      .catch((err) => {
        console.error('Fetch books error:', err);
        setError('Failed to load featured books');
      });
  }, []);

  const handleLogout = () => {
    authContext?.logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">BookSwap 📚</div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/books">Browse Books</a>
          {authContext?.accessToken ? (
            <>
              <a href="/profile">Profile</a>
              {authContext.user?.role === 'admin' && <a href="/admin">Admin</a>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Welcome to BookSwap</h1>
        <p>Discover and swap your favorite books with others!</p>
        <button onClick={() => navigate('/books')}>Browse Books</button>
      </section>

      <section className="featured-books">
        <h2>Featured Books</h2>
        {error && <p className="error">{error}</p>}
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
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

export default Home;
