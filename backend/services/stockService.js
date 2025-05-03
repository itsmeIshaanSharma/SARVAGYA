import yahooFinance from 'yahoo-finance2';

// Map of common indices to their Yahoo Finance symbols
const INDEX_MAP = {
    'NIFTY50': '^NSEI',
    'NIFTY': '^NSEI',
    'SENSEX': '^BSESN',
    'S&P500': '^GSPC',
    'DOW': '^DJI',
    'NASDAQ': '^IXIC',
    'FTSE': '^FTSE'
};

// Common words that might be mistaken for stock symbols
const COMMON_WORDS = new Set([
    'A', 'I', 'IT', 'AT', 'BE', 'DO', 'GO', 'IN', 'IS', 'ON', 'TO', 'UP', 'THE',
    'AI', // Exclude standalone "AI" as it's commonly used for Artificial Intelligence
    'AM', 'PM', 'CEO', 'CFO', 'CTO', 'COO', 'API', 'USA', 'UK', 'EU'
]);

/**
 * Get real-time stock price and basic information for a given symbol
 * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'GOOGL') or index name
 * @returns {Promise<Object>} Stock information including price, change, and company name
 */
async function getStockPrice(symbol) {
    try {
        // Check if it's a known index and map to its Yahoo Finance symbol
        const yahooSymbol = INDEX_MAP[symbol.toUpperCase()] || symbol;
        
        // Get quote data
        const quote = await yahooFinance.quote(yahooSymbol);
        
        return {
            symbol: symbol,
            companyName: quote.longName || quote.shortName || symbol,
            price: quote.regularMarketPrice,
            currency: quote.currency,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            marketTime: new Date(quote.regularMarketTime * 1000).toISOString(),
            marketOpen: quote.regularMarketOpen,
            marketHigh: quote.regularMarketDayHigh,
            marketLow: quote.regularMarketDayLow,
            volume: quote.regularMarketVolume
        };
    } catch (error) {
        console.error(`Error fetching stock/index data for ${symbol}:`, error);
        throw new Error(`Failed to fetch data for ${symbol}`);
    }
}

/**
 * Extract stock symbols and index names from text
 * @param {string} text - Text to extract stock symbols from
 * @returns {string[]} Array of stock symbols and index names
 */
function extractStockSymbols(text) {
    const symbols = [];
    
    // Check for known indices first
    for (const [index, ] of Object.entries(INDEX_MAP)) {
        const indexRegex = new RegExp(`\\b${index}\\b`, 'i');
        if (indexRegex.test(text)) {
            symbols.push(index);
        }
    }

    // Match stock symbols with specific patterns
    const patterns = [
        // Match stock symbols with $ prefix
        /\$([A-Z]{1,5})\b/g,
        // Match "ticker: X" or "ticker symbol: X" patterns
        /(?:ticker|symbol):\s*([A-Z]{1,5})\b/gi,
        // Match stock names in parentheses (NYSE: XXX) or (NASDAQ: XXX)
        /\((?:NYSE|NASDAQ):\s*([A-Z]{1,5})\)/g,
        // Match C3.ai (AI) specific pattern
        /C3\.ai\s*\(([A-Z]{1,5})\)/g,
        // Match company name followed by ticker in parentheses
        /[A-Za-z0-9\s.]+\(([A-Z]{1,5})\)/g
    ];

    // Process each pattern
    for (const pattern of patterns) {
        const matches = [...text.matchAll(pattern)];
        for (const match of matches) {
            const symbol = match[1]; // Get the captured group
            if (!COMMON_WORDS.has(symbol)) {
                symbols.push(symbol);
            }
        }
    }

    return [...new Set(symbols)];
}

/**
 * Get stock/index information for multiple symbols
 * @param {string[]} symbols - Array of stock symbols or index names
 * @returns {Promise<Object[]>} Array of stock/index information objects
 */
async function getMultipleStockPrices(symbols) {
    try {
        const uniqueSymbols = [...new Set(symbols)];
        const promises = uniqueSymbols.map(symbol => getStockPrice(symbol));
        return await Promise.all(promises);
    } catch (error) {
        console.error('Error fetching multiple stock/index prices:', error);
        throw new Error('Failed to fetch multiple stock/index prices');
    }
}

export { getStockPrice, extractStockSymbols, getMultipleStockPrices }; 