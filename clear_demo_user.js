// Clear Demo User Script
// Copy and paste this into your browser console (F12)

console.log('🧹 Clearing demo user from localStorage...');

// Show current users
const currentUsers = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
console.log('Current users:', currentUsers);

// Remove demo user specifically
const filteredUsers = currentUsers.filter(user => user.email !== 'demo@stockverse.com');
localStorage.setItem('stockverse_users', JSON.stringify(filteredUsers));

// Clear current user session
localStorage.removeItem('stockverse_user');

console.log('✅ Demo user cleared!');
console.log('🔄 Please refresh the page and sign up with your own account.');

// Show remaining users
const remainingUsers = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
console.log('Remaining users:', remainingUsers);