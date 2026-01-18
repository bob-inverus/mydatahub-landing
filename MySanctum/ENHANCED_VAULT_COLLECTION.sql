-- =====================================================
-- Enhanced Vault Data Collection
-- =====================================================
-- This improves vault initialization to collect ALL available
-- data from OAuth providers (Google, GitHub, LinkedIn, etc.)
-- =====================================================

-- Drop and recreate the vault initialization function with enhanced data collection
CREATE OR REPLACE FUNCTION public.initialize_vault_with_auth_data(
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_vault_id UUID;
    v_user_data JSONB;
    v_user_metadata JSONB;
    v_result JSONB;
    v_items_created INT := 0;
    v_provider TEXT;
BEGIN
    -- Get vault ID
    SELECT id INTO v_vault_id
    FROM public.user_vaults
    WHERE user_id = p_user_id;
    
    IF v_vault_id IS NULL THEN
        RAISE EXCEPTION 'Vault not found for user';
    END IF;
    
    -- Get comprehensive user data from auth.users
    SELECT 
        email,
        phone,
        email_confirmed_at,
        phone_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        COALESCE(raw_app_meta_data->>'provider', 'email') as provider
    INTO 
        v_user_data,
        v_user_metadata,
        v_provider
    FROM auth.users
    WHERE id = p_user_id;
    
    v_user_metadata := (SELECT raw_user_meta_data FROM auth.users WHERE id = p_user_id);
    v_provider := COALESCE((SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE id = p_user_id), 'email');
    
    -- ============================================
    -- BASIC PROFILE DATA
    -- ============================================
    
    -- Email
    IF (SELECT email FROM auth.users WHERE id = p_user_id) IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label, 
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Primary Email',
            (SELECT email FROM auth.users WHERE id = p_user_id),
            'oauth_provider', v_provider, true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Full Name (check multiple possible keys)
    IF v_user_metadata->>'full_name' IS NOT NULL OR 
       v_user_metadata->>'name' IS NOT NULL OR
       v_user_metadata->>'display_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Full Name',
            COALESCE(
                v_user_metadata->>'full_name',
                v_user_metadata->>'name',
                v_user_metadata->>'display_name'
            ),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Avatar/Profile Picture
    IF v_user_metadata->>'avatar_url' IS NOT NULL OR 
       v_user_metadata->>'picture' IS NOT NULL OR
       v_user_metadata->>'image_url' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'image', 'Profile Picture',
            COALESCE(
                v_user_metadata->>'avatar_url',
                v_user_metadata->>'picture',
                v_user_metadata->>'image_url'
            ),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Phone Number (from auth.users OR metadata)
    IF (SELECT phone FROM auth.users WHERE id = p_user_id) IS NOT NULL OR 
       v_user_metadata->>'phone' IS NOT NULL OR
       v_user_metadata->>'phone_number' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Phone Number',
            COALESCE(
                (SELECT phone FROM auth.users WHERE id = p_user_id),
                v_user_metadata->>'phone',
                v_user_metadata->>'phone_number'
            ),
            'oauth_provider', COALESCE(v_provider, 'phone'), true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Phone Verified Status
    IF (SELECT phone_confirmed_at FROM auth.users WHERE id = p_user_id) IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Phone Verified',
            'true',
            'oauth_provider', 'phone'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- WEB3 WALLET DATA
    -- ============================================
    
    -- Wallet Address
    IF v_user_metadata->>'wallet_address' IS NOT NULL OR 
       v_user_metadata->>'public_address' IS NOT NULL OR
       v_user_metadata->>'address' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'credentials', 'text', 'Web3 Wallet Address',
            COALESCE(
                v_user_metadata->>'wallet_address',
                v_user_metadata->>'public_address',
                v_user_metadata->>'address'
            ),
            'oauth_provider', 'web3', true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Blockchain Network
    IF v_user_metadata->>'chain_id' IS NOT NULL OR 
       v_user_metadata->>'network' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'credentials', 'text', 'Blockchain Network',
            COALESCE(v_user_metadata->>'chain_id', v_user_metadata->>'network'),
            'oauth_provider', 'web3'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ENS Name (Ethereum Name Service)
    IF v_user_metadata->>'ens_name' IS NOT NULL OR 
       v_user_metadata->>'ens' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'ENS Name',
            COALESCE(v_user_metadata->>'ens_name', v_user_metadata->>'ens'),
            'oauth_provider', 'web3'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- GOOGLE-SPECIFIC DATA
    -- ============================================
    
    -- Google Locale/Language
    IF v_provider = 'google' AND v_user_metadata->>'locale' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Preferred Language',
            v_user_metadata->>'locale',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Google Profile URL
    IF v_provider = 'google' AND v_user_metadata->>'profile' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'Google Profile',
            v_user_metadata->>'profile',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Google Given Name / Family Name
    IF v_user_metadata->>'given_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'First Name',
            v_user_metadata->>'given_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    IF v_user_metadata->>'family_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Last Name',
            v_user_metadata->>'family_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- FACEBOOK-SPECIFIC DATA
    -- ============================================
    
    -- Facebook ID
    IF v_provider = 'facebook' AND v_user_metadata->>'id' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'credentials', 'text', 'Facebook ID',
            v_user_metadata->>'id',
            'oauth_provider', v_provider, true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Facebook First/Last Name
    IF v_user_metadata->>'first_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'First Name',
            v_user_metadata->>'first_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    IF v_user_metadata->>'last_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Last Name',
            v_user_metadata->>'last_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Facebook Gender
    IF v_user_metadata->>'gender' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Gender',
            v_user_metadata->>'gender',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Facebook Birthday
    IF v_user_metadata->>'birthday' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Birthday',
            v_user_metadata->>'birthday',
            'oauth_provider', v_provider, true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Facebook Link (Profile URL)
    IF v_user_metadata->>'link' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'Facebook Profile',
            v_user_metadata->>'link',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- X/TWITTER-SPECIFIC DATA
    -- ============================================
    
    -- Twitter Handle
    IF v_provider = 'twitter' AND (
       v_user_metadata->>'preferred_username' IS NOT NULL OR
       v_user_metadata->>'screen_name' IS NOT NULL OR
       v_user_metadata->>'username' IS NOT NULL
    ) THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'X/Twitter Handle',
            '@' || COALESCE(
                v_user_metadata->>'preferred_username',
                v_user_metadata->>'screen_name',
                v_user_metadata->>'username'
            ),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Twitter Description/Bio
    IF v_provider = 'twitter' AND v_user_metadata->>'description' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Twitter Bio',
            v_user_metadata->>'description',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Twitter Follower Count
    IF v_user_metadata->>'followers_count' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'Twitter Followers',
            v_user_metadata->>'followers_count',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Twitter Verified Status
    IF v_user_metadata->>'verified' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'Twitter Verified',
            v_user_metadata->>'verified',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- LINKEDIN-SPECIFIC DATA
    -- ============================================
    
    -- LinkedIn Email (sometimes different key)
    IF v_provider = 'linkedin_oidc' AND v_user_metadata->>'email' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'LinkedIn Email',
            v_user_metadata->>'email',
            'oauth_provider', v_provider, true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- LinkedIn Profile URL
    IF v_user_metadata->>'profile_url' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'LinkedIn Profile',
            v_user_metadata->>'profile_url',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- LinkedIn Given/Family Name
    IF v_provider = 'linkedin_oidc' AND v_user_metadata->>'given_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'First Name',
            v_user_metadata->>'given_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    IF v_provider = 'linkedin_oidc' AND v_user_metadata->>'family_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Last Name',
            v_user_metadata->>'family_name',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- GITHUB-SPECIFIC DATA (ENHANCED)
    -- ============================================
    
    -- GitHub Username
    IF v_provider = 'github' AND (
       v_user_metadata->>'user_name' IS NOT NULL OR 
       v_user_metadata->>'login' IS NOT NULL OR
       v_user_metadata->>'preferred_username' IS NOT NULL
    ) THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'GitHub Username',
            COALESCE(
                v_user_metadata->>'user_name',
                v_user_metadata->>'login',
                v_user_metadata->>'preferred_username'
            ),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- GitHub Public Repos Count
    IF v_user_metadata->>'public_repos' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'GitHub Public Repos',
            v_user_metadata->>'public_repos',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- GitHub Followers Count
    IF v_user_metadata->>'followers' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'GitHub Followers',
            v_user_metadata->>'followers',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- GitHub Following Count
    IF v_user_metadata->>'following' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'GitHub Following',
            v_user_metadata->>'following',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- GitHub Hireable Status
    IF v_user_metadata->>'hireable' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Available for Hire',
            v_user_metadata->>'hireable',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- GitHub Twitter Username (if linked)
    IF v_user_metadata->>'twitter_username' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 'Twitter Username (from GitHub)',
            '@' || v_user_metadata->>'twitter_username',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- UNIVERSAL FIELDS (ALL PROVIDERS)
    -- ============================================
    
    -- Username (generic)
    IF v_user_metadata->>'user_name' IS NOT NULL OR v_user_metadata->>'preferred_username' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', 
            CASE v_provider
                WHEN 'github' THEN 'GitHub Username'
                WHEN 'twitter' THEN 'X/Twitter Handle'
                ELSE 'Username'
            END,
            COALESCE(v_user_metadata->>'user_name', v_user_metadata->>'preferred_username'),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Provider Profile URL
    IF v_user_metadata->>'html_url' IS NOT NULL OR 
       v_user_metadata->>'profile_url' IS NOT NULL OR
       v_user_metadata->>'url' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'social', 'text', v_provider || ' Profile URL',
            COALESCE(
                v_user_metadata->>'html_url',
                v_user_metadata->>'profile_url',
                v_user_metadata->>'url'
            ),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Bio/Description
    IF v_user_metadata->>'bio' IS NOT NULL OR v_user_metadata->>'description' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Bio',
            COALESCE(v_user_metadata->>'bio', v_user_metadata->>'description'),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Location
    IF v_user_metadata->>'location' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Location',
            v_user_metadata->>'location',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Website/Blog URL
    IF v_user_metadata->>'blog' IS NOT NULL OR v_user_metadata->>'website' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Website',
            COALESCE(v_user_metadata->>'blog', v_user_metadata->>'website'),
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Company/Organization
    IF v_user_metadata->>'company' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Company',
            v_user_metadata->>'company',
            'oauth_provider', v_provider
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Provider User ID (for API access)
    IF v_user_metadata->>'sub' IS NOT NULL OR v_user_metadata->>'id' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider, is_sensitive
        ) VALUES (
            v_vault_id, p_user_id, 'credentials', 'text', v_provider || ' User ID',
            COALESCE(v_user_metadata->>'sub', v_user_metadata->>'id'),
            'oauth_provider', v_provider, true
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- ============================================
    -- COMPLETE METADATA (for future reference)
    -- ============================================
    INSERT INTO public.vault_data_items (
        vault_id, user_id, category, data_type, label,
        data_json, source, source_provider
    ) VALUES (
        v_vault_id, p_user_id, 'profile', 'json', 'Complete ' || v_provider || ' Profile',
        v_user_metadata,
        'oauth_provider', v_provider
    )
    ON CONFLICT DO NOTHING;
    v_items_created := v_items_created + 1;
    
    -- Mark vault as initialized
    UPDATE public.user_vaults
    SET is_initialized = true,
        initialized_at = NOW(),
        last_synced_at = NOW()
    WHERE id = v_vault_id;
    
    -- Build result
    v_result := jsonb_build_object(
        'success', true,
        'vault_id', v_vault_id,
        'items_created', v_items_created,
        'provider', v_provider,
        'message', 'Vault initialized with ' || v_items_created || ' data items from ' || v_provider
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Failed to initialize vault'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DONE!
-- =====================================================
-- This enhanced function now collects:
-- ✅ Email, name, avatar, phone
-- ✅ GitHub: username, bio, location, company, website
-- ✅ Google: profile picture, name, email
-- ✅ LinkedIn: profile data
-- ✅ Twitter/X: handle, bio
-- ✅ Facebook: profile info
-- ✅ Provider-specific IDs for API access
-- ✅ Complete metadata as JSON for future use
-- =====================================================

