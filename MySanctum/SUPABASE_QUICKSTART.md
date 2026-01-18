# MySanctum Supabase Quick Start Guide

## 🚀 Initial Setup (5 minutes)

### Step 1: Run the Database Schema

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. Select your **MySanctum project**
3. Navigate to **SQL Editor** (left sidebar)
4. Click **+ New Query**
5. Open the file: `/MySanctum/SUPABASE_SETUP.sql`
6. **Copy all the SQL** and paste it into the editor
7. Click **Run** (or press `Cmd/Ctrl + Enter`)

✅ You should see: "Success. No rows returned"

### Step 2: Configure Authentication Providers

Go to **Authentication** → **Providers** in your Supabase Dashboard

#### Enable Email (Magic Link)
- ✅ Already enabled by default
- Configure email templates if desired

#### Enable Google OAuth
1. Click **Google** provider
2. Enable it
3. Add your OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
   - **Redirect URL**: Copy from Supabase (looks like: `https://your-project.supabase.co/auth/v1/callback`)

#### Enable GitHub OAuth
1. Click **GitHub** provider
2. Enable it
3. Add your OAuth credentials from GitHub

#### Enable Other Providers (Optional)
- **X/Twitter**: Enable and configure
- **LinkedIn**: Enable and configure
- **Facebook**: Enable and configure
- **Apple**: Enable and configure

### Step 3: Add Environment Variable

Add your Supabase Service Role Key to `.env.local`:

```bash
cd /Users/bobrahmatov/Documents/main_inverus/MySanctum/apps/frontend

# Create or edit .env.local
nano .env.local
```

Add these lines:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Required for Web3 Authentication
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

**Where to find these:**
- Go to **Settings** → **API** in Supabase Dashboard
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API keys → anon public
- `SUPABASE_SERVICE_ROLE`: Project API keys → service_role (⚠️ Keep secret!)

### Step 4: Restart Dev Server

```bash
cd /Users/bobrahmatov/Documents/main_inverus/MySanctum/apps/frontend
pnpm dev
```

## 🎯 What Was Created

### Tables:

1. **`profiles`** - User profiles with wallet addresses
   - Stores user info, preferences, metadata
   - Links to `auth.users`

2. **`data_connections`** - Connected apps and services
   - Tracks Facebook, Google, X, Banks, etc.
   - Stores permissions and access status
   - OAuth tokens (encrypted)

3. **`audit_logs`** - Security and access logs
   - Tracks all data access
   - Permission changes
   - Security events

4. **`user_settings`** - User preferences
   - Theme, language, notifications
   - Privacy settings

### Storage Buckets:

1. **`avatars`** - Public user avatars (5MB limit)
2. **`user_documents`** - Private encrypted documents (50MB limit)

### Automatic Features:

- ✅ **Auto-create profile** on user signup
- ✅ **Auto-create settings** on user signup
- ✅ **Auto-update timestamps** on record changes
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Secure policies** - users can only access their own data

## 🧪 Test Your Setup

### 1. Test Email Magic Link:

```bash
# Go to: http://localhost:3000/auth
# Enter your email
# Click "Send magic link"
# Check your email and click the link
```

### 2. Test Google OAuth:

```bash
# Go to: http://localhost:3000/auth
# Click "Continue with Google"
# Sign in with Google
```

### 3. Test Web3 Wallet:

```bash
# Install MetaMask: https://metamask.io/download/
# Go to: http://localhost:3000/auth
# Click "Continue with a wallet"
# Connect MetaMask and sign the message
```

## 📊 View Your Data

After signing up, check your Supabase Dashboard:

1. **Table Editor** → **profiles**
   - You should see your user profile

2. **Table Editor** → **user_settings**
   - Default settings for your user

3. **Authentication** → **Users**
   - Your user account

## 🔒 Security Notes

### ✅ What's Protected:

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Service role key is server-side only
- Storage buckets are protected by RLS

### ⚠️ Important:

- **NEVER** commit `.env.local` to git (already in .gitignore)
- **NEVER** expose `SUPABASE_SERVICE_ROLE` to the client
- Keep OAuth secrets secure

## 🐛 Troubleshooting

### "relation does not exist" error
→ Run the `SUPABASE_SETUP.sql` file again

### "JWT expired" or auth errors
→ Check that your Supabase URL and keys are correct

### OAuth "redirect_uri mismatch"
→ Make sure the redirect URL in your OAuth provider matches Supabase's callback URL

### Web3 login not working
→ Ensure `SUPABASE_SERVICE_ROLE` is set in `.env.local`

### Profile not created on signup
→ Check if the trigger exists: Run this in SQL Editor:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

## 📚 Next Steps

1. ✅ Complete this setup
2. 🎨 Customize the schema for your specific needs
3. 🔗 Add more OAuth providers
4. 📱 Set up mobile app authentication
5. 🔐 Implement data encryption for sensitive fields

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check `WEB3_AUTH_SETUP.md` for Web3 authentication details

---

## 🎉 All Done!

Your MySanctum database is ready! Try signing in at:
**http://localhost:3000/auth**

