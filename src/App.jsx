
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BuySell from './pages/BuySell';
import Account from './pages/Account';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DeveloperPage from './pages/DeveloperPage';
import { StockProvider } from './context/StockContext';
import './App.css';

function App() {
  return (
    <StockProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/developer" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <DeveloperPage />
                </main>
              </>
            } />
            <Route path="/" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Dashboard />
                </main>
              </>
            } />
            <Route path="/dashboard" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Dashboard />
                </main>
              </>
            } />
            <Route path="/buy-sell" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <BuySell />
                </main>
              </>
            } />
            <Route path="/account" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Account />
                </main>
              </>
            } />
            <Route path="/settings" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <SettingsPage />
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </StockProvider>
  );
}

export default App;
