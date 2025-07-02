import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import '../../styles/auth.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      await resetPassword(email);
      
      setMessage({
        text: 'Password reset email sent. Check your inbox.',
        type: 'success'
      });
      
      // Clear email field
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle different error codes
      if (error.code === 'auth/user-not-found') {
        setMessage({
          text: 'No account found with this email',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Failed to send reset email. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Reset Your Password</h2>
        <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-redirect">
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            Back to login
          </Link>
        </div>
      </div>
      
      <div className="auth-info">
        <h3>Password Recovery</h3>
        <p>
          If you've forgotten your password, we'll send you a link to reset it.
          Check your email after submitting the form and follow the instructions
          to create a new password.
        </p>
        <div className="auth-steps">
          <div className="auth-step">
            <span className="step-number">1</span>
            <span className="step-text">Enter your email</span>
          </div>
          <div className="auth-step">
            <span className="step-number">2</span>
            <span className="step-text">Check your inbox</span>
          </div>
          <div className="auth-step">
            <span className="step-number">3</span>
            <span className="step-text">Follow the link</span>
          </div>
          <div className="auth-step">
            <span className="step-number">4</span>
            <span className="step-text">Create new password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;