import React, { useContext } from 'react';
import { StockContext } from '../context/StockContext';

export const TradingDashboard = () => {
  const { stocks, userBalance, portfolio, transactionHistory } = useContext(StockContext);

  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, stock) => {
    const currentStock = stocks.find(s => s.symbol === stock.symbol);
    return total + (currentStock ? currentStock.price * stock.quantity : 0);
  }, 0);

  const totalValue = userBalance + portfolioValue;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5aa0', marginBottom: '30px' }}>
        🚀 StockVerse Trading Dashboard
      </h1>

      {/* Account Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💰 Cash Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#2c5aa0' }}>
            ${userBalance.toFixed(2)}
          </p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>📈 Portfolio Value</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#2c5aa0' }}>
            ${portfolioValue.toFixed(2)}
          </p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>💎 Total Value</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#2c5aa0' }}>
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Live Stock Prices */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>📊 Live Stock Prices</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px' 
        }}>
          {stocks.map(stock => (
            <div key={stock.symbol} style={{
              padding: '15px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{stock.name}</h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{stock.symbol}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#2c5aa0' 
                  }}>
                    ${stock.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>💼 Your Portfolio</h2>
        {portfolio.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            color: '#666'
          }}>
            <p style={{ margin: '0', fontSize: '16px' }}>No stocks in your portfolio yet</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Start trading to build your portfolio!</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            {portfolio.map(stock => {
              const currentStock = stocks.find(s => s.symbol === stock.symbol);
              const currentValue = currentStock ? currentStock.price * stock.quantity : 0;
              
              return (
                <div key={stock.symbol} style={{
                  padding: '15px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '8px',
                  border: '1px solid #4CAF50'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{stock.name}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>Symbol: {stock.symbol}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}>Shares: {stock.quantity}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}>Current Price: ${currentStock?.price.toFixed(2)}</p>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#2c5aa0' }}>
                    Value: ${currentValue.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>📋 Recent Transactions</h2>
        {transactionHistory.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            color: '#666'
          }}>
            <p style={{ margin: '0' }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {transactionHistory.slice(0, 10).map((transaction, index) => (
              <div key={index} style={{
                padding: '10px',
                backgroundColor: transaction.type === 'buy' ? '#e3f2fd' : '#ffebee',
                border: `1px solid ${transaction.type === 'buy' ? '#2196f3' : '#f44336'}`,
                borderRadius: '4px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: transaction.type === 'buy' ? '#1976d2' : '#d32f2f'
                  }}>
                    {transaction.type.toUpperCase()}
                  </span>
                  <span style={{ margin: '0 10px', color: '#333' }}>
                    {transaction.quantity} shares of {transaction.symbol}
                  </span>
                  <span style={{ color: '#666' }}>
                    @ ${transaction.price.toFixed(2)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>
                    ${transaction.totalCost || transaction.totalValue || 0}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {new Date(transaction.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
