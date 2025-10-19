import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

const Portfolio = () => {
  const { stocks, portfolio } = useContext(StockContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D4AF37]/30 relative z-10">
      <div className="px-6 py-4 border-b border-[#D4AF37]/30">
        <h3 className="text-lg font-semibold text-[#F7E7CE]">Portfolio</h3>
      </div>
      <div className="p-6">
        {portfolio.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#F7E7CE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-lg font-medium text-[#F7E7CE] mb-2">No stocks in portfolio</h4>
            <p className="text-[#F7E7CE]/70">Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio.map((stock) => {
              const currentStock = stocks.find(s => s.symbol === stock.symbol);
              const currentPrice = currentStock?.price || 0;
              const totalValue = stock.quantity * currentPrice;
              const gainLoss = totalValue - (stock.averageCost * stock.quantity);
              const gainLossPercent = stock.averageCost > 0 ? (gainLoss / (stock.averageCost * stock.quantity)) * 100 : 0;

              return (
                <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#F7E7CE]/5 rounded-lg border border-[#D4AF37]/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F7E7CE] rounded-lg flex items-center justify-center">
                      <span className="text-[#1a1a2e] font-bold text-sm">{stock.symbol}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F7E7CE]">{stock.symbol}</h4>
                      <p className="text-sm text-[#F7E7CE]/70">{currentStock?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#F7E7CE]">{stock.quantity} shares</p>
                    <p className="text-sm text-[#F7E7CE]/70">{formatCurrency(totalValue)}</p>
                    <p className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;