import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

const Analytics = () => {
  const { userBalance, portfolio, stocks } = useContext(StockContext);

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, stock) => {
    const currentStock = stocks.find(s => s.symbol === stock.symbol);
    return total + (currentStock ? currentStock.price * stock.quantity : 0);
  }, 0);

  // Calculate total invested (using average cost from portfolio)
  const totalInvested = portfolio.reduce((sum, stock) => {
    return sum + (stock.averageCost * stock.quantity);
  }, 0);

  const totalGainLoss = portfolioValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cash Balance */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-6 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7E7CE] rounded-xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-[#F7E7CE]/70">Cash Balance</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{formatCurrency(userBalance)}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-6 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7E7CE] rounded-xl flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-[#F7E7CE]/70">Portfolio Value</p>
            <p className="text-2xl font-bold text-[#F7E7CE]">{formatCurrency(portfolioValue)}</p>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-6 relative z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7E7CE] rounded-xl flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-[#F7E7CE]/70">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
            <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;