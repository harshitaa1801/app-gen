import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>App Gen</h3>
            <p>A modern React application built with best practices.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#" aria-label="GitHub">GitHub</a></li>
              <li><a href="#" aria-label="Twitter">Twitter</a></li>
              <li><a href="#" aria-label="LinkedIn">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 App Gen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
