import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

const PortfolioAnalytics = () => {
  const { portfolio, getPortfolioStats, getSectorPerformance } = useContext(StockContext);
  
  const stats = getPortfolioStats();
  const sectorStats = getSectorPerformance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (portfolio.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Analytics</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analytics Available</h3>
          <p className="text-gray-600">Start building your portfolio to see detailed analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Portfolio Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Invested</h3>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalInvested)}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Value</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.currentValue)}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Gain/Loss</h3>
            <p className={`text-3xl font-bold ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalGainLoss)}
            </p>
            <p className={`text-sm ${stats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalGainLoss >= 0 ? '+' : ''}{stats.totalGainLossPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sector Performance</h2>
        <div className="space-y-4">
          {Object.entries(sectorStats).map(([sector, data]) => (
            <div key={sector} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{sector}</h3>
                <div className="text-right">
                  <p className={`font-bold ${data.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.gainLoss)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.totalInvested > 0 ? 
                      `${data.gainLoss >= 0 ? '+' : ''}${((data.gainLoss / data.totalInvested) * 100).toFixed(2)}%` : 
                      '0.00%'
                    }
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Invested:</span>
                  <span className="ml-2 font-semibold">{formatCurrency(data.totalInvested)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Current:</span>
                  <span className="ml-2 font-semibold">{formatCurrency(data.currentValue)}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-600 text-sm">Stocks: </span>
                <span className="text-sm font-medium">{data.stocks.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Stock Performance */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Stock Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Shares</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Gain/Loss</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">% Change</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock) => {
                const currentStock = stocks.find(s => s.symbol === stock.symbol);
                if (!currentStock) return null;
                
                const currentValue = currentStock.price * stock.quantity;
                const gainLoss = currentValue - stock.totalInvested;
                const gainLossPercent = stock.totalInvested > 0 ? (gainLoss / stock.totalInvested) * 100 : 0;
                
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
                    <td className="py-3 px-4 text-gray-900">{formatCurrency(stock.averageCost)}</td>
                    <td className="py-3 px-4 text-gray-900">{formatCurrency(currentStock.price)}</td>
                    <td className="py-3 px-4">
                      <div className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(gainLoss)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
