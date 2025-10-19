import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  console.log('SettingsPage is rendering');
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">App Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <button className="bg-gray-200 rounded-full p-1 w-12 h-6">
              <div className="bg-white rounded-full w-4 h-4 shadow transform transition-transform"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Notifications</span>
            <button className="bg-blue-600 rounded-full p-1 w-12 h-6">
              <div className="bg-white rounded-full w-4 h-4 shadow transform transition-transform translate-x-6"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Auto-refresh</span>
            <button className="bg-blue-600 rounded-full p-1 w-12 h-6">
              <div className="bg-white rounded-full w-4 h-4 shadow transform transition-transform translate-x-6"></div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">App Information</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Version</span>
            <span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-semibold text-gray-900">Today</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data Source</span>
            <span className="font-semibold text-gray-900">Real-time API</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;