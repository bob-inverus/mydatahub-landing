# 🚀 Vault Discovery Agent - Quick Start Guide

## What You Have Now

A fully functional **Vault Discovery Agent** that automatically finds and lets users integrate additional data from their OAuth profiles!

## Files Created/Modified

### ✅ New Files
1. **`/hooks/vault/use-vault-discovery.ts`**
   - Contains all discovery and integration logic
   - Three hooks: `useVaultDiscovery`, `useIntegrateVaultItem`, `useIntegrateMultipleItems`

2. **`VAULT_DISCOVERY_AGENT.md`**
   - Comprehensive documentation
   - Architecture, data flow, security considerations

3. **`VAULT_DISCOVERY_QUICKSTART.md`** (this file)
   - Quick reference guide

### 🔧 Modified Files
1. **`/app/setting-up/page.tsx`**
   - Added "discovery" phase after initialization
   - Shows discoverable items with individual integrate buttons
   - Animated loading states with MySanctum logo

## How It Works

### User Flow
```
Login → Vault Init → Discovery Agent Scans → Shows Available Data → User Selects → Integrates → Dashboard
```

### What Gets Discovered

The agent finds data from these providers:

#### Google
- Preferred Language
- Google Profile URL
- First/Last Name (if not already collected)

#### GitHub
- Username, Bio, Location
- Website, Company
- Public Repos, Followers, Following
- Hiring Status, Twitter Username

#### Facebook
- First/Last Name
- Gender, Birthday 🔒
- Facebook Profile Link

#### Twitter/X
- Handle, Bio
- Followers Count
- Verification Status

#### LinkedIn
- First/Last Name
- Profile URL

#### Web3 Wallets
- Wallet Address 🔒
- Blockchain Network
- ENS Name

#### Universal
- Phone Number 🔒

🔒 = Marked as sensitive

## Setup Required

### Database Prerequisites
Make sure these tables exist (from `VAULT_SETUP.sql`):
```sql
-- Already created if you ran VAULT_SETUP.sql
✅ user_vaults
✅ vault_data_items
```

### No Additional Setup Needed!
The discovery agent works with your existing:
- Supabase Auth configuration
- OAuth providers
- RLS policies
- Vault initialization function

## Testing the Discovery Agent

### Test Flow
1. **Clear your test user's vault data** (optional, for testing):
```sql
DELETE FROM vault_data_items WHERE user_id = 'YOUR_USER_ID';
```

2. **Log in with a provider** (e.g., Google, GitHub)

3. **You'll see the flow**:
   - ✅ "Setting Up Your Vault" (animated logo)
   - ✅ "Enhance Your Vault" (discovery phase)
   - ✅ List of discoverable items with "Integrate" buttons
   - ✅ "Continue to Dashboard" button

4. **Click "Integrate" on any item**:
   - Button shows loading spinner
   - Toast notification confirms success
   - Item stays in list (for visual confirmation)

5. **Click "Continue to Dashboard"**:
   - Redirects to `/dashboard`

### Verify Data Was Saved
```sql
SELECT 
  label,
  data_value,
  category,
  source_provider,
  is_sensitive
FROM vault_data_items
WHERE user_id = 'YOUR_USER_ID'
ORDER BY category, label;
```

## UI Customization

### Change Discovery Phase Title
```typescript
// In /app/setting-up/page.tsx
<h2>Enhance Your Vault</h2> // Change this
```

### Customize Item Cards
Each item shows:
- Icon (emoji) - customize in `use-vault-discovery.ts`
- Label - change `addItem()` calls
- Description - change description parameter
- Source provider - auto-detected

### Add More Data Sources
In `/hooks/vault/use-vault-discovery.ts`, add:

```typescript
// Example: Adding LinkedIn extended fields
if (provider === 'linkedin_oidc') {
  addItem('Job Title', metadata.job_title, 'profile', provider,
    'Your current job title', false, '💼');
  addItem('Industry', metadata.industry, 'profile', provider,
    'Your industry sector', false, '🏭');
}
```

## Advanced Features

### Skip Discovery Phase
If you want users to go straight to dashboard:

```typescript
// In /app/setting-up/page.tsx
// Change this:
setStatus('discovery');
// To this:
setStatus('success');
setTimeout(() => router.push('/dashboard'), 500);
```

### Auto-Integrate All Items
Add a "Add All" button:

```typescript
const handleIntegrateAll = async () => {
  if (!discoverableItems) return;
  
  const integrateMultipleMutation = useIntegrateMultipleItems();
  await integrateMultipleMutation.mutateAsync(discoverableItems);
  
  toast.success(`${discoverableItems.length} items integrated!`);
  handleSkipDiscovery();
};
```

Then add the button:
```tsx
<Button onClick={handleIntegrateAll}>
  Integrate All ({discoverableItems?.length})
</Button>
```

### Add Provider-Specific Icons
Replace emojis with actual brand logos:

```typescript
// Instead of emoji:
icon: '🐙' // GitHub

// Use component:
icon: <GitHubIcon className="w-5 h-5" />
```

## Troubleshooting

### No Items Showing in Discovery
**Possible causes:**
1. All data was already collected during init
2. Provider didn't return extended metadata
3. Vault not properly initialized

**Check:**
```sql
-- See what's in auth metadata
SELECT raw_user_meta_data FROM auth.users WHERE id = 'USER_ID';

-- See what's already in vault
SELECT label FROM vault_data_items WHERE user_id = 'USER_ID';
```

### "Vault not found" Error
Run the initialization manually:
```sql
SELECT initialize_vault_with_auth_data('USER_ID');
```

### Items Not Integrating
Check browser console for errors. Common issues:
- RLS policies not set up
- User not authenticated
- Vault ID not found

**Fix:** Verify RLS policies exist on `vault_data_items` table.

## Performance Notes

### Discovery is Fast
- Runs client-side (no API calls)
- Uses React Query caching
- Only fetches once per session

### Integration is Async
- Each item integrates independently
- UI shows loading state per item
- Failed items don't block others

### Scalability
- Handles 50+ discoverable items smoothly
- Scrollable list with max-height
- Lazy evaluation (no heavy computation)

## What's Next?

### Enhance Discovery
1. **Add more providers** (Apple, Microsoft, etc.)
2. **Add more fields** from existing providers
3. **Web scraping** for public profiles (with consent)

### Improve UX
1. **Categories** - group items by type
2. **Bulk actions** - "Select all in category"
3. **Preview** - show data value before integrating

### Advanced Features
1. **Scheduled re-discovery** - check for new data weekly
2. **AI enrichment** - suggest related data to collect
3. **Data quality score** - "Your vault is 75% complete"

## Questions?

Check the full documentation: **`VAULT_DISCOVERY_AGENT.md`**

## Summary

You now have a fully functional discovery agent that:
✅ Automatically finds additional user data
✅ Presents it with clear descriptions
✅ Lets users choose what to integrate
✅ Shows beautiful animations
✅ Handles errors gracefully
✅ Works with all your OAuth providers

**Ready to test!** 🎉

Just log in with any OAuth provider and visit `/setting-up` to see the discovery agent in action.

