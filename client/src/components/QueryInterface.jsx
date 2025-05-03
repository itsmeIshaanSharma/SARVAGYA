import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import TypeWriterMarkdown from './TypeWriterMarkdown';
import './QueryInterface.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const QueryInterface = ({ domain }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateResponse, setAnimateResponse] = useState(true);

  // Clear response and query when domain changes
  useEffect(() => {
    setResponse(null);
    setError(null);
    setQuery('');
  }, [domain]);

  // Apply syntax highlighting to code blocks after component updates
  useEffect(() => {
    if (response && !animateResponse) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [response, animateResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: query.trim(),
          domain: domain.toLowerCase()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResponse({
        answer: data.response,
        metrics: {
          responseTime: data.metrics.responseTime,
          tokenCount: data.metrics.tokenCount
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get response. Please try again later.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to format code blocks in the response
  const formatResponse = (text) => {
    // Ensure code blocks are properly formatted
    return text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
      return `\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n`;
    });
  };

  // Toggle animation
  const toggleAnimation = () => {
    setAnimateResponse(!animateResponse);
  };

  return (
    <div className="query-interface">
      <div className="domain-indicator">
        <span className="domain-label">Current Domain:</span>
        <span className="domain-value">{domain}</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask anything about ${domain}...`}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Generating response...</p>
        </div>
      )}

      {response && (
        <div className="response-section">
          <div className="response-header">
            <h3>Answer:</h3>
            {response.answer.length > 300 && (
              <button 
                className="animation-toggle" 
                onClick={toggleAnimation}
                title={animateResponse ? "Turn off typing animation" : "Turn on typing animation"}
              >
                {animateResponse ? "Disable Animation" : "Enable Animation"}
              </button>
            )}
          </div>
          
          <div className="answer">
            <div className="markdown-content">
              {animateResponse ? (
                <TypeWriterMarkdown 
                  content={formatResponse(response.answer)} 
                  speed={5}
                />
              ) : (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                >
                  {formatResponse(response.answer)}
                </ReactMarkdown>
              )}
            </div>
          </div>

          {response.metrics && (
            <div className="metrics">
              <h3>Metrics:</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Response Time:</span>
                  <span className="metric-value">{response.metrics.responseTime}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Token Count:</span>
                  <span className="metric-value">{response.metrics.tokenCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryInterface; 