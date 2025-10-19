// Alpha Vantage API Configuration
// Copy this to .env file in your project root

export const apiConfig = {
  alphaVantageApiKey: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'your_api_key_here',
  baseUrl: 'https://www.alphavantage.co/query',
  rateLimit: 5, // 5 calls per minute on free tier
  timeout: 10000 // 10 seconds timeout
};

// Instructions for setting up .env file:
// 1. Create a file named .env in your project root
// 2. Add the following line:
//    REACT_APP_ALPHA_VANTAGE_API_KEY=your_actual_api_key
// 3. Get your free API key from: https://www.alphavantage.co/support/#api-key
// 4. Restart your development server after making changes

// Alpha Vantage API endpoints:
export const alphaVantageEndpoints = {
  quote: 'GLOBAL_QUOTE',
  search: 'SYMBOL_SEARCH',
  overview: 'OVERVIEW',
  timeSeries: 'TIME_SERIES_INTRADAY',
  daily: 'TIME_SERIES_DAILY'
};
