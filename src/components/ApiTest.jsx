import React, { useState } from 'react';
import { testApiConnection, getAccountId } from '../services/apiHelper';

const ApiTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const isConnected = await testApiConnection();
      if (isConnected) {
        const accountId = await getAccountId();
        setResult({
          success: true,
          message: 'API connection successful!',
          accountId: accountId
        });
      } else {
        setResult({
          success: false,
          message: 'API connection failed. Check your API key and try again.'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
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

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <h3 className="font-semibold mb-2">
              {result.success ? '✅ Success!' : '❌ Failed'}
            </h3>
            <p className="mb-2">{result.message}</p>
            {result.accountId && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-sm font-mono text-gray-800">
                  Account ID: {result.accountId}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Add this to your .env file as REACT_APP_ACCOUNT_ID
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
