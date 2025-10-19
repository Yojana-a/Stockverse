// Helper function to get account ID from Capital One API
import { apiConfig } from '../config/apiConfig';

export const getAccountId = async () => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/accounts`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.nessieApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Available accounts:', data);
    
    // Return the first account ID (you can modify this logic)
    if (data.length > 0) {
      return data[0]._id;
    } else {
      throw new Error('No accounts found');
    }
  } catch (error) {
    console.error('Error fetching account ID:', error);
    throw error;
  }
};

// Test function to verify API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/accounts`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.nessieApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ API connection successful!');
      return true;
    } else {
      console.log('❌ API connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ API connection error:', error.message);
    return false;
  }
};
