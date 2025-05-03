import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`side-menu-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      {/* Side Menu */}
      <div className={`side-menu ${isOpen ? 'active' : ''}`}>
        <div className="side-menu-header">
          <h2>M.A.D.H.A.V.A.</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="side-menu-content">
          {/* About Section - Moved to top */}
          <div className="menu-section">
            <h3>About</h3>
            <ul>
              <li>
                <Link to="/about" onClick={onClose}>
                  <span className="icon">ℹ️</span>
                  About MADHAVA
                </Link>
              </li>
              <li>
                <Link to="/team" onClick={onClose}>
                  <span className="icon">👥</span>
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Domains Section */}
          <div className="menu-section">
            <h3>Domains</h3>
            <ul>
              <li>
                <Link to="/finance" onClick={onClose}>
                  <span className="icon">💰</span>
                  Finance
                </Link>
              </li>
              <li>
                <Link to="/healthcare" onClick={onClose}>
                  <span className="icon">🏥</span>
                  Healthcare
                </Link>
              </li>
              <li>
                <Link to="/legal" onClick={onClose}>
                  <span className="icon">⚖️</span>
                  Legal
                </Link>
              </li>
              <li>
                <Link to="/code-assistant" onClick={onClose}>
                  <span className="icon">💻</span>
                  Code Assistant
                </Link>
              </li>
              <li>
                <Link to="/news" onClick={onClose}>
                  <span className="icon">📰</span>
                  News
                </Link>
              </li>
              <li>
                <Link to="/ecommerce" onClick={onClose}>
                  <span className="icon">🛍️</span>
                  E-commerce
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="menu-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <Link to="/documentation" onClick={onClose}>
                  <span className="icon">📚</span>
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/api-reference" onClick={onClose}>
                  <span className="icon">🔌</span>
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/tutorials" onClick={onClose}>
                  <span className="icon">🎓</span>
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/pricing" onClick={onClose}>
                  <span className="icon">💲</span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={onClose}>
                  <span className="icon">📞</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu; 