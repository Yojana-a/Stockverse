// Mock API service for Capital One Nessie integration
// This is a placeholder for future API integration

export const mockBankTransactions = [
  {
    id: "mock-1",
    type: "deposit",
    amount: 10000,
    description: "Initial Virtual Trading Balance",
    date: "2024-01-01T00:00:00Z",
    account: "Virtual Trading Account"
  },
  {
    id: "mock-2", 
    type: "withdrawal",
    amount: 1800,
    description: "Stock Purchase - AAPL",
    date: "2024-01-15T10:30:00Z",
    account: "Virtual Trading Account"
  },
  {
    id: "mock-3",
    type: "deposit", 
    amount: 2500,
    description: "Stock Sale - TSLA",
    date: "2024-01-16T14:20:00Z",
    account: "Virtual Trading Account"
  }
];

// Function to simulate API call to Capital One Nessie
export const fetchBankTransactions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data (in real implementation, this would call the actual API)
  return {
    success: true,
    data: mockBankTransactions,
    message: "Bank transactions fetched successfully"
  };
};

// Function to simulate posting a transaction to Capital One Nessie
export const postBankTransaction = async (transaction) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock response (in real implementation, this would post to the actual API)
  return {
    success: true,
    data: {
      id: `mock-${Date.now()}`,
      ...transaction,
      date: new Date().toISOString()
    },
    message: "Transaction posted successfully"
  };
};

// Example of how to integrate with Capital One Nessie API
export const nessieApiConfig = {
  baseUrl: "https://api.nessieisreal.com",
  apiKey: "your-api-key-here", // This would be provided by Capital One
  endpoints: {
    accounts: "/accounts",
    transactions: "/transactions",
    deposits: "/deposits",
    withdrawals: "/withdrawals"
  }
};

// Real implementation would look like this:
/*
export const fetchBankTransactions = async () => {
  try {
    const response = await fetch(`${nessieApiConfig.baseUrl}/accounts/${accountId}/transactions`, {
      headers: {
        'Authorization': `Bearer ${nessieApiConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      message: "Bank transactions fetched successfully"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
};
*/
