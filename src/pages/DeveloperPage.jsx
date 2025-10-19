import React from 'react';
import ApiTest from '../components/ApiTest';
import ComprehensiveApiTest from '../components/ComprehensiveApiTest';
import TransactionHistoryTest from '../components/TransactionHistoryTest';

const DeveloperPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Developer Tools</h1>
      <p className="text-gray-600 mb-6">API testing and system diagnostics for developers</p>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Single Stock API Test</h2>
        <ApiTest />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">All Stocks API Test</h2>
        <ComprehensiveApiTest />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History Test</h2>
        <TransactionHistoryTest />
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Developer Notice</h3>
        <p className="text-sm text-yellow-700">
          This page contains developer tools and API tests. These features are for debugging and system verification only.
          Regular users should not see this page in production.
        </p>
      </div>
    </div>
  );
};

export default DeveloperPage;
