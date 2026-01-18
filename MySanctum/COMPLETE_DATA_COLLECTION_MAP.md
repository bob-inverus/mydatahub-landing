# 📊 Complete OAuth Data Collection Map

## Overview
MySanctum now collects **maximum available data** from all OAuth providers while respecting privacy and user permissions.

---

## 🔐 Providers Supported

1. **Web3 Wallets** (MetaMask, WalletConnect, etc.)
2. **Email Magic Link** (Supabase)
3. **Google**
4. **Facebook**
5. **X/Twitter**
6. **LinkedIn**
7. **GitHub**

---

## 📋 Complete Field Collection by Provider

### 1. **Web3 Wallet Authentication**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `wallet_address` | Web3 Wallet Address | credentials | ✅ |
| `public_address` | Web3 Wallet Address | credentials | ✅ |
| `chain_id` | Blockchain Network | credentials | ❌ |
| `network` | Blockchain Network | credentials | ❌ |
| `ens_name` | ENS Name | profile | ❌ |
| Complete metadata | Complete web3 Profile | profile | ❌ |

**Total Fields:** 4-6 items

---

### 2. **Email Magic Link**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `email` | Primary Email | profile | ✅ |
| `email_confirmed_at` | Email Verified | profile | ❌ |
| Complete metadata | Complete email Profile | profile | ❌ |

**Total Fields:** 2-3 items

---

### 3. **Google OAuth**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `email` | Primary Email | profile | ✅ |
| `email_verified` | Email Verified | profile | ❌ |
| `name` | Full Name | profile | ❌ |
| `given_name` | First Name | profile | ❌ |
| `family_name` | Last Name | profile | ❌ |
| `picture` | Profile Picture | profile | ❌ |
| `locale` | Preferred Language | profile | ❌ |
| `profile` | Google Profile | social | ❌ |
| `sub` | google User ID | credentials | ✅ |
| Complete metadata | Complete google Profile | profile | ❌ |

**Total Fields:** 9-10 items

---

### 4. **Facebook OAuth**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `email` | Primary Email | profile | ✅ |
| `name` | Full Name | profile | ❌ |
| `first_name` | First Name | profile | ❌ |
| `last_name` | Last Name | profile | ❌ |
| `picture.data.url` | Profile Picture | profile | ❌ |
| `gender` | Gender | profile | ❌ |
| `birthday` | Birthday | profile | ✅ |
| `link` | Facebook Profile | social | ❌ |
| `id` | Facebook ID | credentials | ✅ |
| Complete metadata | Complete facebook Profile | profile | ❌ |

**Total Fields:** 9-10 items

---

### 5. **X/Twitter OAuth**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `name` | Full Name | profile | ❌ |
| `preferred_username` | X/Twitter Handle | social | ❌ |
| `screen_name` | X/Twitter Handle | social | ❌ |
| `username` | X/Twitter Handle | social | ❌ |
| `picture` | Profile Picture | profile | ❌ |
| `description` | Twitter Bio | profile | ❌ |
| `followers_count` | Twitter Followers | social | ❌ |
| `verified` | Twitter Verified | social | ❌ |
| `sub` | twitter User ID | credentials | ✅ |
| Complete metadata | Complete twitter Profile | profile | ❌ |

**Total Fields:** 8-10 items

---

### 6. **LinkedIn OAuth**

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `email` | Primary Email | profile | ✅ |
| `name` | Full Name | profile | ❌ |
| `given_name` | First Name | profile | ❌ |
| `family_name` | Last Name | profile | ❌ |
| `picture` | Profile Picture | profile | ❌ |
| `profile_url` | LinkedIn Profile | social | ❌ |
| `sub` | linkedin_oidc User ID | credentials | ✅ |
| Complete metadata | Complete linkedin_oidc Profile | profile | ❌ |

**Total Fields:** 7-8 items

---

### 7. **GitHub OAuth** (Most Comprehensive!)

