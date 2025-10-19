// API Configuration
export const API_CONFIG = {
  ALPHA_VANTAGE: {
    BASE_URL: 'https://www.alphavantage.co/query',
    RATE_LIMIT: {
      CALLS_PER_MINUTE: 5,
      MIN_INTERVAL_MS: 12000 // 12 seconds between calls
    },
    ENDPOINTS: {
      GLOBAL_QUOTE: 'GLOBAL_QUOTE',
      SYMBOL_SEARCH: 'SYMBOL_SEARCH',
      OVERVIEW: 'OVERVIEW',
      TIME_SERIES_DAILY: 'TIME_SERIES_DAILY'
    }
  }
};

// Default stock symbols to track
export const DEFAULT_STOCKS = [
  'AAPL', // Apple
  'TSLA', // Tesla
  'GOOGL', // Google
  'MSFT', // Microsoft
  'AMZN', // Amazon
  'META'  // Meta
];

// Company names mapping
export const COMPANY_NAMES = {
  'AAPL': 'Apple Inc.',
  'TSLA': 'Tesla Inc.',
  'GOOGL': 'Alphabet Inc.',
  'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com Inc.',
  'META': 'Meta Platforms Inc.'
};
