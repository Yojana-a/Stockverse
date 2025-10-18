import React, { createContext, useState, useEffect } from 'react';
import { stocks as initialStocks } from '../mockStocks';

// Create the context
export const StockContext = createContext();

// StockProvider component
export const StockProvider = ({ children }) => {
  // State management
  const [stocks, setStocks] = useState(initialStocks);
  const [userBalance, setUserBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Function to simulate live stock price changes
  const updateStockPrices = () => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        // Random price change between -5% and +5%
        const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
        const newPrice = stock.price * (1 + changePercent);
        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100 // Round to 2 decimal places
        };
      })
    );
  };

  // useEffect to simulate live price updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(updateStockPrices, 10000); // 10 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to buy stock
  const buyStock = (symbol, quantity) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }

    const totalCost = stock.price * quantity;
    
    // Check if user has enough balance
    if (userBalance < totalCost) {
      throw new Error('Insufficient balance');
    }

    // Update user balance
    setUserBalance(prevBalance => prevBalance - totalCost);

    // Update portfolio
    setPortfolio(prevPortfolio => {
      const existingStock = prevPortfolio.find(p => p.symbol === symbol);
      if (existingStock) {
        return prevPortfolio.map(p => 
          p.symbol === symbol 
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      } else {
        return [...prevPortfolio, { symbol, quantity, name: stock.name }];
      }
    });

    // Add to transaction history
    const transaction = {
      type: 'buy',
      symbol,
      quantity,
      price: stock.price,
      date: new Date().toISOString(),
      totalCost
    };
    setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
  };

  // Function to sell stock
  const sellStock = (symbol, quantity) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }

    const portfolioStock = portfolio.find(p => p.symbol === symbol);
    if (!portfolioStock || portfolioStock.quantity < quantity) {
      throw new Error('Insufficient shares to sell');
    }

    const totalValue = stock.price * quantity;

    // Update user balance
    setUserBalance(prevBalance => prevBalance + totalValue);

    // Update portfolio
    setPortfolio(prevPortfolio => {
      const updatedPortfolio = prevPortfolio.map(p => 
        p.symbol === symbol 
          ? { ...p, quantity: p.quantity - quantity }
          : p
      );
      // Remove stock from portfolio if quantity becomes 0
      return updatedPortfolio.filter(p => p.quantity > 0);
    });

    // Add to transaction history
    const transaction = {
      type: 'sell',
      symbol,
      quantity,
      price: stock.price,
      date: new Date().toISOString(),
      totalValue
    };
    setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
  };

  // Context value object
  const contextValue = {
    stocks,
    userBalance,
    portfolio,
    transactionHistory,
    buyStock,
    sellStock
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};
