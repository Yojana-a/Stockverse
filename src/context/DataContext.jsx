import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: 'Trader123',
    virtualBalance: 10000,
    totalPortfolioValue: 12500,
  });

  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.30, changePercent: 1.33 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.83 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.90, change: 5.40, changePercent: 1.45 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.20, change: -3.80, changePercent: -1.53 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.30, change: 1.80, changePercent: 1.17 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.60, change: 8.90, changePercent: 1.87 },
  ]);

  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', shares: 10, avgPrice: 170.00, currentPrice: 175.50 },
    { symbol: 'MSFT', shares: 5, avgPrice: 375.00, currentPrice: 378.90 },
    { symbol: 'TSLA', shares: 3, avgPrice: 250.00, currentPrice: 245.20 },
  ]);

  const [transactionHistory, setTransactionHistory] = useState([
    { id: 1, type: 'BUY', symbol: 'AAPL', shares: 10, price: 170.00, timestamp: '2024-01-15T10:30:00Z' },
    { id: 2, type: 'BUY', symbol: 'MSFT', shares: 5, price: 375.00, timestamp: '2024-01-14T14:20:00Z' },
    { id: 3, type: 'BUY', symbol: 'TSLA', shares: 3, price: 250.00, timestamp: '2024-01-13T09:15:00Z' },
    { id: 4, type: 'SELL', symbol: 'GOOGL', shares: 2, price: 145.00, timestamp: '2024-01-12T16:45:00Z' },
  ]);

  const buyStock = (symbol, shares, price) => {
    const totalCost = shares * price;
    if (totalCost > user.virtualBalance) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Update balance
    setUser(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance - totalCost
    }));

    // Update portfolio
    const existingStock = portfolio.find(stock => stock.symbol === symbol);
    if (existingStock) {
      setPortfolio(prev => prev.map(stock => 
        stock.symbol === symbol 
          ? { 
              ...stock, 
              shares: stock.shares + shares,
              avgPrice: ((stock.avgPrice * stock.shares) + (price * shares)) / (stock.shares + shares)
            }
          : stock
      ));
    } else {
      setPortfolio(prev => [...prev, { symbol, shares, avgPrice: price, currentPrice: price }]);
    }

    // Add to transaction history
    setTransactionHistory(prev => [...prev, {
      id: Date.now(),
      type: 'BUY',
      symbol,
      shares,
      price,
      timestamp: new Date().toISOString()
    }]);

    return { success: true, message: 'Stock purchased successfully' };
  };

  const sellStock = (symbol, shares, price) => {
    const existingStock = portfolio.find(stock => stock.symbol === symbol);
    if (!existingStock || existingStock.shares < shares) {
      return { success: false, message: 'Insufficient shares' };
    }

    const totalValue = shares * price;

    // Update balance
    setUser(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance + totalValue
    }));

    // Update portfolio
    if (existingStock.shares === shares) {
      setPortfolio(prev => prev.filter(stock => stock.symbol !== symbol));
    } else {
      setPortfolio(prev => prev.map(stock => 
        stock.symbol === symbol 
          ? { ...stock, shares: stock.shares - shares }
          : stock
      ));
    }

    // Add to transaction history
    setTransactionHistory(prev => [...prev, {
      id: Date.now(),
      type: 'SELL',
      symbol,
      shares,
      price,
      timestamp: new Date().toISOString()
    }]);

    return { success: true, message: 'Stock sold successfully' };
  };

  const updatePortfolioValue = () => {
    const totalValue = portfolio.reduce((sum, stock) => {
      const currentStock = stocks.find(s => s.symbol === stock.symbol);
      return sum + (stock.shares * (currentStock?.price || stock.currentPrice));
    }, 0);
    
    setUser(prev => ({
      ...prev,
      totalPortfolioValue: totalValue + user.virtualBalance
    }));
  };

  const value = {
    user,
    stocks,
    portfolio,
    transactionHistory,
    buyStock,
    sellStock,
    updatePortfolioValue,
    setUser,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