| Field | Vault Label | Category | Sensitive |
|-------|-------------|----------|-----------|
| `email` | Primary Email | profile | ✅ |
| `name` | Full Name | profile | ❌ |
| `avatar_url` | Profile Picture | profile | ❌ |
| `user_name` / `login` | GitHub Username | social | ❌ |
| `html_url` | GitHub Profile URL | social | ❌ |
| `bio` | Bio | profile | ❌ |
| `location` | Location | profile | ❌ |
| `blog` / `website` | Website | profile | ❌ |
| `company` | Company | profile | ❌ |
| `public_repos` | GitHub Public Repos | social | ❌ |
| `followers` | GitHub Followers | social | ❌ |
| `following` | GitHub Following | social | ❌ |
| `hireable` | Available for Hire | profile | ❌ |
| `twitter_username` | Twitter Username (from GitHub) | social | ❌ |
| `id` | github User ID | credentials | ✅ |
| Complete metadata | Complete github Profile | profile | ❌ |

**Total Fields:** 14-16 items ⭐

---

## 📊 Data Collection Summary

| Provider | Basic Fields | Extended Fields | Total Items |
|----------|--------------|-----------------|-------------|
| Web3 Wallet | 2-3 | 2-3 | **4-6** |
| Email | 1-2 | 1 | **2-3** |
| Google | 3-4 | 5-6 | **9-10** |
| Facebook | 3-4 | 5-6 | **9-10** |
| X/Twitter | 3-4 | 5-6 | **8-10** |
| LinkedIn | 3-4 | 3-4 | **7-8** |
| GitHub | 5-6 | 9-10 | **14-16** ⭐ |

---

## 🏷️ Data Categories

### `profile` Category
Personal information:
- Full Name (First + Last)
- Email
- Phone Number
- Profile Picture/Avatar
- Bio/Description
- Location
- Website
- Company
- Gender
- Birthday (sensitive)
- Language/Locale
- Verified Status
- Hire Status

### `social` Category
Social media identifiers:
- GitHub Username
- Twitter Handle
- LinkedIn Profile URL
- Facebook Profile URL
- Profile URLs
- Follower/Following Counts
- Public Repos Count
- Verified Badges

### `credentials` Category
Provider-specific IDs (ALL marked `is_sensitive = true`):
- Google User ID (`sub`)
- GitHub User ID (`id`)
- Facebook ID
- Twitter ID
- LinkedIn ID
- Web3 Wallet Address
- Provider Access Tokens (future)

### `custom` Category
User-added data

---

## 🔒 Privacy & Security

### Sensitive Data (`is_sensitive = true`)
- ✅ Email addresses
- ✅ Phone numbers
- ✅ Wallet addresses
- ✅ Provider User IDs
- ✅ Birthdays

### Public Data (`is_sensitive = false`)
- ✅ Name
- ✅ Avatar/Picture
- ✅ Bio
- ✅ Location
- ✅ Website
- ✅ Company
- ✅ Social profiles
- ✅ Follower counts

---

## 📝 Example: What Gets Collected

### Scenario: User signs in with GitHub

**Raw OAuth Data (from GitHub):**
```json
{
  "login": "johndoe",
  "id": 12345678,
  "avatar_url": "https://avatars.githubusercontent.com/u/12345678",
  "name": "John Doe",
  "company": "@MySanctum",
  "blog": "https://johndoe.com",
  "location": "San Francisco, CA",
  "email": "john@example.com",
  "hireable": true,
  "bio": "Full-stack developer | Open source enthusiast",
  "twitter_username": "johndoe",
  "public_repos": 42,
  "followers": 123,
  "following": 45,
  "html_url": "https://github.com/johndoe"
}
```

**Stored in Vault:**
```
✅ profiles.avatar_url: https://avatars.githubusercontent.com/...
✅ profiles.full_name: John Doe
✅ profiles.email: john@example.com

✅ vault_data_items:
   1. profile | Primary Email | john@example.com (sensitive)
   2. profile | Full Name | John Doe
   3. profile | Profile Picture | https://avatars...
   4. profile | Bio | Full-stack developer...
   5. profile | Location | San Francisco, CA
   6. profile | Website | https://johndoe.com
   7. profile | Company | @MySanctum
   8. profile | Available for Hire | true
   9. social | GitHub Username | johndoe
   10. social | GitHub Profile URL | https://github.com/johndoe
   11. social | GitHub Public Repos | 42
   12. social | GitHub Followers | 123
   13. social | GitHub Following | 45
   14. social | Twitter Username (from GitHub) | @johndoe
   15. credentials | github User ID | 12345678 (sensitive)
   16. profile | Complete github Profile | {full JSON}
```

