import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

const Dashboard = () => {
  const { stocks, userBalance, portfolio } = useContext(StockContext);

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, stock) => {
    const currentStock = stocks.find(s => s.symbol === stock.symbol);
    return total + (currentStock ? currentStock.price * stock.quantity : 0);
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to StockVerse!</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Virtual Balance</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(userBalance)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Portfolio Value</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(portfolioValue)}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>
          <p className="text-gray-600">Stocks you currently own</p>
        </div>
        <div className="p-6">
          {portfolio.length > 0 ? (
            <div className="space-y-4">
              {portfolio.map((stock) => {
                const currentStock = stocks.find(s => s.symbol === stock.symbol);
                const currentPrice = currentStock?.price || 0;
                const totalValue = stock.quantity * currentPrice;

                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">{stock.symbol}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{stock.name}</h3>
                        <p className="text-sm text-gray-600">{stock.quantity} shares</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(totalValue)}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(currentPrice)} per share
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No stocks in portfolio</h3>
              <p className="text-gray-600">Start trading by buying some stocks!</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
          <p className="text-gray-600">Current stock prices</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                  <span className="text-sm text-gray-600">{stock.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stock.price)}</p>
                  <p className="text-sm text-gray-600">Live Price</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
