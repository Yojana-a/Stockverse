import React, { useState } from 'react';
import { fetchStockQuote, fetchMultipleStockQuotes } from '../services/alphaVantageApi';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  
  // Debug API key
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
  console.log('API Key value:', apiKey);

  const testSingleStock = async () => {
    setIsLoading(true);
    setTestResult('Testing single stock...');
    
    try {
      const result = await fetchStockQuote(selectedStock);
      setTestResult(`✅ Success!\n${selectedStock}: $${result.price} (${result.change >= 0 ? '+' : ''}${result.changePercent}%)`);
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testMultipleStocks = async () => {
    setIsLoading(true);
    setTestResult('Testing multiple stocks...');
    
    try {
      const results = await fetchMultipleStockQuotes(['AAPL', 'TSLA', 'GOOGL']);
      const resultText = results.map(stock => 
        `${stock.symbol}: $${stock.price} (${stock.change >= 0 ? '+' : ''}${stock.changePercent}%)`
      ).join('\n');
      setTestResult(`✅ Success!\n${resultText}`);
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/30">
      <h3 className="text-xl font-bold text-[#F7E7CE] mb-4">Alpha Vantage API Test</h3>
      
      <div className="mb-4 p-3 bg-black bg-opacity-20 rounded-lg">
        <p className="text-[#F7E7CE] text-sm">
          <strong>API Key Status:</strong> {apiKey ? 
            <span className="text-green-400">✅ Loaded ({apiKey.substring(0, 8)}...)</span> : 
            <span className="text-red-400">❌ Not found</span>
          }
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#F7E7CE] mb-2">
            Select Stock:
          </label>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-5 border border-[#D4AF37]/30 rounded-lg text-[#F7E7CE] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="AAPL">Apple (AAPL)</option>
            <option value="TSLA">Tesla (TSLA)</option>
            <option value="GOOGL">Google (GOOGL)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
            <option value="AMZN">Amazon (AMZN)</option>
            <option value="META">Meta (META)</option>
          </select>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={testSingleStock}
            disabled={isLoading}
            className="px-4 py-2 bg-[#D4AF37] text-[#2B0A28] rounded-lg font-semibold hover:bg-[#F7E7CE] transition-colors disabled:opacity-50"
          >
            Test Single Stock
          </button>
          
          <button
            onClick={testMultipleStocks}
            disabled={isLoading}
            className="px-4 py-2 bg-[#D4AF37] text-[#2B0A28] rounded-lg font-semibold hover:bg-[#F7E7CE] transition-colors disabled:opacity-50"
          >
            Test Multiple Stocks
          </button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-4 bg-black bg-opacity-20 rounded-lg">
            <pre className="text-[#F7E7CE] whitespace-pre-wrap text-sm">
              {testResult}
            </pre>
          </div>
        )}
        
        {isLoading && (
          <div className="text-[#F7E7CE] text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
