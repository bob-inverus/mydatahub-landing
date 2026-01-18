# 🔍 OAuth Provider Data Collection Reference

## Overview
This document shows what data MySanctum collects from each OAuth provider and where it's stored.

---

## 📊 Data Flow

```
OAuth Provider (Google, GitHub, etc.)
         ↓
Supabase auth.users table
  • raw_user_meta_data (JSON)
  • raw_app_meta_data (JSON)
  • email, phone, etc.
         ↓
Trigger: handle_new_user()
         ↓
profiles table
  • full_name
  • avatar_url
  • wallet_address
         ↓
Function: initialize_vault_with_auth_data()
         ↓
vault_data_items table
  • Individual data items
  • Categorized and labeled
  • Complete metadata as JSON
```

---

## 🔐 Provider-Specific Data Collection

### **Google OAuth**
**Metadata Keys:** (in `raw_user_meta_data`)
```json
{
  "email": "user@gmail.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "sub": "1234567890"  // Google User ID
}
```

**Collected in Vault:**
- ✅ Email → `profile/text/Primary Email`
- ✅ Name → `profile/text/Full Name`
- ✅ Picture → `profile/image/Profile Picture`
- ✅ Google ID → `credentials/text/google User ID`
- ✅ Complete JSON → `profile/json/Complete google Profile`

---

### **GitHub OAuth**
**Metadata Keys:**
```json
{
  "avatar_url": "https://avatars.githubusercontent.com/u/...",
  "bio": "Developer | Open Source Enthusiast",
  "blog": "https://myblog.com",
  "company": "@MyCompany",
  "email": "user@example.com",
  "html_url": "https://github.com/username",
  "location": "San Francisco, CA",
  "name": "John Doe",
  "user_name": "johndoe",  // GitHub username
  "id": "12345678"  // GitHub User ID
}
```

**Collected in Vault:**
- ✅ Email → `profile/text/Primary Email`
- ✅ Name → `profile/text/Full Name`
- ✅ Avatar → `profile/image/Profile Picture`
- ✅ Username → `social/text/GitHub Username`
- ✅ Profile URL → `social/text/github Profile URL`
- ✅ Bio → `profile/text/Bio`
- ✅ Location → `profile/text/Location`
- ✅ Website → `profile/text/Website`
- ✅ Company → `profile/text/Company`
- ✅ GitHub ID → `credentials/text/github User ID`
- ✅ Complete JSON → `profile/json/Complete github Profile`

---

### **LinkedIn OAuth**
**Metadata Keys:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://media.licdn.com/...",
  "sub": "linkedin-user-id"
}
```

**Collected in Vault:**
- ✅ Email → `profile/text/Primary Email`
- ✅ Name → `profile/text/Full Name`
- ✅ Picture → `profile/image/Profile Picture`
- ✅ LinkedIn ID → `credentials/text/linkedin_oidc User ID`
- ✅ Complete JSON → `profile/json/Complete linkedin_oidc Profile`

---

### **Twitter/X OAuth**
**Metadata Keys:**
```json
{
  "name": "John Doe",
  "picture": "https://pbs.twimg.com/...",
  "preferred_username": "johndoe",  // Twitter handle
  "sub": "twitter-user-id"
}
```

**Collected in Vault:**
- ✅ Name → `profile/text/Full Name`
- ✅ Picture → `profile/image/Profile Picture`
- ✅ Handle → `social/text/Twitter Handle`
- ✅ Twitter ID → `credentials/text/twitter User ID`
- ✅ Complete JSON → `profile/json/Complete twitter Profile`

---

### **Facebook OAuth**
**Metadata Keys:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "picture": {
    "data": {
      "url": "https://platform-lookaside.fbsbx.com/..."
    }
  },
  "sub": "facebook-user-id"
}
```

**Collected in Vault:**
- ✅ Email → `profile/text/Primary Email`
- ✅ Name → `profile/text/Full Name`
- ✅ Picture → `profile/image/Profile Picture`
- ✅ Facebook ID → `credentials/text/facebook User ID`
- ✅ Complete JSON → `profile/json/Complete facebook Profile`

---

## 🗂️ Vault Data Categories

### `profile` Category
Personal identification information:
- Full Name
- Primary Email
- Profile Picture
- Phone Number
- Bio
- Location
- Website
- Company

### `social` Category
Social media identifiers:
- GitHub Username
- Twitter Handle
- LinkedIn Profile
- Provider Profile URLs

### `credentials` Category
Provider-specific IDs (marked as `is_sensitive = true`):
- Google User ID
- GitHub User ID
- LinkedIn User ID
- Twitter User ID
- Facebook User ID

### `custom` Category
User-added data items

