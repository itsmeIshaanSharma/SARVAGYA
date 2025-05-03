import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import QueryInterface from '../components/QueryInterface';
import './DomainPage.css';

// Hardcode the API URL to ensure it's correct
const API_BASE_URL = 'http://localhost:5001';

const DomainPage = ({ domain, description, icon }) => {
  const [serverStatus, setServerStatus] = useState('unknown');
  const [debugInfo, setDebugInfo] = useState('');

  // Check if the server is running
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        console.log(`Checking server status at ${API_BASE_URL}/health`);
        setDebugInfo(`Checking server at: ${API_BASE_URL}/health`);
        
        // Use XMLHttpRequest instead of fetch for better browser compatibility
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API_BASE_URL}/health`, true);
        xhr.timeout = 5000; // 5 seconds timeout
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log('Server health check successful:', data);
              setDebugInfo(prev => `${prev}\nServer response: ${JSON.stringify(data)}`);
              setServerStatus('online');
            } catch (e) {
              console.error('Error parsing response:', e);
              setDebugInfo(prev => `${prev}\nError parsing response: ${e.message}`);
              setServerStatus('error');
            }
          } else {
            console.error('Server health check failed with status:', xhr.status);
            setDebugInfo(prev => `${prev}\nServer error: ${xhr.status}`);
            setServerStatus('error');
          }
        };
        
        xhr.ontimeout = function() {
          console.error('Server health check timed out');
          setDebugInfo(prev => `${prev}\nTimeout: Request took too long`);
          setServerStatus('offline');
        };
        
        xhr.onerror = function() {
          console.error('Server health check failed with network error');
          setDebugInfo(prev => `${prev}\nNetwork error: Could not connect to server`);
          setServerStatus('offline');
        };
        
        xhr.send();
      } catch (error) {
        console.error('Server health check failed:', error);
        setDebugInfo(prev => `${prev}\nError: ${error.message}`);
        setServerStatus('offline');
      }
    };

    checkServerStatus();
  }, []);

  return (
    <div className="domain-page">
      <div className="domain-header">
        <div className="domain-icon">{icon}</div>
        <h1>{domain}</h1>
      </div>
      <p className="domain-description">{description}</p>

      {serverStatus === 'offline' && (
        <div className="server-status-warning">
          <div className="status-header">
            <WifiOff className="h-5 w-5 mr-2" />
            <span>Server is offline. Please check your connection or try again later.</span>
          </div>
          <div className="debug-info">
            <pre>{debugInfo}</pre>
          </div>
        </div>
      )}

      <div className="query-section">
        <h2>Ask a Query</h2>
        {serverStatus === 'offline' ? (
          <div className="error-message">
            Server is offline. Please check your connection or try again later.
          </div>
        ) : (
          <QueryInterface domain={domain} />
        )}
      </div>
    </div>
  );
};

export default DomainPage; 