**Total: 16 items collected!** 🎉

---

## 🧪 Testing Data Collection

### 1. Check Raw OAuth Data
```sql
SELECT 
    email,
    raw_user_meta_data,
    raw_app_meta_data->>'provider' as provider
FROM auth.users
WHERE id = auth.uid();
```

### 2. Check Profiles Table
```sql
SELECT 
    email,
    full_name,
    avatar_url,
    wallet_address,
    created_at
FROM public.profiles
WHERE id = auth.uid();
```

### 3. Check Vault Items (Organized View)
```sql
SELECT 
    category,
    label,
    data_value,
    source_provider,
    is_sensitive,
    collected_at
FROM public.vault_data_items
WHERE user_id = auth.uid()
ORDER BY category, label;
```

### 4. Check Collection Summary
```sql
SELECT 
    category,
    COUNT(*) as item_count,
    source_provider
FROM public.vault_data_items
WHERE user_id = auth.uid()
GROUP BY category, source_provider
ORDER BY category;
```

### 5. Check Vault Status
```sql
SELECT 
    vault_name,
    is_initialized,
    initialized_at,
    last_synced_at,
    (SELECT COUNT(*) FROM vault_data_items WHERE vault_id = user_vaults.id) as total_items
FROM public.user_vaults
WHERE user_id = auth.uid();
```

---

## 🔄 Re-Initialize Vault

If you want to refresh data collection (after updating the SQL function):

```sql
-- Re-run collection for current user
SELECT public.initialize_vault_with_auth_data(auth.uid());

-- Check results
SELECT category, label, data_value 
FROM vault_data_items 
WHERE user_id = auth.uid()
ORDER BY category, collected_at DESC;
```

---

## 📈 Expected Results by Provider

### Google User:
- **Minimum:** 4 items (email, name, picture, ID)
- **Expected:** 9-10 items
- **Includes:** First/last name, locale, profile URL

### GitHub User:
- **Minimum:** 5 items (email, name, avatar, username, ID)
- **Expected:** 14-16 items ⭐
- **Includes:** Bio, location, company, website, followers, repos, hireable status

### Facebook User:
- **Minimum:** 4 items (email, name, picture, ID)
- **Expected:** 9-10 items
- **Includes:** First/last name, gender, birthday, profile link

### Twitter User:
- **Minimum:** 3 items (name, handle, picture)
- **Expected:** 8-10 items
- **Includes:** Bio, followers, verified status

### LinkedIn User:
- **Minimum:** 4 items (email, name, picture, ID)
- **Expected:** 7-8 items
- **Includes:** First/last name, profile URL

### Web3 User:
- **Minimum:** 1 item (wallet address)
- **Expected:** 4-6 items
- **Includes:** Chain ID, network, ENS name

---

## ⚡ Performance Notes

- **Collection happens once** during vault initialization
- **No API calls** - all data from Supabase auth cache
- **Instant retrieval** - all data in local database
- **Future sync** can be triggered manually or scheduled

---

## 🎯 Next Features

### Phase 2: Agent-Based Enrichment
- Fetch additional public data from APIs
- Cross-reference social profiles
- Validate and update stale information
- Smart categorization using AI

### Phase 3: User-Controlled Sharing
- Share specific vault items with third parties
- Time-limited access tokens
- Audit logs for all access
- Revokable permissions

---

## ✅ Implementation Checklist

- [x] Run `FIX_PROFILE_TRIGGER.sql`
- [x] Run `ENHANCED_VAULT_COLLECTION.sql`
- [ ] Sign up with each provider to test
- [ ] Verify data collection for each
- [ ] Check sensitive data is marked correctly
- [ ] Test re-initialization works
- [ ] Build vault viewer UI

---

**Your vault now collects maximum available data from all OAuth providers!** 🚀

Each provider gives different data, but we're collecting everything they offer while respecting privacy and security. 🔒

