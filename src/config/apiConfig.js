// API Configuration
// Copy this to .env file in your project root

export const apiConfig = {
  nessieApiKey: process.env.REACT_APP_NESSIE_API_KEY || 'your_api_key_here',
  accountId: process.env.REACT_APP_ACCOUNT_ID || 'your_account_id_here',
  environment: process.env.REACT_APP_NESSIE_ENVIRONMENT || 'sandbox',
  baseUrl: 'https://api.nessieisreal.com'
};

// Instructions for setting up .env file:
// 1. Create a file named .env in your project root
// 2. Add the following lines:
//    REACT_APP_NESSIE_API_KEY=your_actual_api_key
//    REACT_APP_ACCOUNT_ID=your_actual_account_id
//    REACT_APP_NESSIE_ENVIRONMENT=sandbox
// 3. Replace the placeholder values with your real credentials
// 4. Restart your development server after making changes
