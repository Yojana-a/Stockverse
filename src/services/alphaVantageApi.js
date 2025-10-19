// Alpha Vantage API service for real stock data
import { apiConfig, alphaVantageEndpoints } from '../config/apiConfig';

// Rate limiting helper with queue system
let lastApiCall = 0;
const minInterval = 12000; // 12 seconds between calls (5 per minute)
let apiCallQueue = [];
let isProcessingQueue = false;

// Enhanced rate limiting with queue system
const waitForRateLimit = async () => {
  return new Promise((resolve) => {
    apiCallQueue.push(resolve);
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessingQueue || apiCallQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (apiCallQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCall;
    
    if (timeSinceLastCall < minInterval) {
      const waitTime = minInterval - timeSinceLastCall;
      console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastApiCall = Date.now();
    const resolve = apiCallQueue.shift();
    resolve();
  }
  
  isProcessingQueue = false; 
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
    return handleApiError(error, 'fetchStockQuote');
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
    return handleApiError(error, 'searchStocks');
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
    return handleApiError(error, 'fetchCompanyOverview');
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

// Fetch multiple stock quotes efficiently
export const fetchMultipleStockQuotes = async (symbols) => {
  const results = [];
  
  for (const symbol of symbols) {
    try {
      const result = await fetchStockQuote(symbol);
      results.push({
        symbol,
        ...result
      });
    } catch (error) {
      results.push({
        symbol,
        success: false,
        message: error.message
      });
    }
  }
  
  return results;
};

// Get daily time series data
export const fetchDailyTimeSeries = async (symbol, outputsize = 'compact') => {
  try {
    await waitForRateLimit();
    
    const url = `${apiConfig.baseUrl}?function=${alphaVantageEndpoints.daily}&symbol=${symbol}&outputsize=${outputsize}&apikey=${apiConfig.alphaVantageApiKey}`;
    
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
    
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No time series data available');
    }
    
    // Convert to array format for easier use
    const timeSeriesArray = Object.entries(timeSeries).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      success: true,
      data: {
        symbol: data['Meta Data']['2. Symbol'],
        lastRefreshed: data['Meta Data']['3. Last Refreshed'],
        timeSeries: timeSeriesArray
      }
    };
  } catch (error) {
    console.error('Error fetching daily time series:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Get intraday time series data
export const fetchIntradayTimeSeries = async (symbol, interval = '5min', outputsize = 'compact') => {
  try {
    await waitForRateLimit();
    
    const url = `${apiConfig.baseUrl}?function=${alphaVantageEndpoints.timeSeries}&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apiConfig.alphaVantageApiKey}`;
    
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
    
    const timeSeries = data[`Time Series (${interval})`];
    if (!timeSeries) {
      throw new Error('No intraday time series data available');
    }
    
    // Convert to array format for easier use
    const timeSeriesArray = Object.entries(timeSeries).map(([datetime, values]) => ({
      datetime,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    
    return {
      success: true,
      data: {
        symbol: data['Meta Data']['2. Symbol'],
        lastRefreshed: data['Meta Data']['3. Last Refreshed'],
        interval: data['Meta Data']['4. Interval'],
        timeSeries: timeSeriesArray
      }
    };
  } catch (error) {
    console.error('Error fetching intraday time series:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Enhanced error handling utility
export const handleApiError = (error, context = 'API call') => {
  console.error(`Error in ${context}:`, error);
  
  if (error.message.includes('rate limit')) {
    return {
      success: false,
      message: 'API rate limit exceeded. Please wait a moment before trying again.',
      retryAfter: 12000 // 12 seconds
    };
  }
  
  if (error.message.includes('Invalid API call')) {
    return {
      success: false,
      message: 'Invalid API call. Please check your API key and try again.',
      needsApiKey: true
    };
  }
  
  if (error.message.includes('Thank you for using Alpha Vantage')) {
    return {
      success: false,
      message: 'API call limit reached. Please wait before making more requests.',
      retryAfter: 60000 // 1 minute
    };
  }
  
  return {
    success: false,
    message: error.message || 'An unexpected error occurred'
  };
};

// Get API status and remaining calls
export const getApiStatus = () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  const timeUntilNextCall = Math.max(0, minInterval - timeSinceLastCall);
  
  return {
    queueLength: apiCallQueue.length,
    timeUntilNextCall,
    canMakeCall: timeSinceLastCall >= minInterval,
    isProcessing: isProcessingQueue
  };
};
