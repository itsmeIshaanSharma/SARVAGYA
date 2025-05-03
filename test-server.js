// Simple script to test server connectivity
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001/health';

async function testServer() {
  try {
    console.log(`Testing server at ${API_URL}...`);
    const response = await fetch(API_URL);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Server is accessible!');
      console.log('Response:', data);
    } else {
      console.error(`Server returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error connecting to server:', error.message);
  }
}

testServer(); 