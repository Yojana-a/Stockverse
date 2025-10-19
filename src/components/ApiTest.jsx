import React, { useState } from 'react';

const ApiTest = () => {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handleApiTest = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    
    try {
      const apiKey = 'OMDGFKYMGYTUNHL5';
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error('No data available');
      }
      
      setApiTestResult({
        success: true,
        message: 'API working!',
        data: {
          symbol: quote['01. symbol'],
          price: quote['05. price'],
          change: quote['09. change']
        }
      });
    } catch (error) {
      setApiTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 mb-3"
        onClick={handleApiTest}
        disabled={isTestingApi}
      >
        {isTestingApi ? 'Testing...' : 'Test API'}
      </button>
      
      {apiTestResult && (
        <div className={`p-3 rounded ${
          apiTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-semibold">
            {apiTestResult.success ? '✅ Success!' : '❌ Failed'}
          </p>
          <p className="text-sm">{apiTestResult.message}</p>
          {apiTestResult.data && (
            <p className="text-sm mt-1">
              {apiTestResult.data.symbol}: ${apiTestResult.data.price} ({apiTestResult.data.change})
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest;
