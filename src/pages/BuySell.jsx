import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const BuySell = () => {
  const { stocks, user, buyStock, sellStock } = useData();
  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('buy');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock || !quantity || quantity <= 0) {
      setMessage('Please select a stock and enter a valid quantity');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const stock = stocks.find(s => s.symbol === selectedStock);
    const shares = parseInt(quantity);
    const price = stock.price;

    try {
      let result;
      if (action === 'buy') {
        result = buyStock(selectedStock, shares, price);
      } else {
        result = sellStock(selectedStock, shares, price);
      }

      if (result.success) {
        setMessage(`✅ ${result.message}`);
        setQuantity('');
        setSelectedStock('');
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Buy & Sell Stocks</h1>
        <p className="text-gray-600">Trade virtual stocks with your balance</p>
      </div>

      {/* Balance Display */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Available Balance</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(user.virtualBalance)}</p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Trading Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Place Order</h2>
          <p className="text-gray-600">Select a stock and quantity to trade</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Action</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAction('buy')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  action === 'buy'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                🟢 Buy
              </button>
              <button
                type="button"
                onClick={() => setAction('sell')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  action === 'sell'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                🔴 Sell
              </button>
            </div>
          </div>

          {/* Stock Selection */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Stock
            </label>
            <select
              id="stock"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a stock...</option>
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name} ({formatCurrency(stock.price)})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity (Shares)
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of shares"
              required
            />
          </div>

          {/* Stock Info Display */}
          {selectedStockData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Stock Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Current Price:</span>
                  <span className="ml-2 font-semibold">{formatCurrency(selectedStockData.price)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Change:</span>
                  <span className={`ml-2 font-semibold ${selectedStockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStockData.change >= 0 ? '+' : ''}{formatCurrency(selectedStockData.change)} ({selectedStockData.changePercent >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="ml-2 font-semibold">
                    {quantity ? formatCurrency(selectedStockData.price * parseInt(quantity)) : '$0.00'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Remaining Balance:</span>
                  <span className="ml-2 font-semibold">
                    {quantity ? formatCurrency(user.virtualBalance - (selectedStockData.price * parseInt(quantity))) : formatCurrency(user.virtualBalance)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedStock || !quantity}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isLoading || !selectedStock || !quantity
                ? 'bg-gray-400 cursor-not-allowed'
                : action === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Processing...' : `${action === 'buy' ? '🟢 Buy' : '🔴 Sell'} Stock`}
          </button>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setAction('buy');
              setSelectedStock('AAPL');
              setQuantity('1');
            }}
            className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Buy 1 AAPL
          </button>
          <button
            onClick={() => {
              setAction('sell');
              setSelectedStock('AAPL');
              setQuantity('1');
            }}
            className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Sell 1 AAPL
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySell;
