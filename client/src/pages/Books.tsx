import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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

      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Browse Books</h2>
        <p>Explore our collection of books available for swapping. (Coming soon!)</p>
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

export default Books;
