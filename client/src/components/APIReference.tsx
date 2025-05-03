import React from 'react';

const APIReference = () => {
  return (
    <div className="container mx-auto px-4 py-12 prose max-w-none">
      <h1 className="text-4xl font-bold mb-8">📌 API Reference – M.A.D.H.A.V.A.</h1>
      
      {/* Version Information */}
      <section className="mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <p><strong>📢 Version:</strong> v1.0</p>
          <p><strong>📅 Last Updated:</strong> March 2024</p>
          <p><strong>✅ Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://api.madhava.ai/v1</code></p>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🔹 Authentication</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>All API requests require an API Key for authentication.</p>
          <h3 className="text-xl mt-4 mb-2">📢 Header Format:</h3>
          <pre className="bg-gray-100 p-4 rounded-md mt-4 overflow-x-auto">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
          <div className="mt-4">
            <a href="#" className="text-blue-500 hover:underline">📢 Get API Key: Register Here</a>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">🔹 Endpoints</h2>
        
        {/* Real-Time Data Retrieval */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">1️⃣ Real-Time Data Retrieval</h3>
          <h4 className="text-lg font-medium mb-2">🔹 Fetch Latest Data</h4>
          <p><strong>📍 Endpoint:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 mb-4 overflow-x-auto">
            <code>GET /data/latest</code>
          </pre>
          
          <p><strong>📍 Query Parameters:</strong></p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">Parameter</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Required</th>
                  <th className="px-4 py-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">domain</td>
                  <td className="px-4 py-2 border">string</td>
                  <td className="px-4 py-2 border">✅</td>
                  <td className="px-4 py-2 border">Specify the industry (finance, healthcare, legal)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">limit</td>
                  <td className="px-4 py-2 border">integer</td>
                  <td className="px-4 py-2 border">❌</td>
                  <td className="px-4 py-2 border">Number of records (default: 10)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4"><strong>📍 Example Request:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "https://api.madhava.ai/v1/data/latest?domain=finance&limit=5"`}</code>
          </pre>

          <p className="mt-4"><strong>📍 Response:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`{
  "status": "success",
  "data": [
    {
      "id": "12345",
      "timestamp": "2025-03-10T14:00:00Z",
      "content": "Latest market trends indicate..."
    }
  ]
}`}</code>
          </pre>
        </div>

        {/* AI-Powered Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">2️⃣ AI-Powered Search (Vector Search)</h3>
          <h4 className="text-lg font-medium mb-2">🔹 Semantic Query Processing</h4>
          <p><strong>📍 Endpoint:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 mb-4 overflow-x-auto">
            <code>POST /search</code>
          </pre>

          <p><strong>📍 Body Parameters:</strong></p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">Parameter</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Required</th>
                  <th className="px-4 py-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">query</td>
                  <td className="px-4 py-2 border">string</td>
                  <td className="px-4 py-2 border">✅</td>
                  <td className="px-4 py-2 border">The search term or question</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">domain</td>
                  <td className="px-4 py-2 border">string</td>
                  <td className="px-4 py-2 border">✅</td>
                  <td className="px-4 py-2 border">Context domain (finance, healthcare, etc.)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4"><strong>📍 Example Request:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`{
  "query": "What are the latest stock market trends?",
  "domain": "finance"
}`}</code>
          </pre>

          <p className="mt-4"><strong>📍 Response:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`{
  "status": "success",
  "results": [
    {
      "title": "Stock Market Update",
      "summary": "The market is experiencing...",
      "source": "trusted_source.com"
    }
  ]
}`}</code>
          </pre>
        </div>

        {/* Data Verification */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">3️⃣ Data Verification (Cross-Check APIs)</h3>
          <h4 className="text-lg font-medium mb-2">🔹 Validate Information from External Sources</h4>
          <p><strong>📍 Endpoint:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 mb-4 overflow-x-auto">
            <code>GET /verify</code>
          </pre>

          <p><strong>📍 Query Parameters:</strong></p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">Parameter</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Required</th>
                  <th className="px-4 py-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">data_id</td>
                  <td className="px-4 py-2 border">string</td>
                  <td className="px-4 py-2 border">✅</td>
                  <td className="px-4 py-2 border">ID of the data to verify</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4"><strong>📍 Example Request:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     "https://api.madhava.ai/v1/verify?data_id=12345"`}</code>
          </pre>

          <p className="mt-4"><strong>📍 Response:</strong></p>
          <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
            <code>{`{
  "status": "verified",
  "confidence_score": 98.7,
  "source": "Official Data Registry"
}`}</code>
          </pre>
        </div>
      </section>

      {/* Rate Limits & Pricing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🔹 Rate Limits & Pricing</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <ul className="list-none pl-0">
            <li className="mb-2">📢 Free Plan: 100 requests/day</li>
            <li className="mb-2">📢 Pro Plan: 10,000 requests/month</li>
            <li>📢 Enterprise: Custom</li>
          </ul>
        </div>
      </section>

      {/* Error Handling */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🔹 Error Handling</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl mb-4">📢 Common Errors & Responses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border">Error Code</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">401</td>
                  <td className="px-4 py-2 border">Unauthorized</td>
                  <td className="px-4 py-2 border">Invalid API Key</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">404</td>
                  <td className="px-4 py-2 border">Not Found</td>
                  <td className="px-4 py-2 border">Data not available</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">429</td>
                  <td className="px-4 py-2 border">Rate Limit Exceeded</td>
                  <td className="px-4 py-2 border">Too many requests</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🔹 Contact & Support</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-2">
            <span>📩</span>
            <a href="mailto:support@madhava.ai" className="text-blue-500 hover:underline">
              support@madhava.ai
            </a>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <span>📞</span>
            <a href="tel:+12345678900" className="text-blue-500 hover:underline">
              +1 234-567-8900
            </a>
          </div>
          <a 
            href="#" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
          >
            🔹 Start Building Today! → Get API Key 🚀
          </a>
        </div>
      </section>
    </div>
  );
};

export default APIReference; 