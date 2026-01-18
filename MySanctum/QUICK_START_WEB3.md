# Quick Start: Test Web3 Authentication

## 🚀 3 Steps to Test

### Step 1: Add Service Role Key to `.env.local`

Open `/Users/bobrahmatov/Documents/main_inverus/MySanctum/apps/frontend/.env.local` and add:

```env
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

**Where to find it:**
1. Go to https://supabase.com/dashboard
2. Select your MySanctum project
3. Settings → API
4. Copy the **service_role** key (not the anon key!)

### Step 2: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
cd /Users/bobrahmatov/Documents/main_inverus/MySanctum/apps/frontend
pnpm dev
```

### Step 3: Test with MetaMask

1. Install MetaMask if you haven't: https://metamask.io/download/
2. Go to your auth page: http://localhost:3000/auth
3. Click "Continue with a wallet"
4. MetaMask will popup → Click "Connect"
5. MetaMask will ask you to sign → Click "Sign"
6. You should be authenticated and redirected to dashboard! 🎉

## ✅ What Should Happen

1. **Wallet Connection**: MetaMask popup appears
2. **Sign Message**: Request to sign appears with message:
   ```
   Sign in to MySanctum
   
   Wallet Address: 0x...
   Timestamp: 2026-01-17T...
   Nonce: abc123
   ```
3. **Authentication**: User is created/logged in
4. **Redirect**: Sent to `/dashboard`
5. **Toast**: Shows "Connected: 0x1234...5678"

## 🔍 Verify It Works

Check Supabase Dashboard:
1. Go to Authentication → Users
2. You should see a new user with email like:
   ```
   0x742d35cc6634c0532925a3b844bc9e7595f0beb@web3.mysanctum.local
   ```
3. Check User Metadata → you'll see:
   ```json
   {
     "wallet_address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
     "auth_method": "web3"
   }
   ```

## 🐛 Troubleshooting

**"No Web3 wallet detected"**
→ Install MetaMask browser extension

**"Failed to create session"**
→ Check that `SUPABASE_SERVICE_ROLE` is in `.env.local`
→ Restart dev server after adding it

**MetaMask doesn't popup**
→ Click the MetaMask extension icon manually
→ Make sure MetaMask is unlocked

**Signature fails**
→ Try connecting again
→ Make sure you're signing, not rejecting

## 📦 Testing on Different Networks

Web3 auth works on any Ethereum network:
- Ethereum Mainnet
- Polygon
- Arbitrum
- Base
- Sepolia (testnet)
- etc.

Just connect with the network you want to use!

## 🎯 Next: Test Other Social Logins

Your app also supports:
- ✅ Google
- ✅ X/Twitter  
- ✅ LinkedIn
- ✅ GitHub
- ✅ Apple
- ✅ Facebook
- ✅ Email Magic Link

All social logins need OAuth credentials configured in Supabase Dashboard → Authentication → Providers.

