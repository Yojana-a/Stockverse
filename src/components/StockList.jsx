import React, { useContext, useState } from 'react';
import { StockContext } from '../context/StockContext';

export const StockList = () => {
  const { stocks, userBalance, portfolio, buyStock, sellStock } = useContext(StockContext);
  const [quantities, setQuantities] = useState({});

  const handleBuy = (symbol, quantity) => {
    try {
      buyStock(symbol, quantity);
      setQuantities({ ...quantities, [symbol]: 0 });
      alert(`Successfully bought ${quantity} shares of ${symbol}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSell = (symbol, quantity) => {
    try {
      sellStock(symbol, quantity);
      setQuantities({ ...quantities, [symbol]: 0 });
      alert(`Successfully sold ${quantity} shares of ${symbol}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const getOwnedQuantity = (symbol) => {
    const owned = portfolio.find(p => p.symbol === symbol);
    return owned ? owned.quantity : 0;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>💰 Account Balance: ${userBalance.toFixed(2)}</h2>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📈 Available Stocks</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {stocks.map(stock => (
            <div key={stock.symbol} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0', color: '#333' }}>{stock.name} ({stock.symbol})</h3>
                  <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c5aa0' }}>
                    ${stock.price.toFixed(2)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0', color: '#666' }}>Owned: {getOwnedQuantity(stock.symbol)}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantities[stock.symbol] || ''}
                  onChange={(e) => setQuantities({
                    ...quantities,
                    [stock.symbol]: parseInt(e.target.value) || 0
                  })}
                  style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    width: '100px'
                  }}
                />
                <button
                  onClick={() => handleBuy(stock.symbol, quantities[stock.symbol] || 0)}
                  disabled={!quantities[stock.symbol] || quantities[stock.symbol] <= 0}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Buy
                </button>
                <button
                  onClick={() => handleSell(stock.symbol, quantities[stock.symbol] || 0)}
                  disabled={!quantities[stock.symbol] || quantities[stock.symbol] <= 0 || getOwnedQuantity(stock.symbol) < (quantities[stock.symbol] || 0)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>💼 Portfolio</h2>
        {portfolio.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No stocks in portfolio</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {portfolio.map(stock => (
              <div key={stock.symbol} style={{
                padding: '10px',
                backgroundColor: '#e8f5e8',
                borderRadius: '4px',
                border: '1px solid #4CAF50'
              }}>
                <strong>{stock.name} ({stock.symbol})</strong> - {stock.quantity} shares
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
