import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="App-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="M.A.D.H.A.V.A. Logo" />
        </Link>
        <div className="header-links">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/pricing" className="header-link">Pricing</Link>
          {/* Add other links as needed */}
        </div>
      </div>
    </header>
  );
};

export default Header; 