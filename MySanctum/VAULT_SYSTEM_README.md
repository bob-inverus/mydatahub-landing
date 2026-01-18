# 🔐 MySanctum Vault System

## Overview

The MySanctum Vault is a secure, user-centric data storage system that automatically collects and organizes user data from OAuth providers and other sources.

---

## 🏗️ Architecture

### **Phase 1: Direct Data Collection** (✅ Implemented)
Automatically collects data from OAuth providers during signup/login:
- ✅ Email address
- ✅ Full name
- ✅ Profile picture/avatar
- ✅ Phone number
- ✅ Complete OAuth profile metadata

### **Phase 2: Agent-Based Enrichment** (🔄 Future)
Use AI agents to intelligently enrich user data:
- Social media profiles
- Professional information
- Additional context
- User-initiated data imports

### **Phase 3: User-Controlled Sharing** (🔄 Future)
Allow users to share specific data with third parties:
- Granular permissions
- Access logs and audit trails
- Revokable access
- Time-limited sharing

---

## 📊 Database Schema

### Tables

#### **`user_vaults`**
Main vault metadata for each user:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- vault_name (TEXT) - Default: "My Secure Vault"
- is_initialized (BOOLEAN)
- initialized_at (TIMESTAMP)
- encryption_status (TEXT)
- storage_used_bytes (BIGINT)
```

#### **`vault_data_items`**
Individual data items stored in the vault:
```sql
- id (UUID, Primary Key)
- vault_id (UUID, References user_vaults)
- user_id (UUID, References auth.users)
- category (TEXT) - 'profile', 'social', 'financial', 'health', etc.
- data_type (TEXT) - 'text', 'json', 'file', 'image', 'document'
- label (TEXT) - User-friendly name
- data_value (TEXT) - Simple text values
- data_json (JSONB) - Structured data
- file_url (TEXT) - Files in Supabase storage
- source (TEXT) - 'oauth_provider', 'manual', 'agent_collected'
- source_provider (TEXT) - 'google', 'github', 'facebook', etc.
- is_encrypted (BOOLEAN)
- is_sensitive (BOOLEAN)
```

---

## 🚀 Setup Instructions

### 1. **Run Database Migration**
```bash
# In Supabase SQL Editor, run:
cd MySanctum
cat VAULT_SETUP.sql | pbcopy
# Paste into Supabase SQL Editor and execute
```

### 2. **Verify Tables Created**
```sql
-- Check if tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_vaults', 'vault_data_items');
```

### 3. **Test Vault Creation**
Sign up a new user and check:
```sql
-- Check vault was auto-created
SELECT * FROM user_vaults WHERE user_id = 'YOUR_USER_ID';

-- Check data items were collected
SELECT * FROM vault_data_items WHERE user_id = 'YOUR_USER_ID';
```

---

## 💻 Frontend Usage

### Initialize Vault (Automatic)
The vault initializes automatically on the `/setting-up` page:

```tsx
import { useVaultInitialization } from '@/hooks/vault/use-vault-initialization';

function SettingUpPage() {
  const vaultInitMutation = useVaultInitialization();
  
  // Initialize vault with OAuth data
  vaultInitMutation.mutate();
}
```

### Check Vault Status
```tsx
import { useVaultStatus } from '@/hooks/vault/use-vault-initialization';

function Dashboard() {
  const { data: vault } = useVaultStatus();
  
  if (vault?.is_initialized) {
    console.log('Vault ready!', vault);
  }
}
```

### Get Vault Data
```tsx
import { useVaultData } from '@/hooks/vault/use-vault-initialization';

function ProfilePage() {
  // Get all profile data
  const { data: profileData } = useVaultData('profile');
  
  // Get all data
  const { data: allData } = useVaultData();
  
  return (
    <div>
      {profileData?.map(item => (
        <div key={item.id}>
          <strong>{item.label}:</strong> {item.data_value}
        </div>
      ))}
    </div>
  );
}
```

### Preview OAuth Data
```tsx
import { useOAuthProfileData } from '@/hooks/vault/use-vault-initialization';

