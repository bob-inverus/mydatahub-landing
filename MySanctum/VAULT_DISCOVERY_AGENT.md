# 🤖 Vault Discovery Agent System

## Overview

The Vault Discovery Agent is an intelligent system that automatically discovers additional user data from OAuth providers that wasn't captured during initial authentication. It presents this data to users during the vault setup process, allowing them to selectively integrate items into their secure vault.

## How It Works

### 1. **Initial Vault Initialization**
When a user first logs in, the system:
- Creates a vault entry in `user_vaults`
- Runs `initialize_vault_with_auth_data()` to collect core data
- Stores basic profile information (email, name, avatar)

### 2. **Discovery Phase**
After initialization, the Discovery Agent:
- Analyzes the user's `raw_user_meta_data` from Supabase Auth
- Identifies additional fields available from the OAuth provider
- Excludes data already stored in `vault_data_items`
- Presents discoverable items with descriptions and sensitivity flags

### 3. **Selective Integration**
Users can:
- Review each discoverable item individually
- See the source provider and data description
- Choose which items to integrate (one-by-one or skip all)
- Watch animated feedback during integration

## Architecture

### Frontend Components

#### **Setting-Up Page** (`/app/setting-up/page.tsx`)
The main orchestrator with 4 phases:
1. **Checking**: Verifies user authentication
2. **Initializing**: Creates vault and collects core data
3. **Discovery**: Shows discoverable items with integrate buttons
4. **Success**: Confirms completion and redirects to dashboard

#### **Discovery Hook** (`/hooks/vault/use-vault-discovery.ts`)
Provides three main hooks:

```typescript
// Discovers items not yet in vault
const { data: discoverableItems, isLoading } = useVaultDiscovery();

// Integrates a single item
const integrateMutation = useIntegrateVaultItem();

// Integrates multiple items at once
const integrateMultipleMutation = useIntegrateMultipleItems();
```

### Data Flow

```
1. User logs in via OAuth
   ↓
2. Supabase Auth stores raw_user_meta_data
   ↓
3. initialize_vault_with_auth_data() runs
   ↓
4. Core data saved to vault_data_items
   ↓
5. User lands on /setting-up
   ↓
6. Discovery Agent analyzes raw_user_meta_data
   ↓
7. Compares with existing vault_data_items
   ↓
8. Presents missing data items
   ↓
9. User selects items to integrate
   ↓
10. Items saved to vault_data_items
```

## Discoverable Data by Provider

### **Google** (`provider: 'google'`)
- Preferred Language (`locale`)
- Google Profile URL (`profile`)
- First Name (`given_name`)
- Last Name (`family_name`)

### **GitHub** (`provider: 'github'`)
- Username (`user_name` / `login`)
- Bio (`bio`)
- Location (`location`)
- Website (`blog` / `website`)
- Company (`company`)
- Public Repositories count (`public_repos`)
- Followers (`followers`)
- Following (`following`)
- Hiring Availability (`hireable`)
- Linked Twitter Username (`twitter_username`)

### **Facebook** (`provider: 'facebook'`)
- First Name (`first_name`)
- Last Name (`last_name`)
- Gender (`gender`)
- Birthday (`birthday`) - marked as sensitive
- Facebook Profile Link (`link`)

### **Twitter/X** (`provider: 'twitter'`)
- Handle (`preferred_username` / `screen_name` / `username`)
- Bio (`description`)
- Followers Count (`followers_count`)
- Verification Status (`verified`)

### **LinkedIn** (`provider: 'linkedin_oidc'`)
- First Name (`given_name`)
- Last Name (`family_name`)
- Profile URL (`profile_url`)

### **Web3 Wallets**
- Wallet Address (`wallet_address` / `public_address`) - marked as sensitive
- Blockchain Network (`chain_id` / `network`)
- ENS Name (`ens_name` / `ens`)

### **Phone** (Universal)
- Phone Number (from `auth.users.phone`) - marked as sensitive

## UI/UX Features

### Discoverable Item Card
Each item displays:
- **Icon**: Visual emoji representing the data type
- **Label**: User-friendly name (e.g., "GitHub Bio")
- **Description**: What the data represents
- **Source Provider**: Where it came from (e.g., "github")
- **Sensitivity Badge**: For sensitive data like birthdays, wallets
- **Integrate Button**: Primary action with loading state

### Loading States
- **Discovering**: Shows animated MySanctum logo while analyzing
- **Integrating**: Button shows spinner with "Integrating..." text
- **Success**: Green checkmark with success message

### Empty State
If no additional data is found:
- Shows success icon
- Message: "All available data has been collected!"
- Button to continue to dashboard

## Database Schema

### **vault_data_items** Table
```sql
CREATE TABLE public.vault_data_items (
    id UUID PRIMARY KEY,
    vault_id UUID REFERENCES user_vaults(id),
    user_id UUID REFERENCES auth.users(id),
    category TEXT, -- 'profile', 'social', 'credentials', etc.
    data_type TEXT, -- 'text', 'json'
    label TEXT, -- Display name
    data_value TEXT, -- String values
    data_json JSONB, -- Structured data
    source TEXT, -- 'oauth_provider'
    source_provider TEXT, -- 'google', 'github', etc.
    is_sensitive BOOLEAN,
    -- ... other fields
);
```

