import React, { useState } from 'react';
import { testAlphaVantageConnection, searchStocks } from '../services/alphaVantageApi';

const AlphaVantageTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const connectionResult = await testAlphaVantageConnection();
      setResult(connectionResult);
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      const results = await searchStocks(searchQuery);
      if (results.success) {
        setSearchResults(results.data.slice(0, 5)); // Show top 5 results
      } else {
        setResult({
          success: false,
          message: results.message
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Search error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Alpha Vantage API Test</h2>
      
      <div className="space-y-6">
        {/* Connection Test */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test API Connection</h3>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>

        {/* Search Test */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Search Stocks</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter stock symbol or company name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                isLoading || !searchQuery.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-4 rounded-lg ${
            result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? '✅ Success!' : '❌ Failed'}
            </h3>
            <p className="mb-2">{result.message}</p>
            {result.sampleData && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-sm font-mono text-gray-800">
                  Sample Data: {result.sampleData.symbol} - ${result.sampleData.price}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Search Results:</h3>
            <div className="space-y-2">
              {searchResults.map((stock, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-semibold text-gray-900">{stock.symbol}</span>
                    <span className="text-gray-600 ml-2">{stock.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stock.region} • {stock.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Get your free API key from <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="underline">Alpha Vantage</a></li>
            <li>2. Create a .env file in your project root</li>
            <li>3. Add: REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key</li>
            <li>4. Restart your development server</li>
            <li>5. Test the connection above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AlphaVantageTest;
