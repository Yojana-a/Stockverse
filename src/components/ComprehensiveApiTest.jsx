import React, { useState } from 'react';

const ComprehensiveApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [overallStatus, setOverallStatus] = useState(null);

  const stocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'META'];

  const testAllStocks = async () => {
    setIsTesting(true);
    setTestResults([]);
    setOverallStatus(null);

    const results = [];
    let successCount = 0;

    for (const symbol of stocks) {
      try {
        const apiKey = 'OMDGFKYMGYTUNHL5';
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data['Error Message']) {
          results.push({
            symbol,
            success: false,
            error: data['Error Message'],
            data: null
          });
        } else if (data['Note']) {
          results.push({
            symbol,
            success: false,
            error: 'API rate limit exceeded',
            data: null
          });
        } else {
          const quote = data['Global Quote'];
          if (quote && quote['01. symbol']) {
            results.push({
              symbol,
              success: true,
              error: null,
              data: {
                price: quote['05. price'],
                change: quote['09. change'],
                changePercent: quote['10. change percent'],
                volume: quote['06. volume'],
                high: quote['03. high'],
                low: quote['04. low'],
                open: quote['02. open']
              }
            });
            successCount++;
          } else {
            results.push({
              symbol,
              success: false,
              error: 'No quote data available',
              data: null
            });
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setTestResults([...results]);
      } catch (error) {
        results.push({
          symbol,
          success: false,
          error: error.message,
          data: null
        });
        setTestResults([...results]);
      }
    }

    setOverallStatus({
      total: stocks.length,
      successful: successCount,
      failed: stocks.length - successCount,
      successRate: Math.round((successCount / stocks.length) * 100)
    });
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-4">Comprehensive API Test - All Stocks</h3>
      
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mb-4"
        onClick={testAllStocks}
        disabled={isTesting}
      >
        {isTesting ? 'Testing All Stocks...' : 'Test All 6 Stocks'}
      </button>

      {isTesting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">
            ⏳ Testing all stocks... This may take up to 12 seconds due to rate limits.
          </p>
        </div>
      )}

      {overallStatus && (
        <div className={`mb-4 p-3 rounded ${
          overallStatus.successRate >= 80 ? 'bg-green-50 border border-green-200' : 
          overallStatus.successRate >= 50 ? 'bg-yellow-50 border border-yellow-200' : 
          'bg-red-50 border border-red-200'
        }`}>
          <h4 className="font-semibold mb-2">
            📊 Overall Results: {overallStatus.successful}/{overallStatus.total} successful ({overallStatus.successRate}%)
          </h4>
          <p className="text-sm">
            ✅ Successful: {overallStatus.successful} | ❌ Failed: {overallStatus.failed}
          </p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-800 mb-2">Individual Results:</h4>
          {testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded ${
              result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {result.success ? '✅' : '❌'} {result.symbol}
                  </p>
                  {result.success ? (
                    <div className="text-sm mt-1">
                      <p>Price: ${result.data.price}</p>
                      <p>Change: {result.data.change} ({result.data.changePercent})</p>
                      <p>Volume: {parseInt(result.data.volume).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-700 mt-1">{result.error}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-2 bg-white rounded border">
        <p className="text-sm text-gray-600">
          Testing stocks: {stocks.join(', ')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Note: Alpha Vantage free tier allows 5 calls per minute. Testing all 6 stocks takes ~12 seconds.
        </p>
      </div>
    </div>
  );
};

export default ComprehensiveApiTest;
