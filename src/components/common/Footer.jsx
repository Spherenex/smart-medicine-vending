// src/components/common/Footer.js

import React from 'react';
import './CommonStyles.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} HealthAI Assistant. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#disclaimer">Medical Disclaimer</a>
        </div>
      </div>
      <div className="medical-disclaimer">
        <p>
          <strong>Important:</strong> This application provides general information only and is not intended to replace 
          professional medical advice. Always consult with a qualified healthcare provider for medical concerns.
        </p>
      </div>
    </footer>
  );
};

export default Footer;