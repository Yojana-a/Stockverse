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
        // More realistic price changes: -3% to +3%
        const changePercent = (Math.random() - 0.5) * 0.06; // -3% to +3%
        const newPrice = stock.price * (1 + changePercent);
        const priceChange = newPrice - stock.price;
        const changePercentValue = (priceChange / stock.price) * 100;
        
        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100, // Round to 2 decimal places
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(changePercentValue * 100) / 100,
          volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)) // Simulate volume changes
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

    // Validate quantity
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a positive integer');
    }

    const totalCost = stock.price * quantity;
    
    // Check if user has enough balance
    if (userBalance < totalCost) {
      throw new Error(`Insufficient balance. Need $${totalCost.toFixed(2)}, have $${userBalance.toFixed(2)}`);
    }

    // Update user balance
    setUserBalance(prevBalance => prevBalance - totalCost);

    // Update portfolio with average cost calculation
    setPortfolio(prevPortfolio => {
      const existingStock = prevPortfolio.find(p => p.symbol === symbol);
      if (existingStock) {
        // Calculate new average cost
        const totalShares = existingStock.quantity + quantity;
        const totalCostExisting = existingStock.averageCost * existingStock.quantity;
        const newAverageCost = (totalCostExisting + totalCost) / totalShares;
        
        return prevPortfolio.map(p => 
          p.symbol === symbol 
            ? { 
                ...p, 
                quantity: totalShares,
                averageCost: Math.round(newAverageCost * 100) / 100,
                totalInvested: totalCostExisting + totalCost
              }
            : p
        );
      } else {
        return [...prevPortfolio, { 
          symbol, 
          quantity, 
          name: stock.name,
          averageCost: stock.price,
          totalInvested: totalCost,
          sector: stock.sector
        }];
      }
    });

    // Add to transaction history
    const transaction = {
      id: Date.now(),
      type: 'buy',
      symbol,
      quantity,
      price: stock.price,
      date: new Date().toISOString(),
      totalCost,
      balanceAfter: userBalance - totalCost
    };
    setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
    
    return { success: true, message: `Successfully bought ${quantity} shares of ${symbol}` };
  };

  // Function to sell stock
  const sellStock = (symbol, quantity) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }

    // Validate quantity
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a positive integer');
    }

    const portfolioStock = portfolio.find(p => p.symbol === symbol);
    if (!portfolioStock) {
      throw new Error(`You don't own any shares of ${symbol}`);
    }
    
    if (portfolioStock.quantity < quantity) {
      throw new Error(`Insufficient shares to sell. You own ${portfolioStock.quantity} shares, trying to sell ${quantity}`);
    }

    const totalValue = stock.price * quantity;
    const costBasis = portfolioStock.averageCost * quantity;
    const gainLoss = totalValue - costBasis;

    // Update user balance
    setUserBalance(prevBalance => prevBalance + totalValue);

    // Update portfolio
    setPortfolio(prevPortfolio => {
      const updatedPortfolio = prevPortfolio.map(p => 
        p.symbol === symbol 
          ? { 
              ...p, 
              quantity: p.quantity - quantity,
              totalInvested: p.totalInvested - costBasis
            }
          : p
      );
      // Remove stock from portfolio if quantity becomes 0
      return updatedPortfolio.filter(p => p.quantity > 0);
    });

    // Add to transaction history
    const transaction = {
      id: Date.now(),
      type: 'sell',
      symbol,
      quantity,
      price: stock.price,
      date: new Date().toISOString(),
      totalValue,
      costBasis,
      gainLoss,
      balanceAfter: userBalance + totalValue
    };
    setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
    
    return { 
      success: true, 
      message: `Successfully sold ${quantity} shares of ${symbol}`,
      gainLoss: gainLoss
    };
  };

  // Calculate portfolio statistics
  const getPortfolioStats = () => {
    const totalInvested = portfolio.reduce((sum, stock) => sum + stock.totalInvested, 0);
    const currentValue = portfolio.reduce((sum, stock) => {
      const currentStock = stocks.find(s => s.symbol === stock.symbol);
      return sum + (currentStock ? currentStock.price * stock.quantity : 0);
    }, 0);
    const totalGainLoss = currentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
    
    return {
      totalInvested,
      currentValue,
      totalGainLoss,
      totalGainLossPercent: Math.round(totalGainLossPercent * 100) / 100
    };
  };

  // Get portfolio performance by sector
  const getSectorPerformance = () => {
    const sectorStats = {};
    
    portfolio.forEach(stock => {
      const currentStock = stocks.find(s => s.symbol === stock.symbol);
      if (currentStock) {
        const currentValue = currentStock.price * stock.quantity;
        const gainLoss = currentValue - stock.totalInvested;
        
        if (!sectorStats[stock.sector]) {
          sectorStats[stock.sector] = {
            totalInvested: 0,
            currentValue: 0,
            gainLoss: 0,
            stocks: []
          };
        }
        
        sectorStats[stock.sector].totalInvested += stock.totalInvested;
        sectorStats[stock.sector].currentValue += currentValue;
        sectorStats[stock.sector].gainLoss += gainLoss;
        sectorStats[stock.sector].stocks.push(stock.symbol);
      }
    });
    
    return sectorStats;
  };

  // Reset portfolio (for testing purposes)
  const resetPortfolio = () => {
    setUserBalance(10000);
    setPortfolio([]);
    setTransactionHistory([]);
  };

  // Context value object
  const contextValue = {
    stocks,
    userBalance,
    portfolio,
    transactionHistory,
    buyStock,
    sellStock,
    getPortfolioStats,
    getSectorPerformance,
    resetPortfolio
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};
