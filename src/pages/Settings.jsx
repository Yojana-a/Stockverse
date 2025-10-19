import React, { useState, useContext } from 'react';
import { StockContext } from '../context/StockContext';
import AlphaVantageTest from '../components/AlphaVantageTest';

const Settings = () => {
  const { userBalance, portfolio, transactionHistory } = useContext(StockContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newUsername, setNewUsername] = useState('Trader123');

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (newUsername.trim()) {
      alert('Username updated successfully!');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
      // Clear localStorage if needed
      localStorage.clear();
      
      alert('Data reset successfully! Please refresh the page to see changes.');
      setShowResetConfirm(false);
    }
  };

  const handleExportData = () => {
    const data = {
      userBalance,
      portfolio,
      transactionHistory,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `stockverse-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your trading experience</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Dark Mode</h3>
              <p className="text-gray-600">Switch between light and dark themes</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {isDarkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Note: This is a placeholder feature. Full dark mode implementation would require additional CSS.
            </p>
          </div>
        </div>
      </div>

      {/* Trading Settings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Trading Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Auto-refresh Prices</h3>
              <p className="text-gray-600">Automatically update stock prices</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Price Alerts</h3>
              <p className="text-gray-600">Get notified when stocks hit target prices</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Export Data</h3>
              <p className="text-gray-600">Download your portfolio and transaction data</p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Reset All Data</h3>
              <p className="text-gray-600">Clear your portfolio and start fresh</p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Alpha Vantage API Test */}
      <AlphaVantageTest />

      {/* App Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">App Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Version</span>
            <span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Build</span>
            <span className="font-semibold text-gray-900">HackTX 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-semibold text-gray-900">January 2025</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Reset</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all your data? This will:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• Clear your portfolio</li>
              <li>• Reset your balance to $10,000</li>
              <li>• Delete all transaction history</li>
              <li>• Reset your username</li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
