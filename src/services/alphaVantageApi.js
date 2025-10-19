// Alpha Vantage API service
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'OMDGFKYM8QZJQZJQ'; // Fallback key
const BASE_URL = 'https://www.alphavantage.co/query';

// Rate limiting: Alpha Vantage free tier allows 5 calls per minute
let lastCallTime = 0;
const MIN_INTERVAL = 12000; // 12 seconds between calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeApiCall = async (params) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  
  if (timeSinceLastCall < MIN_INTERVAL) {
    const waitTime = MIN_INTERVAL - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
    await delay(waitTime);
  }
  
  lastCallTime = Date.now();
  
  const url = new URL(BASE_URL);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Check for API error messages
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    if (data['Note']) {
      throw new Error(data['Note']);
    }
    
    return data;
  } catch (error) {
    console.error('Alpha Vantage API Error:', error);
    throw error;
  }
};

// Get real-time stock quote
export const fetchStockQuote = async (symbol) => {
  const params = {
    function: 'GLOBAL_QUOTE',
    symbol: symbol,
    apikey: API_KEY
  };
  
  try {
    const data = await makeApiCall(params);
    const quote = data['Global Quote'];
    
    if (!quote || !quote['01. symbol']) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }
    
    return {
      symbol: quote['01. symbol'],
      name: symbol, // Alpha Vantage doesn't provide company name in this endpoint
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close'])
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

// Search for stocks
export const searchStocks = async (keywords) => {
  const params = {
    function: 'SYMBOL_SEARCH',
    keywords: keywords,
    apikey: API_KEY
  };
  
  try {
    const data = await makeApiCall(params);
    const matches = data.bestMatches || [];
    
    return matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
      matchScore: parseFloat(match['9. matchScore'])
    }));
  } catch (error) {
    console.error(`Error searching stocks for "${keywords}":`, error);
    throw error;
  }
};

// Get multiple stock quotes (with rate limiting)
export const fetchMultipleStockQuotes = async (symbols) => {
  const results = [];
  
  for (let i = 0; i < symbols.length; i++) {
    try {
      const quote = await fetchStockQuote(symbols[i]);
      results.push(quote);
    } catch (error) {
      console.error(`Failed to fetch ${symbols[i]}:`, error);
      // Continue with other stocks even if one fails
    }
  }
  
  return results;
};

// Get company overview
export const fetchCompanyOverview = async (symbol) => {
  const params = {
    function: 'OVERVIEW',
    symbol: symbol,
    apikey: API_KEY
  };
  
  try {
    const data = await makeApiCall(params);
    
    if (!data.Symbol) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }
    
    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: data.MarketCapitalization,
      peRatio: data.PERatio,
      dividendYield: data.DividendYield,
      eps: data.EPS,
      beta: data.Beta,
      high52Week: data['52WeekHigh'],
      low52Week: data['52WeekLow']
    };
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    throw error;
  }
};

export default {
  fetchStockQuote,
  searchStocks,
  fetchMultipleStockQuotes,
  fetchCompanyOverview
};
