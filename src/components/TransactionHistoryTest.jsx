import React, { useContext, useState } from 'react';
import { StockContext } from '../context/StockContext';

const TransactionHistoryTest = () => {
  const { 
    stocks, 
    userBalance, 
    portfolio, 
    transactionHistory, 
    buyStock, 
    sellStock 
  } = useContext(StockContext);
  
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTransactionTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    const results = [];

    try {
      // Test 1: Buy some stocks
      results.push({ test: 'Buy AAPL (5 shares)', status: 'Testing...' });
      setTestResults([...results]);
      
      const buyResult1 = buyStock('AAPL', 5);
      if (buyResult1.success) {
        results[0] = { test: 'Buy AAPL (5 shares)', status: '✅ Success', details: buyResult1.message };
      } else {
        results[0] = { test: 'Buy AAPL (5 shares)', status: '❌ Failed', details: buyResult1.message };
      }
      setTestResults([...results]);

      // Test 2: Buy different stock
      results.push({ test: 'Buy TSLA (3 shares)', status: 'Testing...' });
      setTestResults([...results]);
      
      const buyResult2 = buyStock('TSLA', 3);
      if (buyResult2.success) {
        results[1] = { test: 'Buy TSLA (3 shares)', status: '✅ Success', details: buyResult2.message };
      } else {
        results[1] = { test: 'Buy TSLA (3 shares)', status: '❌ Failed', details: buyResult2.message };
      }
      setTestResults([...results]);

      // Test 3: Sell some shares
      results.push({ test: 'Sell AAPL (2 shares)', status: 'Testing...' });
      setTestResults([...results]);
      
      const sellResult = sellStock('AAPL', 2);
      if (sellResult.success) {
        results[2] = { test: 'Sell AAPL (2 shares)', status: '✅ Success', details: sellResult.message };
      } else {
        results[2] = { test: 'Sell AAPL (2 shares)', status: '❌ Failed', details: sellResult.message };
      }
      setTestResults([...results]);

      // Test 4: Try to sell more than owned (should fail)
      results.push({ test: 'Sell AAPL (10 shares) - Should Fail', status: 'Testing...' });
      setTestResults([...results]);
      
      try {
        const sellResult2 = sellStock('AAPL', 10);
        results[3] = { test: 'Sell AAPL (10 shares) - Should Fail', status: '❌ Unexpected Success', details: 'Should have failed but succeeded' };
      } catch (error) {
        results[3] = { test: 'Sell AAPL (10 shares) - Should Fail', status: '✅ Correctly Failed', details: error.message };
      }
      setTestResults([...results]);

      // Test 5: Try to buy with insufficient balance (should fail)
      results.push({ test: 'Buy expensive stock - Should Fail', status: 'Testing...' });
      setTestResults([...results]);
      
      try {
        const buyResult3 = buyStock('MSFT', 1000); // This should fail due to insufficient balance
        results[4] = { test: 'Buy expensive stock - Should Fail', status: '❌ Unexpected Success', details: 'Should have failed but succeeded' };
      } catch (error) {
        results[4] = { test: 'Buy expensive stock - Should Fail', status: '✅ Correctly Failed', details: error.message };
      }
      setTestResults([...results]);

    } catch (error) {
      results.push({ test: 'Test Error', status: '❌ Error', details: error.message });
    }

    setIsTesting(false);
  };

  const clearTestData = () => {
    // Clear localStorage to reset data
    localStorage.removeItem('stockverse_data');
    window.location.reload();
  };

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-4">Transaction History Test</h3>
      
      <div className="mb-4 space-x-2">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          onClick={runTransactionTests}
          disabled={isTesting}
        >
          {isTesting ? 'Running Tests...' : 'Test Transaction System'}
        </button>
        
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={clearTestData}
        >
          Reset Test Data
        </button>
      </div>

      {isTesting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">
            ⏳ Running transaction tests... This will test buy/sell functionality and transaction history.
          </p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">Test Results:</h4>
          {testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded ${
              result.status.includes('✅') ? 'bg-green-100 border border-green-300' : 
              result.status.includes('❌') ? 'bg-red-100 border border-red-300' : 
              'bg-yellow-100 border border-yellow-300'
            }`}>
              <p className="font-semibold">{result.status} {result.test}</p>
              <p className="text-sm mt-1">{result.details}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Current Status:</h4>
          <p>Balance: ${userBalance.toLocaleString()}</p>
          <p>Portfolio: {portfolio.length} stocks</p>
          <p>Transactions: {transactionHistory.length}</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Available Stocks:</h4>
          {stocks.slice(0, 3).map(stock => (
            <p key={stock.symbol}>{stock.symbol}: ${stock.price}</p>
          ))}
          {stocks.length > 3 && <p>...and {stocks.length - 3} more</p>}
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Recent Transactions:</h4>
          {transactionHistory.slice(0, 3).map(transaction => (
            <p key={transaction.id}>
              {transaction.type.toUpperCase()} {transaction.symbol} 
              ({transaction.quantity} @ ${transaction.price})
            </p>
          ))}
          {transactionHistory.length === 0 && <p className="text-gray-500">No transactions yet</p>}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTest;
