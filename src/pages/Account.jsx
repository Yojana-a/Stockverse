import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';
import PortfolioAnalytics from '../components/PortfolioAnalytics';
import BankTransactions from '../components/BankTransactions';

const Account = () => {
  const { userBalance, portfolio, transactionHistory } = useContext(StockContext);

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

  const totalInvested = portfolio.reduce((sum, stock) => {
    return sum + (stock.quantity * 100); // Using a default price for calculation
  }, 0);

  const totalCurrentValue = portfolio.reduce((sum, stock) => {
    return sum + (stock.quantity * 100); // Using a default price for calculation
  }, 0);

  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Account</h1>
        <p className="text-gray-600">Your trading profile and portfolio overview</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Trader123</h3>
              <p className="text-gray-600">Virtual Trader</p>
              <p className="text-sm text-gray-500">Member since January 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Portfolio Value</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(userBalance + totalCurrentValue)}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Cash Balance</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(userBalance)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Gain/Loss</h3>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalGainLoss)}
              </p>
              <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className="text-4xl">{totalGainLoss >= 0 ? '📈' : '📉'}</div>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Holdings</h2>
          <p className="text-gray-600">Your current stock positions</p>
        </div>
        <div className="p-6">
          {portfolio.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Symbol</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Shares</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => {
                    const totalValue = stock.quantity * 100; // Using default price
                    const gainLoss = 0; // Simplified for now
                    const gainLossPercent = 0;

                    return (
                      <tr key={stock.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">{stock.symbol}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{stock.symbol}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{stock.quantity}</td>
                        <td className="py-3 px-4 text-gray-900">{formatCurrency(100)}</td>
                        <td className="py-3 px-4 text-gray-900">{formatCurrency(100)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(totalValue)}</td>
                        <td className="py-3 px-4">
                          <div className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(gainLoss)}
                            <div className="text-sm">
                              ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No holdings yet</h3>
              <p className="text-gray-600">Start building your portfolio by buying some stocks!</p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Analytics */}
      <PortfolioAnalytics />

      {/* Bank Transactions */}
      <BankTransactions />

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600">Your recent trading activity</p>
        </div>
        <div className="p-6">
          {transactionHistory.length > 0 ? (
            <div className="space-y-4">
              {transactionHistory.slice(0, 10).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="text-lg">
                        {transaction.type === 'buy' ? '🟢' : '🔴'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {transaction.type.toUpperCase()} {transaction.quantity} {transaction.symbol}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(transaction.price)} per share
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {formatCurrency(transaction.totalCost || transaction.totalValue || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Your trading history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
