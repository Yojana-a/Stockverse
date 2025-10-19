import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

export const TransactionHistory = () => {
  const { transactionHistory } = useContext(StockContext);

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

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#D4AF37]/30 relative z-10">
      <div className="px-6 py-4 border-b border-[#D4AF37]/30">
        <h3 className="text-lg font-semibold text-[#F7E7CE]">Transaction History</h3>
      </div>
      <div className="p-6">
        {transactionHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#F7E7CE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h4 className="text-lg font-medium text-[#F7E7CE] mb-2">No transactions yet</h4>
            <p className="text-[#F7E7CE]/70">Your trading history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactionHistory.slice(0, 10).map((transaction, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#F7E7CE]/5 rounded-lg border border-[#D4AF37]/20"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'buy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <span className="text-lg">
                      {transaction.type === 'buy' ? '🟢' : '🔴'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F7E7CE]">
                      {transaction.type.toUpperCase()} {transaction.quantity} {transaction.symbol}
                    </h4>
                    <p className="text-sm text-[#F7E7CE]/70">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#F7E7CE]">
                    {formatCurrency(transaction.price)} per share
                  </p>
                  <p className="text-sm text-[#F7E7CE]/70">
                    Total: {formatCurrency(transaction.totalCost || transaction.totalValue || 0)}
                  </p>
                  {transaction.gainLoss !== undefined && (
                    <p className={`text-sm font-medium ${
                      transaction.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.gainLoss >= 0 ? '+' : ''}{formatCurrency(transaction.gainLoss)} P&L
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};