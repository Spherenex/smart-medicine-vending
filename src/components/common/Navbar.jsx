import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './CommonStyles.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Medicine-vending</Link>
      </div>
      
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">Chatbot</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleSignOut} className="logout-button">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;