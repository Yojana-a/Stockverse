// Clear Demo User Script - Copy and paste this into your browser console (F12)

console.log('🧹 Clearing demo user from localStorage...');

// Clear current user session
localStorage.removeItem('stockverse_user');

// Clear demo users from users array
const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
const filteredUsers = users.filter(user => user.email !== 'demo@stockverse.com');
localStorage.setItem('stockverse_users', JSON.stringify(filteredUsers));

console.log('✅ Demo user cleared!');
console.log('🔄 Please refresh the page and sign up with your own account.');

// Show remaining users
const remainingUsers = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
console.log('Remaining users:', remainingUsers);
