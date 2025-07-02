import React from 'react';
import '../../styles/common.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>HealthChatAI</h3>
            <p>Your personal AI health assistant for symptom analysis and guidance.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/chat">Start Chat</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Important</h3>
            <p className="disclaimer">
              This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HealthChatAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;