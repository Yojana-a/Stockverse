# StockContext API Documentation

## Overview
The StockContext provides a complete state management solution for a stock trading application. It includes live price simulation, portfolio management, and transaction tracking.

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Stockverse-1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## StockContext API Reference

### Context Provider
```jsx
import { StockProvider } from './context/StockContext';

function App() {
  return (
    <StockProvider>
      {/* Your app components */}
    </StockProvider>
  );
}
```

### Available State & Functions

#### State Properties
- **`stocks`**: Array of available stocks with symbol, name, and current price
- **`userBalance`**: Current cash balance (starts at $10,000)
- **`portfolio`**: Array of owned stocks with quantities
- **`transactionHistory`**: Array of all buy/sell transactions

#### Functions
- **`buyStock(symbol, quantity)`**: Purchase shares of a stock
- **`sellStock(symbol, quantity)`**: Sell shares of a stock

### Usage Example

```jsx
import React, { useContext } from 'react';
import { StockContext } from './context/StockContext';

function TradingComponent() {
  const { 
    stocks, 
    userBalance, 
    portfolio, 
    transactionHistory,
    buyStock, 
    sellStock 
  } = useContext(StockContext);

  const handleBuy = (symbol, quantity) => {
    try {
      buyStock(symbol, quantity);
      console.log(`Bought ${quantity} shares of ${symbol}`);
    } catch (error) {
      console.error('Buy failed:', error.message);
    }
  };

  const handleSell = (symbol, quantity) => {
    try {
      sellStock(symbol, quantity);
      console.log(`Sold ${quantity} shares of ${symbol}`);
    } catch (error) {
      console.error('Sell failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Balance: ${userBalance.toFixed(2)}</h2>
      
      {stocks.map(stock => (
        <div key={stock.symbol}>
          <h3>{stock.name} ({stock.symbol})</h3>
          <p>Price: ${stock.price.toFixed(2)}</p>
          <button onClick={() => handleBuy(stock.symbol, 1)}>
            Buy 1 Share
          </button>
        </div>
      ))}
      
      <h3>Portfolio:</h3>
      {portfolio.map(stock => (
        <div key={stock.symbol}>
          {stock.name}: {stock.quantity} shares
        </div>
      ))}
    </div>
  );
}
```

## Data Structures

### Stock Object
```javascript
{
  symbol: "AAPL",    // Stock symbol
  name: "Apple",     // Company name
  price: 180.50      // Current price (updates every 10 seconds)
}
```

### Portfolio Item
```javascript
{
  symbol: "AAPL",    // Stock symbol
  name: "Apple",     // Company name
  quantity: 5        // Number of shares owned
}
```

### Transaction Object
```javascript
{
  type: "buy",                    // "buy" or "sell"
  symbol: "AAPL",                 // Stock symbol
  quantity: 2,                    // Number of shares
  price: 180.50,                  // Price per share
  date: "2024-01-15T10:30:00Z",  // ISO timestamp
  totalCost: 361.00              // Total transaction value
}
```

## Features

### 🔄 Live Price Updates
- Stock prices automatically update every 10 seconds
- Random price changes between -5% and +5%
- Prices are rounded to 2 decimal places

### 💰 Balance Management
- Starts with $10,000 cash balance
- Automatically deducts/adds money on trades
- Validates sufficient funds before purchases

### 📊 Portfolio Tracking
- Tracks all owned stocks and quantities
- Automatically removes stocks when quantity reaches 0
- Real-time portfolio value calculation

### 📝 Transaction History
- Logs all buy/sell transactions
- Includes timestamps, prices, and totals
- Most recent transactions appear first

## Error Handling

The context includes built-in error handling:

- **Insufficient Balance**: Throws error when trying to buy without enough cash
- **Insufficient Shares**: Throws error when trying to sell more shares than owned
- **Invalid Stock**: Throws error when trying to trade non-existent stocks

Always wrap trading functions in try-catch blocks:

```jsx
try {
  buyStock("AAPL", 10);
} catch (error) {
  alert(`Error: ${error.message}`);
}
```

## Example Components

The repository includes two example components:

1. **`TradingDashboard.jsx`**: Complete dashboard with account summary, live prices, portfolio, and transaction history
2. **`StockList.jsx`**: Interactive trading interface with buy/sell buttons

## File Structure
```
src/
├── context/
│   └── StockContext.js      # Main context file
├── components/
│   ├── TradingDashboard.jsx  # Dashboard component
│   └── StockList.jsx         # Trading interface
├── mockStocks.js             # Stock data
└── App.jsx                   # Main app with provider
```

## Development Notes

- The context uses React's `useState` and `useEffect` hooks
- Live price updates are handled with `setInterval`
- All state updates are immutable
- The context is optimized for performance with proper cleanup

## Next Steps for Frontend Developer

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development**: `npm run dev`
4. **Review example components** in `/src/components/`
5. **Integrate StockContext** into your components
6. **Customize the UI** to match your design requirements

The StockContext is fully functional and ready to use!
