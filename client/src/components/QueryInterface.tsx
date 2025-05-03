import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import './QueryInterface.css';

interface QueryInterfaceProps {
  user: any;
  setShowLoginPrompt: (show: boolean) => void;
  domain: string;
}

interface QueryResponse {
  answer: string;
  metrics?: {
    responseTime: string;
    tokenCount: string;
  };
}

export function QueryInterface({ user, setShowLoginPrompt, domain }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: query.trim(),
          domain: domain,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse({
        answer: data.response,
        metrics: {
          responseTime: data.metrics?.responseTime || 'N/A',
          tokenCount: data.metrics?.tokenCount || 'N/A'
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-interface">
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
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="ml-2">{loading ? 'Processing...' : 'Ask'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {response && (
        <div className="response-section">
          <div className="answer">
            <h3>Answer:</h3>
            <p>{response.answer}</p>
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
}