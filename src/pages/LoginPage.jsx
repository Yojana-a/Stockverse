import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Create demo user on first load
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
    const demoUser = users.find(u => u.email === 'demo@stockverse.com');
    
    if (!demoUser) {
      signup('Demo User', 'demo@stockverse.com', 'demo123');
    }
  }, [signup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] text-[#F7E7CE]">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md w-full border border-[#D4AF37]/30">
        <h2 className="text-3xl font-bold text-center text-[#F7E7CE] mb-6">Login to StockVerse</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#F7E7CE] mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white bg-opacity-5 border border-[#D4AF37]/30 rounded-lg text-[#F7E7CE] placeholder-[#F7E7CE]/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#F7E7CE] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white bg-opacity-5 border border-[#D4AF37]/30 rounded-lg text-[#F7E7CE] placeholder-[#F7E7CE]/70 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4AF37] text-[#2B0A28] py-2 px-4 rounded-lg font-semibold hover:bg-[#F7E7CE] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-[#F7E7CE]/80 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#D4AF37] hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="text-center text-xs text-[#F7E7CE]/60 mt-4">
          Demo User: demo@stockverse.com / demo123
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
