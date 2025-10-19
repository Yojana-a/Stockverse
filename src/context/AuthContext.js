import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('stockverse_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('stockverse_user', JSON.stringify(foundUser));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const signup = (name, email, password) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User already exists with this email' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      balance: 10000, // Starting balance
      createdAt: new Date().toISOString()
    };

    // Save user to users array
    users.push(newUser);
    localStorage.setItem('stockverse_users', JSON.stringify(users));

    // Log in the new user
    setUser(newUser);
    localStorage.setItem('stockverse_user', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stockverse_user');
  };

  const clearDemoUsers = () => {
    // Remove demo users from the users array
    const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
    const filteredUsers = users.filter(u => u.email !== 'demo@stockverse.com');
    localStorage.setItem('stockverse_users', JSON.stringify(filteredUsers));
    
    // If current user is demo user, log them out
    if (user && user.email === 'demo@stockverse.com') {
      setUser(null);
      localStorage.removeItem('stockverse_user');
    }
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('stockverse_user', JSON.stringify(newUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
    const updatedUsers = users.map(u => u.id === user.id ? newUser : u);
    localStorage.setItem('stockverse_users', JSON.stringify(updatedUsers));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    clearDemoUsers,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
