// Alpha Vantage API service for real stock data
import { apiConfig, alphaVantageEndpoints } from '../config/apiConfig';

// Rate limiting helper
let lastApiCall = 0;
const minInterval = 12000; // 12 seconds between calls (5 per minute)

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < minInterval) {
    const waitTime = minInterval - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastApiCall = Date.now();
};

// Fetch real-time stock quote
export const fetchStockQuote = async (symbol) => {
  try {
    await waitForRateLimit();
    
    const url = `${apiConfig.baseUrl}?function=${alphaVantageEndpoints.quote}&symbol=${symbol}&apikey=${apiConfig.alphaVantageApiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please wait a moment.');
    }
    
    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No quote data available');
    }
    
    return {
      success: true,
      data: {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        lastUpdated: quote['07. latest trading day']
      }
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Search for stocks
export const searchStocks = async (keywords) => {
  try {
    await waitForRateLimit();
    
    const url = `${apiConfig.baseUrl}?function=${alphaVantageEndpoints.search}&keywords=${keywords}&apikey=${apiConfig.alphaVantageApiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please wait a moment.');
    }
    
    const matches = data['bestMatches'] || [];
    
    return {
      success: true,
      data: matches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore'])
      }))
    };
  } catch (error) {
    console.error('Error searching stocks:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Get company overview
export const fetchCompanyOverview = async (symbol) => {
  try {
    await waitForRateLimit();
    
    const url = `${apiConfig.baseUrl}?function=${alphaVantageEndpoints.overview}&symbol=${symbol}&apikey=${apiConfig.alphaVantageApiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please wait a moment.');
    }
    
    return {
      success: true,
      data: {
        symbol: data['Symbol'],
        name: data['Name'],
        description: data['Description'],
        sector: data['Sector'],
        industry: data['Industry'],
        marketCap: data['MarketCapitalization'],
        peRatio: data['PERatio'],
        dividendYield: data['DividendYield'],
        beta: data['Beta'],
        high52Week: data['52WeekHigh'],
        low52Week: data['52WeekLow'],
        analystTargetPrice: data['AnalystTargetPrice']
      }
    };
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Test API connection
export const testAlphaVantageConnection = async () => {
  try {
    const result = await fetchStockQuote('AAPL');
    if (result.success) {
      console.log('✅ Alpha Vantage API connection successful!');
      return {
        success: true,
        message: 'API connection successful!',
        sampleData: result.data
      };
    } else {
      console.log('❌ Alpha Vantage API connection failed:', result.message);
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    console.log('❌ Alpha Vantage API connection error:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};
