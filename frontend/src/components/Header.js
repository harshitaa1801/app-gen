import React from 'react';
import './Header.css';

const Header = ({ title = "App Gen" }) => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">{title}</h1>
        <nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
