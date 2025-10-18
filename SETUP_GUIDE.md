# 🚀 StockVerse Setup Guide for Frontend Developer

## Quick Start (5 minutes)

### 1. Get the Code
```bash
# Clone the repository
git clone <your-repo-url>
cd Stockverse-1

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Open in Browser
Navigate to `http://localhost:5173` to see the working application.

## What You'll See

The app includes:
- **📊 Trading Dashboard**: Account balance, portfolio value, live stock prices
- **📈 Stock List**: Interactive buy/sell interface
- **💰 Live Updates**: Stock prices change every 10 seconds
- **📝 Transaction History**: Complete trade logging

## Project Structure

```
Stockverse-1/
├── src/
│   ├── context/
│   │   └── StockContext.js      # 🧠 Main state management
│   ├── components/
│   │   ├── TradingDashboard.jsx # 📊 Dashboard component
│   │   └── StockList.jsx        # 📈 Trading interface
│   ├── mockStocks.js            # 📋 Stock data
│   ├── App.jsx                  # 🏠 Main app
│   └── main.jsx                 # 🚀 Entry point
├── STOCKCONTEXT_API.md          # 📚 Complete API documentation
└── package.json                 # 📦 Dependencies
```

## Key Files to Understand

### 1. `src/context/StockContext.js`
- **Purpose**: Complete state management for trading app
- **Features**: Live price updates, portfolio tracking, transaction history
- **Usage**: Import and use `useContext(StockContext)` in any component

### 2. `src/components/TradingDashboard.jsx`
- **Purpose**: Example of how to use the context
- **Shows**: Account summary, live prices, portfolio, transactions
- **Learn from**: How to access and display context data

### 3. `src/components/StockList.jsx`
- **Purpose**: Interactive trading interface
- **Shows**: How to use `buyStock()` and `sellStock()` functions
- **Learn from**: Error handling and user interactions

## How to Use StockContext in Your Components

### Basic Usage
```jsx
import React, { useContext } from 'react';
import { StockContext } from './context/StockContext';

function YourComponent() {
  const { 
    stocks,           // Available stocks
    userBalance,      // Cash balance
    portfolio,        // Owned stocks
    buyStock,         // Buy function
    sellStock         // Sell function
  } = useContext(StockContext);

  return (
    <div>
      <h2>Balance: ${userBalance}</h2>
      {/* Your component content */}
    </div>
  );
}
```

### Trading Example
```jsx
const handleBuy = (symbol, quantity) => {
  try {
    buyStock(symbol, quantity);
    alert('Purchase successful!');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

## Available Data

### Stocks Array
```javascript
[
  { symbol: "AAPL", name: "Apple", price: 180.50 },
  { symbol: "TSLA", name: "Tesla", price: 250.75 },
  { symbol: "GOOG", name: "Google", price: 140.25 }
]
```

### Portfolio Array
```javascript
[
  { symbol: "AAPL", name: "Apple", quantity: 5 },
  { symbol: "TSLA", name: "Tesla", quantity: 2 }
]
```

### Transaction History
```javascript
[
  {
    type: "buy",
    symbol: "AAPL",
    quantity: 2,
    price: 180.50,
    date: "2024-01-15T10:30:00Z",
    totalCost: 361.00
  }
]
```

## Features Available

### ✅ Live Price Updates
- Prices change every 10 seconds
- Random fluctuations between -5% and +5%
- Automatic UI updates

### ✅ Trading Functions
- `buyStock(symbol, quantity)` - Purchase shares
- `sellStock(symbol, quantity)` - Sell shares
- Built-in validation and error handling

### ✅ State Management
- `userBalance` - Current cash balance
- `portfolio` - Owned stocks and quantities
- `transactionHistory` - Complete trade log

### ✅ Error Handling
- Insufficient balance validation
- Insufficient shares validation
- Invalid stock symbol validation

## Customization Options

### 1. Modify Stock Data
Edit `src/mockStocks.js` to add/remove stocks:
```javascript
export const stocks = [
  { symbol: "AAPL", name: "Apple", price: 180 },
  { symbol: "TSLA", name: "Tesla", price: 250 },
  { symbol: "GOOG", name: "Google", price: 140 },
  // Add more stocks here
];
```

### 2. Change Initial Balance
Edit `src/context/StockContext.js`:
```javascript
const [userBalance, setUserBalance] = useState(10000); // Change this value
```

### 3. Adjust Price Update Frequency
Edit the interval in `StockContext.js`:
```javascript
const interval = setInterval(updateStockPrices, 10000); // 10 seconds
```

## Development Tips

### 1. Always Wrap Trading in Try-Catch
```jsx
try {
  buyStock("AAPL", 5);
} catch (error) {
  // Handle error (show alert, toast, etc.)
  console.error(error.message);
}
```

### 2. Use Real-time Data
The context automatically updates, so your components will re-render when:
- Stock prices change
- Balance changes
- Portfolio updates
- New transactions are added

### 3. Access Portfolio Value
```jsx
const portfolioValue = portfolio.reduce((total, stock) => {
  const currentStock = stocks.find(s => s.symbol === stock.symbol);
  return total + (currentStock ? currentStock.price * stock.quantity : 0);
}, 0);
```

## Next Steps

1. **Explore the example components** to understand the patterns
2. **Read the full API documentation** in `STOCKCONTEXT_API.md`
3. **Start building your UI** using the context data
4. **Test the trading functionality** to see how it works
5. **Customize the styling** to match your design requirements

## Support

- **Full API Documentation**: See `STOCKCONTEXT_API.md`
- **Example Components**: Check `src/components/` for implementation examples
- **Live Demo**: The app runs at `http://localhost:5173`

The StockContext is fully functional and ready for your frontend development! 🎉
