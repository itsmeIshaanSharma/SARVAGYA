# MADHAVA - Domain-Specific AI Assistant

MADHAVA is a domain-specific AI assistant that uses Google's Gemini 1.5 Pro model to provide specialized responses across different domains.

## Features

- Modern dark theme UI
- Domain-specific AI responses
- Real-time metrics (response time, token count)
- Error handling and offline detection

## Project Structure

```
├── backend/
│   ├── gemini.js         # Gemini API integration
│   ├── server.js         # Express server
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── ...
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Troubleshooting

### "Failed to fetch" Error

If you see a "Failed to fetch" error, check the following:

1. Make sure the backend server is running
2. Verify that your GEMINI_API_KEY is valid
3. Check that the VITE_API_URL in the client .env file matches your backend server address
4. Ensure there are no CORS issues (the backend should allow requests from your frontend origin)

### API Key Issues

If you're having issues with the Gemini API key:

1. Make sure you've created a valid API key in the Google AI Studio
2. Check that the key is correctly set in the backend .env file
3. Restart the backend server after updating the API key

## License

MIT License

Copyright (c) 2025 Drago

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
