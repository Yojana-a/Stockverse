// Real Capital One Nessie API integration
import { apiConfig } from '../config/apiConfig';

export const nessieApiConfig = {
  baseUrl: apiConfig.baseUrl,
  apiKey: apiConfig.nessieApiKey,
  accountId: apiConfig.accountId,
  environment: apiConfig.environment,
  endpoints: {
    accounts: "/accounts",
    transactions: "/transactions",
    deposits: "/deposits",
    withdrawals: "/withdrawals"
  }
};

// Real API call to fetch bank transactions
export const fetchBankTransactions = async () => {
  try {
    const response = await fetch(
      `${nessieApiConfig.baseUrl}/accounts/${nessieApiConfig.accountId}/transactions`, 
      {
        headers: {
          'Authorization': `Bearer ${nessieApiConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Bank transactions fetched successfully"
    };
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
};

// Real API call to post a transaction
export const postBankTransaction = async (transaction) => {
  try {
    const response = await fetch(
      `${nessieApiConfig.baseUrl}/accounts/${nessieApiConfig.accountId}/transactions`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${nessieApiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Transaction posted successfully"
    };
  } catch (error) {
    console.error('Error posting transaction:', error);
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
};

// Get account information
export const fetchAccountInfo = async () => {
  try {
    const response = await fetch(
      `${nessieApiConfig.baseUrl}/accounts/${nessieApiConfig.accountId}`, 
      {
        headers: {
          'Authorization': `Bearer ${nessieApiConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Account info fetched successfully"
    };
  } catch (error) {
    console.error('Error fetching account info:', error);
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
};

// Create a deposit transaction
export const createDeposit = async (amount, description) => {
  const depositData = {
    medium: "balance",
    amount: amount,
    description: description
  };
  
  return await postBankTransaction(depositData);
};

// Create a withdrawal transaction
export const createWithdrawal = async (amount, description) => {
  const withdrawalData = {
    medium: "balance",
    amount: -amount, // Negative for withdrawal
    description: description
  };
  
  return await postBankTransaction(withdrawalData);
};
