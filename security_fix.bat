# Security Fix Script for API Key Exposure
# Run these commands in order:

echo "Step 1: Backup your current work"
git stash

echo "Step 2: Remove .env from Git history (this will rewrite history)"
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

echo "Step 3: Force push to update remote repository"
echo "WARNING: This will rewrite Git history on the remote repository"
echo "Run: git push origin --force --all"

echo "Step 4: Restore your work"
git stash pop

echo "Step 5: Add your new API key to .env file"
echo "Edit .env file and add: VITE_ALPHA_VANTAGE_API_KEY=YOUR_NEW_API_KEY"
