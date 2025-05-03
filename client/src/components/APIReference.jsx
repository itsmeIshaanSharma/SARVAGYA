import React from 'react';
import './APIReference.css';

const APIReference = () => {
  return (
    <div className="api-reference">
      <div className="api-content">
        {/* Version and Base URL */}
        <div className="api-header">
          <h1>M.A.D.H.A.V.A API Reference</h1>
          <div className="api-version-info">
            Version: v1.0 | Base URL: https://api.madhava.ai/v1
          </div>
        </div>

        {/* Authentication Section */}
        <section className="api-section">
          <h2>Authentication</h2>
          <div className="auth-section">
            <p>Use an API Key for access:</p>
            <code className="auth-code">Authorization: Bearer YOUR_API_KEY</code>
            <div className="mt-4">
              <a href="#" className="cta-button">Get API Key</a>
            </div>
          </div>
        </section>

        {/* Endpoints Section */}
        <section className="api-section">
          <h2>Endpoints</h2>

          {/* 1. Fetch Latest Data */}
          <div className="endpoint-section">
            <h3>1. Fetch Latest Data</h3>
            <div className="endpoint">
              <span className="http-method get">GET</span>
              /data/latest
            </div>

            <table className="api-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>domain</td>
                  <td>string</td>
                  <td><span className="required-badge">✅</span></td>
                  <td>Industry (finance, healthcare, etc.)</td>
                </tr>
                <tr>
                  <td>limit</td>
                  <td>integer</td>
                  <td><span className="optional-badge">❌</span></td>
                  <td>Number of records (default: 10)</td>
                </tr>
              </tbody>
            </table>

            <h4>Example:</h4>
            <div className="curl-example">
              curl -H "Authorization: Bearer YOUR_API_KEY" \
                   "https://api.madhava.ai/v1/data/latest?domain=finance&limit=5"
            </div>
          </div>

          {/* 2. AI-Powered Search */}
          <div className="endpoint-section">
            <h3>2. AI-Powered Search</h3>
            <div className="endpoint">
              <span className="http-method post">POST</span>
              /search
            </div>

            <table className="api-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>query</td>
                  <td>string</td>
                  <td><span className="required-badge">✅</span></td>
                  <td>Search term/question</td>
                </tr>
                <tr>
                  <td>domain</td>
                  <td>string</td>
                  <td><span className="required-badge">✅</span></td>
                  <td>Context domain</td>
                </tr>
              </tbody>
            </table>

            <h4>Example:</h4>
            <div className="json-example">
              {`{
  "query": "Latest stock trends",
  "domain": "finance"
}`}
            </div>
          </div>

          {/* 3. Data Verification */}
          <div className="endpoint-section">
            <h3>3. Data Verification</h3>
            <div className="endpoint">
              <span className="http-method get">GET</span>
              /verify
            </div>

            <table className="api-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>data_id</td>
                  <td>string</td>
                  <td><span className="required-badge">✅</span></td>
                  <td>ID to verify</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limits & Errors */}
        <section className="api-section">
          <h2>Rate Limits & Errors</h2>
          <div className="rate-limits">
            <div className="plan-info">
              <p>Free Plan: 100 requests/day</p>
              <p>Pro: 10,000 requests/month</p>
            </div>
          </div>
          <div className="errors-list">
            <span className="error-code">401 Unauthorized</span>
            <span className="error-code">404 Not Found</span>
            <span className="error-code">429 Rate Limit Exceeded</span>
          </div>
        </section>

        {/* Contact & Support */}
        <section className="contact-section">
          <h2>Contact & Support</h2>
          <div className="contact-info">
            <span className="contact-item">
              <span className="emoji-icon">📩</span>
              Email: support@madhava.ai
            </span>
            <span className="contact-item">
              <span className="emoji-icon">📞</span>
              Phone: +1 234-567-8900
            </span>
          </div>
          <div className="mt-6">
            <a href="#" className="cta-button">
              🔹 Start Using the API! → Get API Key 🚀
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default APIReference; 