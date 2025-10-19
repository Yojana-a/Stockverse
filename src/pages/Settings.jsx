import React, { useContext, useState, useEffect } from 'react';
import { StockContext } from '../context/StockContext';
import { useAuth } from '../context/AuthContext';
import ApiTest from '../components/ApiTest';

const Settings = () => {
  const { userBalance, portfolio, stocks } = useContext(StockContext);
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSave = () => {
    if (name && email) {
      updateUser({ name, email });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#F7E7CE] mb-2">Settings</h1>
        <p className="text-[#F7E7CE]/80">Manage your account preferences</p>
      </div>

      {/* API Test */}
      <ApiTest />

      {/* User Profile */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30">
        <div className="p-6 border-b border-[#D4AF37]/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#F7E7CE]">Profile Information</h2>
              <p className="text-[#F7E7CE]/80">Manage your account details</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#D4AF37] text-[#2B0A28] rounded-lg hover:bg-[#F7E7CE] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#F7E7CE] mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-5 border border-[#D4AF37]/30 rounded-lg text-[#F7E7CE] placeholder-[#F7E7CE]/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F7E7CE] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-5 border border-[#D4AF37]/30 rounded-lg text-[#F7E7CE] placeholder-[#F7E7CE]/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#F7E7CE] mb-2">Name</h3>
                <p className="text-xl text-[#F7E7CE]">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#F7E7CE] mb-2">Email</h3>
                <p className="text-xl text-[#F7E7CE]">{user?.email || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30">
        <div className="p-6 border-b border-[#D4AF37]/30">
          <h2 className="text-2xl font-bold text-[#F7E7CE]">Account Statistics</h2>
          <p className="text-[#F7E7CE]/80">Your trading performance</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#F7E7CE] mb-2">Balance</h3>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(userBalance)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F7E7CE] mb-2">Portfolio Holdings</h3>
              <p className="text-2xl font-bold text-blue-400">{portfolio.length} stocks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30">
        <div className="p-6 border-b border-[#D4AF37]/30">
          <h2 className="text-2xl font-bold text-[#F7E7CE]">Available Stocks</h2>
          <p className="text-[#F7E7CE]/80">Current market prices</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="p-4 bg-white bg-opacity-5 rounded-lg border border-[#D4AF37]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#F7E7CE]">{stock.symbol}</h3>
                  <span className="text-sm text-[#F7E7CE]/80">{stock.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#F7E7CE]">{formatCurrency(stock.price)}</p>
                  <p className="text-sm text-[#F7E7CE]/60">Live Price</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30">
        <div className="p-6 border-b border-[#D4AF37]/30">
          <h2 className="text-2xl font-bold text-[#F7E7CE]">App Information</h2>
        </div>
        <div className="p-6">
          <div className="space-y-2 text-sm text-[#F7E7CE]/80">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Status:</strong> Running</p>
            <p><strong>Environment:</strong> Development</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;