import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/buy-sell', icon: '💰', label: 'Buy/Sell' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
    { path: '/account', icon: '👤', label: 'Account' },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  const handleNavClick = (path) => {
    console.log('Navigating to:', path);
    console.log('Current location:', location.pathname);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">
              📈 Stockverse
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
            
            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            
            {!user && (
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
