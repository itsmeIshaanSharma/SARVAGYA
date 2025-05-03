import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import runChat from './gemini.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://madhava-client.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, domain } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Processing request for domain: ${domain || 'general'}`);

    // Add domain context to the prompt if provided
    const enhancedPrompt = domain 
      ? `[Context: You are an AI assistant specialized in ${domain}]\n\n${prompt}`
      : prompt;

    const startTime = Date.now();
    const response = await runChat(enhancedPrompt, domain);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`Request processed in ${responseTime}ms`);

    res.json({
      response,
      metrics: {
        responseTime: `${responseTime}ms`,
        tokenCount: Math.round(response.length / 4) // This is a rough approximation
      }
    });
  } catch (error) {
    console.error('Error processing Gemini request:', error);
    res.status(500).json({ error: 'Failed to process request', message: error.message });
  }
});

// Root path handler
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'MADHAVA API is running', 
    endpoints: {
      health: '/health',
      gemini: '/api/gemini'
    }
  });
});

// Start the server
// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API endpoint: http://localhost:${port}/api/gemini`);
  });
}

// Export the Express API for Vercel
export default app;