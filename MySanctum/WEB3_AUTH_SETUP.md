# Web3 Wallet Authentication Setup

## ✅ Implementation Complete

Web3 wallet authentication has been implemented using Supabase's admin API and ethers.js for signature verification.

## 📦 Dependencies

- **ethers.js** (~95KB) - Lightweight library for signature verification only
- No heavy Web3Modal or WalletConnect libraries needed!

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Admin (required for Web3 auth)
SUPABASE_SERVICE_ROLE=your_service_role_key_here

# Public Supabase vars (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Where to find your Service Role Key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **service_role key** (⚠️ Keep this secret!)

## 🚀 How It Works

### Frontend Flow:

1. User clicks "Continue with a wallet"
2. Browser prompts to connect wallet (MetaMask, etc.)
3. Wallet signs a message to prove ownership
4. Signature is sent to backend API

### Backend Flow:

1. Verify signature using ethers.js
2. Check if wallet address already has an account
3. If not, create new user with virtual email
4. Generate session tokens using Supabase admin
5. Set session cookies and authenticate user

## 🔐 Security Features

- ✅ **Signature Verification**: Cryptographically verify wallet ownership
- ✅ **No Password Storage**: Uses wallet signatures for authentication
- ✅ **Virtual Emails**: Each wallet gets a unique virtual email
- ✅ **Auto-Confirmed**: Web3 users are auto-confirmed (no email verification needed)
- ✅ **Metadata Storage**: Wallet address stored in user_metadata

## 📱 Supported Wallets

Works with any wallet that supports `window.ethereum`:
- MetaMask
- Coinbase Wallet
- Rainbow Wallet
- Brave Wallet
- Trust Wallet
- And many more!

## 🧪 Testing

1. Install MetaMask browser extension
2. Create or connect a wallet
3. Go to your auth page
4. Click "Continue with a wallet"
5. Approve wallet connection
6. Sign the message
7. You should be authenticated and redirected to dashboard

## 🛠️ Files Modified/Created

### Created:
- `/src/app/api/auth/web3/route.ts` - API endpoint for Web3 auth
- `/src/lib/supabase/admin.ts` - Admin client for user management

### Modified:
- `/src/components/Web3LoginButton.tsx` - Wallet connection and signing

## 📊 User Data Structure

Web3 users are stored with:

```typescript
{
  email: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb@web3.mysanctum.local",
  user_metadata: {
    wallet_address: "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    auth_method: "web3",
    referral_code: "ABC123" // if provided
  },
  email_confirmed_at: "2026-01-17T..." // auto-confirmed
}
```

## 🔍 Troubleshooting

### "No Web3 wallet detected"
- Install MetaMask or another wallet extension
- Refresh the page after installation

### "Failed to create session"
- Check that `SUPABASE_SERVICE_ROLE` is set in `.env.local`
- Verify the key is correct in Supabase dashboard
- Restart your development server after adding env vars

### "Signature verification failed"
- User may have rejected the signature request
- Try connecting again

### Wallet connects but authentication fails
- Check server logs for detailed error messages
- Verify Supabase admin permissions
- Ensure service role key is valid

## 📈 Next Steps

- [ ] Add wallet icon indicators (MetaMask logo, etc.)
- [ ] Display connected wallet address in UI
- [ ] Add "Disconnect wallet" functionality
- [ ] Support wallet switching
- [ ] Add ENS name resolution

## 💡 Notes

- Virtual emails are in format: `{wallet_address}@web3.mysanctum.local`
- Service role key has full database access - **never expose it to the client**
- Signature verification happens server-side only
- Each wallet can only have one account (prevents duplicates)