function PreviewPage() {
  const { data: oauthData } = useOAuthProfileData();
  
  return (
    <div>
      <h2>{oauthData?.full_name}</h2>
      <img src={oauthData?.avatar_url} alt="Avatar" />
      <p>{oauthData?.email}</p>
    </div>
  );
}
```

---

## 🔒 Security Features

### ✅ Implemented
- **Row Level Security (RLS)**: Users can only access their own data
- **OAuth Data Isolation**: Each user's vault is completely separate
- **Automatic Cleanup**: Vault deleted when user account is deleted

### 🔄 Future Enhancements
- End-to-end encryption for sensitive data
- Zero-knowledge architecture
- Blockchain audit trails
- Multi-factor vault access

---

## 📝 Data Categories

The vault organizes data into categories:

| Category | Description | Examples |
|----------|-------------|----------|
| `profile` | Personal information | Name, email, avatar, phone |
| `social` | Social media data | Twitter, LinkedIn, Facebook |
| `financial` | Financial information | Bank accounts, payment methods |
| `health` | Health records | Medical data, fitness tracking |
| `documents` | Important documents | IDs, certificates, licenses |
| `credentials` | Login credentials | Passwords, API keys (encrypted) |
| `custom` | User-defined data | Any custom data user adds |

---

## 🎯 User Flow

```
1. User signs up with OAuth (Google, GitHub, etc.)
   ↓
2. Supabase stores auth data automatically
   ↓
3. Trigger creates empty vault in `user_vaults`
   ↓
4. User lands on `/setting-up` page
   ↓
5. Frontend calls `useVaultInitialization()`
   ↓
6. SQL function `initialize_vault_with_auth_data()` extracts:
   - Email from auth.users
   - Name from user_metadata
   - Avatar from user_metadata
   - Phone (if provided)
   - Full OAuth profile data
   ↓
7. Data items created in `vault_data_items`
   ↓
8. Vault marked as `is_initialized = true`
   ↓
9. User redirected to dashboard
   ↓
10. User can view/manage their vault data
```

---

## 🔧 Manual Vault Initialization (SQL)

If you need to manually initialize a vault:

```sql
-- Initialize vault for current user
SELECT public.initialize_vault_with_auth_data(auth.uid());

-- Initialize vault for specific user
SELECT public.initialize_vault_with_auth_data('USER_UUID_HERE');
```

---

## 📊 Data Access Patterns

### Query User's Profile Data
```sql
SELECT * FROM vault_data_items 
WHERE user_id = auth.uid() 
AND category = 'profile';
```

### Get Data by Source
```sql
SELECT * FROM vault_data_items 
WHERE user_id = auth.uid() 
AND source_provider = 'google';
```

### Find Sensitive Data
```sql
SELECT * FROM vault_data_items 
WHERE user_id = auth.uid() 
AND is_sensitive = true;
```

---

## 🚨 Troubleshooting

### Vault Not Created
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_user_vault_created';

-- Manually create vault
INSERT INTO user_vaults (user_id, vault_name)
VALUES (auth.uid(), 'My Secure Vault');
```

### No Data Items After Initialization
```sql
-- Check auth user data
SELECT email, raw_user_meta_data, raw_app_meta_data 
FROM auth.users 
WHERE id = auth.uid();

-- Manually run initialization
SELECT public.initialize_vault_with_auth_data(auth.uid());
```

### RLS Policy Issues
```sql
-- Check policies
SELECT * FROM pg_policies 
WHERE tablename IN ('user_vaults', 'vault_data_items');

-- Enable RLS if disabled
ALTER TABLE user_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_data_items ENABLE ROW LEVEL SECURITY;
```

---

## 🎨 UI Components (Coming Soon)

### VaultDashboard
Overview of vault status and data

### DataItemCard
Display individual data items

### DataSourceBadge
Show where data came from (Google, GitHub, etc.)

### PrivacyControls
Manage sharing and encryption

---

## 🌟 Future Features

1. **AI Agent Integration**
   - Automated data enrichment
   - Smart categorization
   - Duplicate detection

2. **Data Portability**
   - Export vault as JSON
   - Import from other services
   - GDPR compliance tools

3. **Advanced Encryption**
   - Client-side encryption
   - Hardware security key support
   - Biometric vault access

4. **Sharing & Permissions**
   - Share specific data items
   - Time-limited access
   - Revokable permissions

5. **Audit Trails**
   - Track all data access
   - Export audit logs
   - Compliance reports

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## ✅ Next Steps

1. **Run `VAULT_SETUP.sql` in Supabase**
2. **Test vault creation** by signing up a new user
3. **Navigate to `/setting-up`** to see initialization
4. **Check vault data** in Supabase dashboard
5. **Build vault management UI** in your dashboard

---

**Your vault system is ready!** 🎉

Users will now have secure, organized storage for all their data, automatically collected from OAuth providers and ready for future enrichment with AI agents.

