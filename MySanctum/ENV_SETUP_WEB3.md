# Environment Variables Setup for Web3 Auth

## Required Variables

Add these to your `.env.local` file in the `apps/frontend` directory:

```env
# Supabase Configuration (you already have these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# ⚠️ NEW: Required for Web3 Authentication
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

## How to Get Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **MySanctum** project
3. Navigate to **Settings** → **API**
4. Copy the **service_role** key (Secret key section)

## Security Notes

⚠️ **IMPORTANT**: The service role key:
- Has full access to your database (bypasses RLS)
- Must **NEVER** be exposed to the client
- Should only be used in server-side code
- Should **NEVER** be committed to git
- Is already protected by Next.js (only available on server)

## File Location

```
/Users/bobrahmatov/Documents/main_inverus/MySanctum/apps/frontend/.env.local
```

Create this file if it doesn't exist, or add the `SUPABASE_SERVICE_ROLE` line to the existing file.

## Verify Setup

After adding the key and restarting your dev server, Web3 authentication should work!

Test by:
1. Going to `/auth`
2. Clicking "Continue with a wallet"
3. Connecting MetaMask
4. Signing the message
5. You should be authenticated! 🎉

