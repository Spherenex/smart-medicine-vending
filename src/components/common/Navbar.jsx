import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import '../../styles/common.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💊</span>
          <span className="logo-text">HealthChatAI</span>
        </Link>
        
        {user ? (
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/chat" className="nav-link">Chat</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;