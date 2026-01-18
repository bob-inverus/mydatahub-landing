import { useMutation, useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface VaultInitResult {
  success: boolean;
  vault_id?: string;
  items_created?: number;
  message: string;
  error?: string;
}

/**
 * Hook to initialize user's vault with data from OAuth providers
 * This collects: email, name, avatar, phone, and full OAuth profile
 */
export function useVaultInitialization() {
  return useMutation({
    mutationFn: async (): Promise<VaultInitResult> => {
      const supabase = createClient();
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to initialize vault');
      }

      // Call the SQL function to initialize vault with auth data
      const { data, error } = await supabase
        .rpc('initialize_vault_with_auth_data', {
          p_user_id: session.user.id
        });

      if (error) {
        console.error('Vault initialization error:', error);
        throw new Error(error.message || 'Failed to initialize vault');
      }

      return data as VaultInitResult;
    },
    retry: false,
  });
}

/**
 * Hook to check vault status
 */
export function useVaultStatus() {
  return useQuery({
    queryKey: ['vault-status'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_vaults')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      return data;
    },
  });
}

/**
 * Hook to get vault data items
 */
export function useVaultData(category?: string) {
  return useQuery({
    queryKey: ['vault-data', category],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      let query = supabase
        .from('vault_data_items')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
}

/**
 * Hook to get user's OAuth profile data for preview
 */
export function useOAuthProfileData() {
  return useQuery({
    queryKey: ['oauth-profile-data'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const user = session.user;
      
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        provider: user.app_metadata?.provider,
        providers: user.app_metadata?.providers || [],
        email_verified: user.email_confirmed_at ? true : false,
        phone_verified: user.phone_confirmed_at ? true : false,
        created_at: user.created_at,
        user_metadata: user.user_metadata,
      };
    },
  });
}

