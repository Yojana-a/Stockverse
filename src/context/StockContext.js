import React, { createContext, useState, useEffect } from 'react';
import { stocks as initialStocks } from '../mockStocks';
import { fetchMultipleStockQuotes } from '../services/alphaVantageApi';
import { DEFAULT_STOCKS, COMPANY_NAMES } from '../config/apiConfig';

// Create the context
export const StockContext = createContext();

// StockProvider component
export const StockProvider = ({ children }) => {
  // State management
  const [stocks, setStocks] = useState(initialStocks);
  const [userBalance, setUserBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Function to fetch real stock prices from Alpha Vantage API
  const fetchRealStockPrices = async () => {
    if (isLoading) return; // Prevent multiple simultaneous calls
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const realStocks = await fetchMultipleStockQuotes(DEFAULT_STOCKS);
      
      // Map API data to our stock format
      const updatedStocks = realStocks.map(apiStock => ({
        symbol: apiStock.symbol,
        name: COMPANY_NAMES[apiStock.symbol] || apiStock.name,
        price: apiStock.price,
        change: apiStock.change,
        changePercent: apiStock.changePercent,
        volume: apiStock.volume,
        high: apiStock.high,
        low: apiStock.low,
        open: apiStock.open,
        previousClose: apiStock.previousClose
      }));
      
      setStocks(updatedStocks);
    } catch (error) {
      console.error('Failed to fetch real stock prices:', error);
      setApiError(error.message);
      // Fall back to mock data simulation
      updateStockPrices();
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate live stock price changes (fallback)
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

  // useEffect to fetch real stock prices on component mount
  useEffect(() => {
    // Fetch real prices immediately
    fetchRealStockPrices();
    
    // Set up interval for periodic updates (every 2 minutes to respect API limits)
    const interval = setInterval(fetchRealStockPrices, 120000); // 2 minutes
    
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
    setUserBalance,
    portfolio,
    addToPortfolio: (stock) => {
      setPortfolio(prev => [...prev, stock]);
    },
    removeFromPortfolio: (symbol) => {
      setPortfolio(prev => prev.filter(p => p.symbol !== symbol));
    },
    transactionHistory,
    buyStock,
    sellStock,
    isLoading,
    apiError,
    fetchRealStockPrices
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};
