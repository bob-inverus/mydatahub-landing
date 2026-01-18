import { useMutation, useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface DiscoverableItem {
  id: string;
  category: string;
  label: string;
  data_value?: string;
  data_json?: any;
  source: string;
  source_provider: string;
  description: string;
  is_sensitive: boolean;
  icon?: string;
}

/**
 * Hook to discover external data items that could be added to vault
 * This uses an "agent" approach - checking OAuth metadata for fields not yet in vault
 */
export function useVaultDiscovery() {
  return useQuery({
    queryKey: ['vault-discovery'],
    queryFn: async (): Promise<DiscoverableItem[]> => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const user = session.user;
      const metadata = user.user_metadata || {};
      const provider = user.app_metadata?.provider || 'email';

      // Get existing vault items to avoid duplicates
      const { data: existingItems } = await supabase
        .from('vault_data_items')
        .select('label, data_value')
        .eq('user_id', user.id);

      const existingLabels = new Set(existingItems?.map(item => item.label) || []);
      const discoverable: DiscoverableItem[] = [];

      // Helper to add discoverable item
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
          discoverable.push({
            id: `disc-${label.toLowerCase().replace(/\s+/g, '-')}`,
            category,
            label,
            data_value: typeof value === 'string' ? value : undefined,
            data_json: typeof value === 'object' ? value : undefined,
            source: 'oauth_provider',
            source_provider: source,
            description,
            is_sensitive: isSensitive,
            icon,
          });
        }
      };

      // Discover items based on provider
      if (provider === 'google') {
        addItem('Preferred Language', metadata.locale, 'profile', provider, 
          'Your preferred language from Google', false, '🌐');
        addItem('Google Profile URL', metadata.profile, 'social', provider,
          'Your public Google profile', false, '🔗');
        addItem('First Name', metadata.given_name, 'profile', provider,
          'Your first name from Google', false, '👤');
        addItem('Last Name', metadata.family_name, 'profile', provider,
          'Your last name from Google', false, '👤');
      }

      if (provider === 'github') {
        addItem('GitHub Username', metadata.user_name || metadata.login, 'social', provider,
          'Your GitHub username', false, '👨‍💻');
        addItem('GitHub Bio', metadata.bio, 'profile', provider,
          'Your GitHub profile bio', false, '📝');
        addItem('Location', metadata.location, 'profile', provider,
          'Your location from GitHub', false, '📍');
        addItem('Website', metadata.blog || metadata.website, 'profile', provider,
          'Your personal website', false, '🌐');
        addItem('Company', metadata.company, 'profile', provider,
          'Your company/organization', false, '🏢');
        addItem('GitHub Public Repos', metadata.public_repos?.toString(), 'social', provider,
          'Number of public repositories', false, '📦');
        addItem('GitHub Followers', metadata.followers?.toString(), 'social', provider,
          'Your GitHub follower count', false, '👥');
        addItem('GitHub Following', metadata.following?.toString(), 'social', provider,
          'Accounts you follow on GitHub', false, '👥');
        addItem('Available for Hire', metadata.hireable?.toString(), 'profile', provider,
          'Your hiring availability status', false, '💼');
        addItem('Twitter Username', metadata.twitter_username ? `@${metadata.twitter_username}` : null, 
          'social', provider, 'Your Twitter username linked to GitHub', false, '🐦');
      }

      if (provider === 'facebook') {
        addItem('First Name', metadata.first_name, 'profile', provider,
          'Your first name from Facebook', false, '👤');
        addItem('Last Name', metadata.last_name, 'profile', provider,
          'Your last name from Facebook', false, '👤');
        addItem('Gender', metadata.gender, 'profile', provider,
          'Your gender from Facebook profile', false, '⚧️');
        addItem('Birthday', metadata.birthday, 'profile', provider,
          'Your birthday from Facebook', true, '🎂');
        addItem('Facebook Profile', metadata.link, 'social', provider,
          'Your Facebook profile link', false, '🔗');
      }

      if (provider === 'twitter') {
        addItem('Twitter Handle', 
          metadata.preferred_username || metadata.screen_name || metadata.username ? 
          `@${metadata.preferred_username || metadata.screen_name || metadata.username}` : null,
          'social', provider, 'Your X/Twitter handle', false, '🐦');
        addItem('Twitter Bio', metadata.description, 'profile', provider,
          'Your Twitter profile bio', false, '📝');
        addItem('Twitter Followers', metadata.followers_count?.toString(), 'social', provider,
          'Your Twitter follower count', false, '👥');
        addItem('Twitter Verified', metadata.verified?.toString(), 'social', provider,
          'Your Twitter verification status', false, '✅');
      }

      if (provider === 'linkedin_oidc') {
        addItem('First Name', metadata.given_name, 'profile', provider,
          'Your first name from LinkedIn', false, '👤');
        addItem('Last Name', metadata.family_name, 'profile', provider,
          'Your last name from LinkedIn', false, '👤');
        addItem('LinkedIn Profile', metadata.profile_url, 'social', provider,
          'Your LinkedIn profile URL', false, '🔗');
      }

      // Web3 specific
      if (metadata.wallet_address || metadata.public_address) {
        addItem('Web3 Wallet', metadata.wallet_address || metadata.public_address, 
          'credentials', 'web3', 'Your Web3 wallet address', true, '👛');
        addItem('Blockchain Network', metadata.chain_id || metadata.network,
          'credentials', 'web3', 'The blockchain network you used', false, '⛓️');
        addItem('ENS Name', metadata.ens_name || metadata.ens,
          'profile', 'web3', 'Your Ethereum Name Service domain', false, '🌐');
      }

      // Phone number (universal)
      if (user.phone) {
        addItem('Phone Number', user.phone, 'profile', 'phone',
          'Your verified phone number', true, '📱');
      }

      return discoverable;
    },
  });
}

