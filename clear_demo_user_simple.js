// Clear Demo User - Copy and paste this into your browser console (F12)

console.log('🧹 Clearing demo user...');

// Clear current user session
localStorage.removeItem('stockverse_user');

// Clear demo users from users array
const users = JSON.parse(localStorage.getItem('stockverse_users') || '[]');
const filteredUsers = users.filter(user => user.email !== 'demo@stockverse.com');
localStorage.setItem('stockverse_users', JSON.stringify(filteredUsers));

console.log('✅ Demo user cleared!');
console.log('🔄 Refreshing page...');

// Refresh the page
window.location.reload();
