import React from 'react';
import './PageHeader.css';

const PageHeader = ({ title, subtitle }) => {
  const headerStyle = {
    background: 'linear-gradient(135deg, #00ffb3, #00b3ff)',
    padding: '2rem 0',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 10,
    width: '100%',
    display: 'block'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 700,
    margin: 0,
    color: '#1a1a1a',
    textShadow: '0 1px 2px rgba(255, 255, 255, 0.2)'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    margin: '0.5rem 0 0',
    color: 'rgba(0, 0, 0, 0.7)',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  return (
    <div style={headerStyle} className="page-header">
      <div style={contentStyle} className="page-header-content">
        <h1 style={titleStyle} className="page-title">{title}</h1>
        {subtitle && <p style={subtitleStyle} className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader; 