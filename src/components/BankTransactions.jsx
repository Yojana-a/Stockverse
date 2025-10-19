import React, { useState, useEffect, useContext } from 'react';
import { StockContext } from '../context/StockContext';
import { fetchBankTransactions } from '../services/realBankApi';

const BankTransactions = () => {
  const { bankTransactions, loadBankTransactions, isLoading } = useContext(StockContext);
  const [localTransactions, setLocalTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBankTransactionsFromAPI();
  }, []);

  const loadBankTransactionsFromAPI = async () => {
    try {
      setError(null);
      const result = await fetchBankTransactions();
      if (result.success) {
        setLocalTransactions(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load bank transactions');
      console.error('Error loading bank transactions:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank Transactions</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bank transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank Transactions</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Transactions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBankTransactionsFromAPI}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Bank Transactions</h2>
        <button
          onClick={loadBankTransactionsFromAPI}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>
      
      {localTransactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bank Transactions</h3>
          <p className="text-gray-600">Bank transactions will appear here when you make trades</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-lg">
                    {transaction.type === 'deposit' ? '💰' : '💸'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </p>
                <p className="text-sm text-gray-600">
                  {transaction.account}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankTransactions;
