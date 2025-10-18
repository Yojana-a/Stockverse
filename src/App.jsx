// src/App.jsx
import React from 'react';
import { StockProvider } from './context/StockContext';
import { StockList } from './components/StockList';
import { TradingDashboard } from './components/TradingDashboard';

function App() {
  return (
    <StockProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <TradingDashboard />
        <StockList />
      </div>
    </StockProvider>
  );
}

export default App;
