import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get API key from environment or use default
const EXCHANGERATE_API_KEY = process.env.EXCHANGERATE_API_KEY || 'your_default_key';

/**
 * Get latest exchange rates for a base currency
 * @param {string} baseCurrency - Base currency code (e.g., 'USD', 'EUR')
 * @returns {Promise<Object>} Exchange rates for all available currencies
 */
async function getExchangeRates(baseCurrency = 'USD') {
    try {
        // Fixed API endpoint URL - using the correct domain
        const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}?api_key=${EXCHANGERATE_API_KEY}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.rates) {
            return {
                base: response.data.base,
                date: response.data.date || new Date().toISOString().split('T')[0],
                rates: response.data.rates
            };
        }
        throw new Error('Failed to fetch exchange rates');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        
        // Fallback to a secondary API if the primary one fails
        try {
            const fallbackUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;
            const fallbackResponse = await axios.get(fallbackUrl);
            
            if (fallbackResponse.data && fallbackResponse.data.rates) {
                console.log('Using fallback exchange rate API');
                return {
                    base: fallbackResponse.data.base_code,
                    date: fallbackResponse.data.time_last_update_utc.split(' ').slice(0, 4).join(' '),
                    rates: fallbackResponse.data.rates
                };
            }
        } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
        }
        
        throw new Error(`Failed to fetch exchange rates: ${error.message}`);
    }
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<Object>} Conversion result
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const rates = await getExchangeRates(fromCurrency);
        
        if (!rates.rates[toCurrency]) {
            throw new Error(`Target currency ${toCurrency} not found`);
        }
        
        const convertedAmount = amount * rates.rates[toCurrency];
        
        return {
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            convertedAmount: convertedAmount,
            rate: rates.rates[toCurrency],
            date: rates.date
        };
    } catch (error) {
        console.error('Error converting currency:', error);
        throw new Error(`Failed to convert currency: ${error.message}`);
    }
}

/**
 * Get the latest USD to INR exchange rate
 * @returns {Promise<Object>} USD to INR exchange rate information
 */
async function getUsdToInrRate() {
    try {
        const rates = await getExchangeRates('USD');
        const inrRate = rates.rates['INR'];
        
        return {
            from: 'USD',
            to: 'INR',
            rate: inrRate,
            date: rates.date,
            example: {
                amount: 50,
                converted: 50 * inrRate
            }
        };
    } catch (error) {
        console.error('Error getting USD to INR rate:', error);
        
        // Provide a reasonable fallback based on recent rates
        return {
            from: 'USD',
            to: 'INR',
            rate: 84.57, // Current rate as of the latest data
            date: new Date().toISOString().split('T')[0],
            example: {
                amount: 50,
                converted: 50 * 84.57
            },
            note: 'Using fallback rate due to API error'
        };
    }
}

/**
 * Extract currency codes from text
 * @param {string} text - Text to extract currency codes from
 * @returns {string[]} Array of currency codes
 */
function extractCurrencyCodes(text) {
    const currencyCodes = [];
    
    // Common currency codes
    const commonCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
    
    // Check for currency codes in text
    commonCodes.forEach(code => {
        if (text.includes(code)) {
            currencyCodes.push(code);
        }
    });
    
    // Check for currency symbols and map to codes
    const symbolMap = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        '₹': 'INR',
        '₽': 'RUB',
        '₩': 'KRW'
    };
    
    Object.entries(symbolMap).forEach(([symbol, code]) => {
        if (text.includes(symbol) && !currencyCodes.includes(code)) {
            currencyCodes.push(code);
        }
    });
    
    return [...new Set(currencyCodes)];
}

export { getExchangeRates, convertCurrency, extractCurrencyCodes, getUsdToInrRate };