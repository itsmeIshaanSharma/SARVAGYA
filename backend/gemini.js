import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from 'dotenv';
import { extractStockSymbols, getMultipleStockPrices } from './stockService.js';
import { searchNews, extractNewsTopics } from './newsService.js';
// Add this import
import { extractCurrencyCodes, convertCurrency } from './currencyService.js';

// Load environment variables
dotenv.config();

// Access API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDwjoAuxneLyup9X9q1Wb8B3UpvG3_izik';
const MODEL_NAME = "gemini-2.0-flash";

// Check if API key is available
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set in environment variables");
}

console.log("Initializing Gemini with API key:", API_KEY ? "API key is set" : "API key is missing");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.75,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Helper function to wait for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to extract retry delay from error message
const extractRetryDelay = (errorMessage) => {
  try {
    const retryDelayMatch = errorMessage.match(/"retryDelay":"(\d+)s"/i);
    if (retryDelayMatch && retryDelayMatch[1]) {
      return parseInt(retryDelayMatch[1]) * 1000; // Convert seconds to milliseconds
    }
    return 5000; // Default 5 seconds if no match
  } catch (e) {
    console.error('Error parsing retry delay:', e);
    return 5000; // Default 5 seconds
  }
};

async function runChat(prompt, domain = '') {
  let retries = 3; // Maximum number of retries
  let lastError = null;
  
  while (retries > 0) {
    try {
      console.log(`Processing prompt: "${prompt.substring(0, 50)}..."`);
      
      let enhancedPrompt = prompt;
      let stockData = null;
      let newsData = null;

      // If domain is finance, check for stock symbols and fetch real-time data
      // In the runChat function, modify the finance domain handling
      if (domain === 'finance') {
          // Extract stock symbols and currency codes
          const symbols = extractStockSymbols(prompt);
          const currencyCodes = extractCurrencyCodes(prompt);
          
          try {
              // Get stock data
              if (symbols.length > 0) {
                  stockData = await getMultipleStockPrices(symbols);
                  const stockInfo = stockData.map(stock =>
                      `${stock.symbol}: $${stock.price} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%) - ${stock.companyName}`
                  ).join('\n');
                  
                  enhancedPrompt = `${prompt}\n\nCurrent stock information:\n${stockInfo}`;
              }
              
              // Get currency conversion data if there are at least 2 currencies
              if (currencyCodes.length >= 2) {
                  const baseCurrency = currencyCodes[0];
                  const targetCurrencies = currencyCodes.slice(1);
                  
                  const conversionPromises = targetCurrencies.map(targetCurrency => 
                      convertCurrency(1, baseCurrency, targetCurrency)
                  );
                  
                  const conversions = await Promise.all(conversionPromises);
                  const conversionInfo = conversions.map(conv => 
                      `1 ${conv.from} = ${conv.convertedAmount.toFixed(4)} ${conv.to} (as of ${conv.date})`
                  ).join('\n');
                  
                  enhancedPrompt += `\n\nCurrent currency conversion rates:\n${conversionInfo}`;
              }
              
              enhancedPrompt += `\n\nPlease incorporate this real-time financial data into your response.`;
          } catch (error) {
              console.error('Error fetching financial data:', error);
              // Continue with original prompt if financial data fetch fails
          }
      }
      
      // If domain is news, extract topics and fetch relevant news articles using NewsData.io
      if (domain === 'news') {
        // Extract key terms from the prompt
        const topics = extractNewsTopics(prompt);
        const keywordsInPrompt = topics.length > 0 ? topics.join(' ') : '';
        
        try {
          // Extract main query from the prompt - use the full prompt for better context
          const query = keywordsInPrompt || prompt;
          console.log(`Searching for news with query: "${query}"`);
          
          // Fetch news articles related to the query using NewsData.io
          newsData = await searchNews({ 
            query, 
            pageSize: 5,
            sortBy: 'relevancy'
          });
          
          if (newsData && newsData.articles && newsData.articles.length > 0) {
            console.log(`Found ${newsData.articles.length} news articles to include in prompt`);
            
            // Format news articles with more detail
            const newsArticles = newsData.articles.map((article, index) => {
              const pubDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
              });
              
              return `${index + 1}. ${article.title}
   Source: ${article.source.name}
   Date: ${pubDate}
   Summary: ${article.description || 'No description available.'}
   URL: ${article.url}`;
            }).join('\n\n');
            
            // Create a more directive prompt for Gemini
            enhancedPrompt = `${prompt}\n\n### LATEST NEWS ARTICLES (CURRENT AS OF ${new Date().toLocaleDateString()}):\n${newsArticles}\n\n### IMPORTANT INSTRUCTIONS:
1. Use the above real-time news data to directly address the user's query.
2. Include specific facts, figures and quotes from these sources.
3. Cite the source name when referencing information from the articles.
4. DO NOT state that you don't have current information - the articles above provide you with up-to-date information.
5. If the articles address the query, use that information in your response.`;
          } else {
            console.log('No news articles found, proceeding with original prompt');
          }
        } catch (error) {
          console.error('Error fetching news data:', error);
          // Continue with original prompt if news data fetch fails
        }
      }
      
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const result = await chat.sendMessage(enhancedPrompt);
      const response = result.response;
      const responseText = response.text();
      
      console.log(`Generated response of length: ${responseText.length} characters`);
      
      return responseText;
    } catch (error) {
      console.error(`Error in Gemini API call (${retries} retries left):`, error);
      lastError = error;
      
      // Check if it's a rate limit error (429)
      if (error.message && error.message.includes('429 Too Many Requests')) {
        const retryDelay = extractRetryDelay(error.message);
        console.log(`Rate limit exceeded. Waiting ${retryDelay/1000} seconds before retrying...`);
        await sleep(retryDelay);
        retries--;
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }
  
  // If we've exhausted retries or encountered a non-rate-limit error
  throw new Error(`Gemini API error: ${lastError.message}`);
}

export default runChat;
