// Enhanced StockContext with Capital One Nessie API integration
import React, { createContext, useState, useEffect } from 'react';
import { stocks as initialStocks } from '../mockStocks';
import { fetchBankTransactions, createDeposit, createWithdrawal } from '../services/realBankApi';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState(initialStocks);
  const [userBalance, setUserBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bank transactions on component mount
  useEffect(() => {
    loadBankTransactions();
  }, []);

  const loadBankTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await fetchBankTransactions();
      if (result.success) {
        setBankTransactions(result.data);
        // Update user balance based on latest bank transactions
        updateBalanceFromBankTransactions(result.data);
      }
    } catch (error) {
      console.error('Failed to load bank transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalanceFromBankTransactions = (transactions) => {
    const currentBalance = transactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
    setUserBalance(currentBalance);
  };

  // Enhanced buy stock function with bank API integration
  const buyStock = async (symbol, quantity) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error('Quantity must be a positive integer');
    }

    const totalCost = stock.price * quantity;
    
    if (userBalance < totalCost) {
      throw new Error(`Insufficient balance. Need $${totalCost.toFixed(2)}, have $${userBalance.toFixed(2)}`);
    }

    try {
      // Create withdrawal transaction in bank API
      const bankResult = await createWithdrawal(
        totalCost, 
        `Stock Purchase - ${quantity} shares of ${symbol}`
      );

      if (!bankResult.success) {
        throw new Error(`Bank transaction failed: ${bankResult.message}`);
      }

      // Update local state
      setUserBalance(prevBalance => prevBalance - totalCost);
      
      // Update portfolio
      setPortfolio(prevPortfolio => {
        const existingStock = prevPortfolio.find(p => p.symbol === symbol);
        if (existingStock) {
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
        balanceAfter: userBalance - totalCost,
        bankTransactionId: bankResult.data.id
      };
      setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
      
      // Reload bank transactions to get updated balance
      await loadBankTransactions();
      
      return { success: true, message: `Successfully bought ${quantity} shares of ${symbol}` };
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  };

  // Enhanced sell stock function with bank API integration
  const sellStock = async (symbol, quantity) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }

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

    try {
      // Create deposit transaction in bank API
      const bankResult = await createDeposit(
        totalValue, 
        `Stock Sale - ${quantity} shares of ${symbol}`
      );

      if (!bankResult.success) {
        throw new Error(`Bank transaction failed: ${bankResult.message}`);
      }

      // Update local state
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
        balanceAfter: userBalance + totalValue,
        bankTransactionId: bankResult.data.id
      };
      setTransactionHistory(prevHistory => [transaction, ...prevHistory]);
      
      // Reload bank transactions to get updated balance
      await loadBankTransactions();
      
      return { 
        success: true, 
        message: `Successfully sold ${quantity} shares of ${symbol}`,
        gainLoss: gainLoss
      };
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  };

  // Rest of your existing functions...
  const updateStockPrices = () => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        const changePercent = (Math.random() - 0.5) * 0.06;
        const newPrice = stock.price * (1 + changePercent);
        const priceChange = newPrice - stock.price;
        const changePercentValue = (priceChange / stock.price) * 100;
        
        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(changePercentValue * 100) / 100,
          volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4))
        };
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(updateStockPrices, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const resetPortfolio = () => {
    setUserBalance(10000);
    setPortfolio([]);
    setTransactionHistory([]);
  };

  const contextValue = {
    stocks,
    userBalance,
    portfolio,
    transactionHistory,
    bankTransactions,
    isLoading,
    buyStock,
    sellStock,
    getPortfolioStats,
    resetPortfolio,
    loadBankTransactions
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};
