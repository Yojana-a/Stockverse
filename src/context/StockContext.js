import React, { createContext, useState, useEffect } from 'react';
import { stocks as initialStocks } from '../mockStocks';
import { fetchStockQuote, searchStocks } from '../services/alphaVantageApi';

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

  // Function to update stock prices using Alpha Vantage API
  const updateStockPrices = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const result = await fetchStockQuote(stock.symbol);
          if (result.success) {
            return {
              ...stock,
              price: result.data.price,
              change: result.data.change,
              changePercent: result.data.changePercent,
              volume: result.data.volume,
              high: result.data.high,
              low: result.data.low,
              open: result.data.open,
              previousClose: result.data.previousClose,
              lastUpdated: result.data.lastUpdated
            };
          } else {
            // If API fails, keep existing data
            console.warn(`Failed to fetch ${stock.symbol}:`, result.message);
            return stock;
          }
        })
      );
      
      setStocks(updatedStocks);
    } catch (error) {
      console.error('Error updating stock prices:', error);
      setApiError('Failed to update stock prices');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to search for new stocks
  const searchForStocks = async (keywords) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const result = await searchStocks(keywords);
      if (result.success) {
        return result.data;
      } else {
        setApiError(result.message);
        return [];
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      setApiError('Failed to search stocks');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new stock to the watchlist
  const addStockToWatchlist = async (symbol) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const result = await fetchStockQuote(symbol);
      if (result.success) {
        const newStock = {
          symbol: result.data.symbol,
          name: symbol, // We'll get the name from company overview later
          price: result.data.price,
          change: result.data.change,
          changePercent: result.data.changePercent,
          volume: result.data.volume,
          marketCap: 0, // Will be filled by company overview
          sector: 'Unknown', // Will be filled by company overview
          high: result.data.high,
          low: result.data.low,
          open: result.data.open,
          previousClose: result.data.previousClose,
          lastUpdated: result.data.lastUpdated
        };
        
        setStocks(prevStocks => {
          // Check if stock already exists
          if (prevStocks.find(s => s.symbol === symbol)) {
            return prevStocks;
          }
          return [...prevStocks, newStock];
        });
        
        return { success: true, message: `Added ${symbol} to watchlist` };
      } else {
        setApiError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      setApiError('Failed to add stock');
      return { success: false, message: 'Failed to add stock' };
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to update prices every 30 seconds (respecting API rate limits)
  useEffect(() => {
    const interval = setInterval(updateStockPrices, 30000); // 30 seconds
    
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
    isLoading,
    apiError,
    buyStock,
    sellStock,
    getPortfolioStats,
    getSectorPerformance,
    resetPortfolio,
    updateStockPrices,
    searchForStocks,
    addStockToWatchlist
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};
