import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="description-section">
        <div className="intro">
          <p>
            <strong>M.A.D.H.A.V.A.</strong> (Multi-domain Analytical Data Harvesting & Automated Verification Assistant) 
            is an advanced AI-driven platform designed to provide real-time, domain-specific, and 
            verified information for professionals in finance, healthcare, legal, and education.
          </p>
        </div>

        <div className="tech-section">
          <p className="tech-intro">
            Built with cutting-edge technologies like <strong>FastAPI</strong>, <strong>Pinecone</strong>, 
            <strong>Pathway</strong>, and <strong>LangChain</strong>, our system ensures:
          </p>
          <ul className="features-list">
            <li>
              <span className="check">✅</span>
              <div>
                <strong>Real-time Data Processing</strong>
                <p>Stay updated with the latest insights.</p>
              </div>
            </li>
            <li>
              <span className="check">✅</span>
              <div>
                <strong>Smart Search & Verification</strong>
                <p>Get accurate, context-rich results using AI-powered RAG models.</p>
              </div>
            </li>
            <li>
              <span className="check">✅</span>
              <div>
                <strong>Seamless User Experience</strong>
                <p>Intuitive dashboard with customizable analytics.</p>
              </div>
            </li>
            <li>
              <span className="check">✅</span>
              <div>
                <strong>Scalability & Performance</strong>
                <p>Fast, reliable, and built for heavy data loads.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="cta-section">
          <p className="cta-text">
            Join M.A.D.H.A.V.A. and experience faster decision-making, enhanced productivity, 
            and trusted intelligence at your fingertips! 🚀
          </p>
          <div className="cta-buttons">
            <Link to="/query" className="primary-button">Start Your Journey</Link>
            <Link to="/team" className="secondary-button">Meet Our Team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