/**
 * Hook to integrate discovered items into vault
 */
export function useIntegrateVaultItem() {
  return useMutation({
    mutationFn: async (item: DiscoverableItem): Promise<{ success: boolean; message: string }> => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in');
      }

      // Get vault ID
      const { data: vault, error: vaultError } = await supabase
        .from('user_vaults')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (vaultError || !vault) {
        throw new Error('Vault not found. Please complete vault setup first.');
      }

      // Insert item into vault
      const { error } = await supabase
        .from('vault_data_items')
        .insert({
          vault_id: vault.id,
          user_id: session.user.id,
          category: item.category,
          data_type: item.data_json ? 'json' : 'text',
          label: item.label,
          data_value: item.data_value,
          data_json: item.data_json,
          source: item.source,
          source_provider: item.source_provider,
          is_sensitive: item.is_sensitive,
        });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: `${item.label} integrated successfully!`,
      };
    },
  });
}

/**
 * Hook to integrate multiple items at once
 */
export function useIntegrateMultipleItems() {
  return useMutation({
    mutationFn: async (items: DiscoverableItem[]): Promise<{ success: boolean; count: number }> => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in');
      }

      // Get vault ID
      const { data: vault, error: vaultError } = await supabase
        .from('user_vaults')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (vaultError || !vault) {
        throw new Error('Vault not found. Please complete vault setup first.');
      }

      // Prepare all items
      const itemsToInsert = items.map(item => ({
        vault_id: vault.id,
        user_id: session.user.id,
        category: item.category,
        data_type: item.data_json ? 'json' : 'text',
        label: item.label,
        data_value: item.data_value,
        data_json: item.data_json,
        source: item.source,
        source_provider: item.source_provider,
        is_sensitive: item.is_sensitive,
      }));

      // Insert all at once
      const { error } = await supabase
        .from('vault_data_items')
        .insert(itemsToInsert);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        count: items.length,
      };
    },
  });
}

