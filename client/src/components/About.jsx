import React, { useEffect } from 'react';
import TypeWriter from './TypeWriter';
import './About.css';

const About = () => {
  useEffect(() => {
    // Apply any animations or effects when the component mounts
    document.title = 'About MADHAVA';
  }, []);

  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="about-title">
          <TypeWriter 
            text="Welcome to M.A.D.H.A.V.A." 
            speed={50} 
            className="title-typewriter"
          />
        </h1>
        <h2 className="about-subtitle">Intelligent Data Processing for Smarter Decisions</h2>
      </div>

      <div className="about-tagline">
        <TypeWriter 
          text='"Turning raw data into actionable insights – instantly, accurately, and efficiently."' 
          speed={30}
          className="tagline-typewriter"
        />
      </div>

      <div className="about-description">
        <p>
          <span className="acronym">M.A.D.H.A.V.A.</span> 
          <span className="acronym-expanded">(Multi-domain Analytical Data Harvesting & Automated Verification Assistant)</span> 
          is an advanced AI-driven platform designed to provide real-time, domain-specific, and verified information for professionals in finance, healthcare, legal, and education.
        </p>
      </div>

      <div className="about-features">
        <h3>Key Features</h3>
        <ul>
          <li>
            <span className="feature-icon">🔍</span>
            <span className="feature-text">
              <strong>Domain-Specific Intelligence:</strong> Specialized knowledge across multiple professional domains
            </span>
          </li>
          <li>
            <span className="feature-icon">⚡</span>
            <span className="feature-text">
              <strong>Real-Time Processing:</strong> Instant responses to complex queries
            </span>
          </li>
          <li>
            <span className="feature-icon">🔄</span>
            <span className="feature-text">
              <strong>Adaptive Learning:</strong> Continuously improving accuracy and relevance
            </span>
          </li>
          <li>
            <span className="feature-icon">📊</span>
            <span className="feature-text">
              <strong>Data Visualization:</strong> Clear presentation of complex information
            </span>
          </li>
          <li>
            <span className="feature-icon">🔒</span>
            <span className="feature-text">
              <strong>Verified Information:</strong> Rigorous fact-checking and source validation
            </span>
          </li>
        </ul>
      </div>

      <div className="about-domains">
        <h3>Specialized Domains</h3>
        <div className="domains-grid">
          <div className="domain-card">
            <div className="domain-icon">💰</div>
            <h4>Finance</h4>
            <p>Market analysis, investment strategies, and financial forecasting</p>
          </div>
          <div className="domain-card">
            <div className="domain-icon">🏥</div>
            <h4>Healthcare</h4>
            <p>Medical research, clinical data analysis, and healthcare trends</p>
          </div>
          <div className="domain-card">
            <div className="domain-icon">⚖️</div>
            <h4>Legal</h4>
            <p>Case law analysis, regulatory compliance, and legal document processing</p>
          </div>
          <div className="domain-card">
            <div className="domain-icon">💻</div>
            <h4>Code Assistant</h4>
            <p>Programming help, code optimization, and debugging assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 