## Implementation Details

### Agent Logic (`useVaultDiscovery`)
The agent uses a smart filtering approach:

1. **Fetch existing vault items** to avoid duplicates
2. **Create a Set of existing labels** for O(1) lookup
3. **Iterate through raw_user_meta_data** fields
4. **Apply provider-specific extraction logic**
5. **Only add items not in the existing Set**

### Helper Function: `addItem`
```typescript
const addItem = (
  label: string,
  value: any,
  category: string,
  source: string,
  description: string,
  isSensitive: boolean = false,
  icon?: string
) => {
  if (value && !existingLabels.has(label)) {
    discoverable.push({ /* ... */ });
  }
};
```

### Integration Process
```typescript
const handleIntegrateItem = async (item: DiscoverableItem) => {
  // 1. Add to integrating set (UI shows loading)
  setIntegratingItems(prev => new Set(prev).add(item.id));
  
  try {
    // 2. Call mutation to insert into vault
    await integrateMutation.mutateAsync(item);
    
    // 3. Show success toast
    toast.success(`${item.label} integrated successfully!`);
    
    // 4. Remove from integrating set
    setIntegratingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(item.id);
      return newSet;
    });
  } catch (error) {
    // Handle error
  }
};
```

## Security Considerations

### Sensitive Data Handling
- Items marked as `is_sensitive: true` show a badge
- Examples: birthdays, phone numbers, wallet addresses
- Users explicitly choose to integrate these

### Row Level Security
All vault data is protected by RLS:
```sql
CREATE POLICY "Users can view their own vault data"
  ON vault_data_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault data"
  ON vault_data_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Provider Trust
- Data comes directly from Supabase Auth
- No third-party API calls during discovery
- All data was already validated during OAuth flow

## Error Handling

### Vault Not Found
If user somehow reaches discovery without a vault:
```typescript
if (vaultError || !vault) {
  throw new Error('Vault not found. Please complete vault setup first.');
}
```

### Integration Failures
- Toast notification shows error
- Item removed from "integrating" state
- User can retry integration

### Backend Unavailable
If vault tables don't exist:
- User sees error state
- Can continue to dashboard anyway
- System will retry later

## Future Enhancements

### 1. **AI-Powered Enrichment**
- Use LLM to analyze profile data and suggest categories
- Infer missing data from existing data
- Recommend data to collect based on user's other providers

### 2. **External Data Sources**
- LinkedIn profile scraping (with consent)
- Twitter/X API for extended profile data
- GitHub contributions and activity analysis

### 3. **Scheduled Re-Discovery**
- Periodic checks for new data from providers
- Notifications when new data is available
- One-click bulk integration

### 4. **Data Quality Scoring**
- Score completeness of user's vault
- Suggest missing data points
- Gamification: "Your vault is 85% complete"

### 5. **Cross-Provider Deduplication**
- Detect when same data comes from multiple providers
- Let user choose preferred source
- Merge data intelligently

## Testing

### Manual Testing Steps
1. **Sign up with Google**
   - Verify core data (email, name, avatar) is collected
   - Check that locale and profile URL are in discovery
   
2. **Sign up with GitHub**
   - Verify bio, location, company appear in discovery
   - Integrate bio individually
   - Skip remaining items
   - Confirm navigation to dashboard

3. **Sign up with Web3**
   - Verify wallet address is marked as sensitive
   - Check ENS name detection (if available)

4. **Already Initialized User**
   - Revisit `/setting-up`
   - Verify it still shows discovery (not just redirect)
   - Confirm no duplicate items appear

### Query to Check Collected Data
```sql
SELECT 
  category,
  label,
  data_value,
  source_provider,
  is_sensitive
FROM vault_data_items
WHERE user_id = 'YOUR_USER_ID'
ORDER BY category, label;
```

## Troubleshooting

### "No items discovered"
- Check `auth.users.raw_user_meta_data` in Supabase
- Verify provider is returning data
- Confirm vault initialization ran successfully

### "Vault not found" error
- User may have skipped vault setup
- Run `SELECT * FROM user_vaults WHERE user_id = 'USER_ID'`
- If missing, manually call `initialize_vault_with_auth_data()`

### Items not integrating
- Check RLS policies on `vault_data_items`
- Verify user is authenticated (`auth.uid()` is set)
- Check browser console for detailed error messages

## Conclusion

The Vault Discovery Agent provides a seamless, user-controlled way to enhance vault data collection. By analyzing OAuth metadata and presenting options clearly, it ensures users maintain control while maximizing the value of their secure vault.

**Key Benefits:**
✅ **User Control**: Selective integration, not automatic
✅ **Transparency**: Clear descriptions of what each item is
✅ **Security**: Sensitive data is flagged and protected
✅ **Efficiency**: One-time discovery, no repeated prompts
✅ **Extensibility**: Easy to add new providers and data types

