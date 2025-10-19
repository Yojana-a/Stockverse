import React, { createContext, useState, useEffect } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Try real API first
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        // Fallback to mock authentication
        if (email === 'demo@stockverse.com' && password === 'password') {
          const mockUser = {
            id: 1,
            email: 'demo@stockverse.com',
            name: 'Demo User',
            balance: 10000,
            token: 'mock-token-' + Date.now()
          };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          return { success: true };
        } else {
          return { success: false, message: 'Invalid email or password' };
        }
      }
    } catch (error) {
      // Fallback to mock authentication
      if (email === 'demo@stockverse.com' && password === 'password') {
        const mockUser = {
          id: 1,
          email: 'demo@stockverse.com',
          name: 'Demo User',
          balance: 10000,
          token: 'mock-token-' + Date.now()
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