---

## 📋 Checking Collected Data

### 1. **Check auth.users table (Raw OAuth Data)**
```sql
SELECT 
    email,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users
WHERE id = auth.uid();
```

### 2. **Check profiles table (Synced Data)**
```sql
SELECT 
    email,
    full_name,
    avatar_url,
    wallet_address
FROM public.profiles
WHERE id = auth.uid();
```

### 3. **Check vault_data_items (Organized Data)**
```sql
SELECT 
    category,
    label,
    data_value,
    source_provider,
    is_sensitive
FROM public.vault_data_items
WHERE user_id = auth.uid()
ORDER BY category, label;
```

### 4. **Check vault status**
```sql
SELECT 
    vault_name,
    is_initialized,
    initialized_at,
    storage_used_bytes
FROM public.user_vaults
WHERE user_id = auth.uid();
```

---

## 🔧 Troubleshooting

### **Problem: `avatar_url` is NULL in profiles table**

**Cause:** Old trigger only copied email

**Solution:** Run this SQL:
```sql
-- Fix the trigger
\i FIX_PROFILE_TRIGGER.sql

-- Sync existing users
SELECT * FROM sync_existing_user_profiles();
```

---

### **Problem: Not enough data in vault**

**Cause:** Old vault initialization function

**Solution:** Run this SQL:
```sql
-- Update the function
\i ENHANCED_VAULT_COLLECTION.sql

-- Re-initialize vault for current user
SELECT public.initialize_vault_with_auth_data(auth.uid());
```

---

### **Problem: Want to see what data OAuth provider gives**

**Solution:** Check raw_user_meta_data:
```sql
SELECT 
    raw_user_meta_data,
    raw_app_meta_data->>'provider' as provider
FROM auth.users
WHERE id = auth.uid();
```

---

## 🎯 Common OAuth Data Mappings

| Provider | Name Key | Avatar Key | Username Key |
|----------|----------|------------|--------------|
| Google | `name` | `picture` | N/A |
| GitHub | `name` | `avatar_url` | `user_name` |
| LinkedIn | `name` | `picture` | N/A |
| Twitter | `name` | `picture` | `preferred_username` |
| Facebook | `name` | `picture.data.url` | N/A |

---

## 🚀 Quick Fix Commands

### **Step 1: Fix Profile Sync**
```bash
# In Supabase SQL Editor:
-- Copy contents of FIX_PROFILE_TRIGGER.sql
-- Execute

-- Sync existing users:
SELECT * FROM sync_existing_user_profiles();
```

### **Step 2: Enhance Vault Collection**
```bash
# In Supabase SQL Editor:
-- Copy contents of ENHANCED_VAULT_COLLECTION.sql
-- Execute

-- Re-initialize your vault:
SELECT public.initialize_vault_with_auth_data(auth.uid());
```

### **Step 3: Verify Data**
```sql
-- Check profiles
SELECT email, full_name, avatar_url FROM profiles WHERE id = auth.uid();

-- Check vault
SELECT category, label, data_value 
FROM vault_data_items 
WHERE user_id = auth.uid();
```

---

## ✅ Expected Results

After running the fixes, you should see:

**In `profiles` table:**
```
email: user@gmail.com
full_name: John Doe
avatar_url: https://lh3.googleusercontent.com/...
```

**In `vault_data_items` table:**
```
profile | Primary Email    | user@gmail.com
profile | Full Name        | John Doe
profile | Profile Picture  | https://...
profile | Bio              | Developer & Designer
profile | Location         | San Francisco
social  | GitHub Username  | johndoe
social  | GitHub Profile URL | https://github.com/johndoe
credentials | github User ID | 12345678
```

---

## 📊 Data Privacy

**Sensitive Data (is_sensitive = true):**
- Email addresses
- Phone numbers
- Provider User IDs

**Public Data (is_sensitive = false):**
- Name
- Avatar
- Bio
- Location
- Website
- Social profiles

---

## 🔄 Re-sync Data

If you update your OAuth profile and want to refresh vault data:

```sql
-- Re-run initialization (it updates existing items)
SELECT public.initialize_vault_with_auth_data(auth.uid());

-- Or sync just the profiles table
SELECT * FROM sync_existing_user_profiles();
```

---

## 📚 Next Steps

1. ✅ Run `FIX_PROFILE_TRIGGER.sql` in Supabase
2. ✅ Run `ENHANCED_VAULT_COLLECTION.sql` in Supabase
3. ✅ Sync existing users: `SELECT * FROM sync_existing_user_profiles();`
4. ✅ Test with new signup
5. ✅ Verify data collection working

---

**Your OAuth data collection is now comprehensive and working properly!** 🎉

