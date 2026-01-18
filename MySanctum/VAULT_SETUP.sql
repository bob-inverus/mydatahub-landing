-- =====================================================
-- MySanctum VAULT System Setup
-- =====================================================
-- This creates the vault structure for storing user data
-- =====================================================

-- =====================================================
-- USER VAULT TABLE
-- =====================================================
-- Stores the main vault metadata and status
CREATE TABLE IF NOT EXISTS public.user_vaults (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vault_name TEXT DEFAULT 'My Secure Vault',
    is_initialized BOOLEAN DEFAULT false,
    initialized_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    encryption_status TEXT DEFAULT 'enabled', -- enabled, disabled, pending
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_vaults ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own vault"
    ON public.user_vaults FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault"
    ON public.user_vaults FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault"
    ON public.user_vaults FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VAULT DATA ITEMS TABLE
-- =====================================================
-- Stores individual data items in the vault
CREATE TABLE IF NOT EXISTS public.vault_data_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES public.user_vaults(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Data categorization
    category TEXT NOT NULL, -- 'profile', 'social', 'financial', 'health', 'documents', 'credentials', 'custom'
    data_type TEXT NOT NULL, -- 'text', 'json', 'file', 'image', 'document'
    label TEXT NOT NULL, -- User-friendly name (e.g., "Primary Email", "Profile Picture")
    
    -- Data storage
    data_value TEXT, -- For simple text/string values
    data_json JSONB, -- For structured data
    file_url TEXT, -- For files stored in Supabase storage
    file_size_bytes BIGINT,
    
    -- Metadata
    source TEXT, -- 'oauth_provider', 'manual', 'agent_collected', 'imported'
    source_provider TEXT, -- 'google', 'github', 'facebook', etc.
    is_encrypted BOOLEAN DEFAULT false,
    is_sensitive BOOLEAN DEFAULT false, -- Flag for extra sensitive data
    
    -- Access control
    is_shared BOOLEAN DEFAULT false,
    shared_with JSONB, -- Array of user IDs or external entities
    access_logs JSONB, -- Track who accessed this data
    
    -- Timestamps
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.vault_data_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own vault data"
    ON public.vault_data_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault data"
    ON public.vault_data_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault data"
    ON public.vault_data_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vault data"
    ON public.vault_data_items FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_vault_data_user_id ON public.vault_data_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_data_vault_id ON public.vault_data_items(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_data_category ON public.vault_data_items(category);
CREATE INDEX IF NOT EXISTS idx_vault_data_source ON public.vault_data_items(source);

-- =====================================================
-- AUTO-CREATE VAULT ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_vault()
RETURNS TRIGGER AS $$
BEGIN
    -- Create vault for new user
    INSERT INTO public.user_vaults (user_id, vault_name)
    VALUES (NEW.id, 'My Secure Vault');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_vault_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_user_vault_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_vault();

-- =====================================================
-- HELPER FUNCTION: Initialize Vault with Auth Data
-- =====================================================
CREATE OR REPLACE FUNCTION public.initialize_vault_with_auth_data(
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_vault_id UUID;
    v_user_data JSONB;
    v_result JSONB;
    v_items_created INT := 0;
BEGIN
    -- Get vault ID
    SELECT id INTO v_vault_id
    FROM public.user_vaults
    WHERE user_id = p_user_id;
    
    IF v_vault_id IS NULL THEN
        RAISE EXCEPTION 'Vault not found for user';
    END IF;
    
    -- Get user data from auth.users
    SELECT jsonb_build_object(
        'email', email,
        'phone', phone,
        'email_confirmed_at', email_confirmed_at,
        'phone_confirmed_at', phone_confirmed_at,
        'raw_user_meta_data', raw_user_meta_data,
        'raw_app_meta_data', raw_app_meta_data
    ) INTO v_user_data
    FROM auth.users
    WHERE id = p_user_id;
    
    -- Insert email if exists
    IF v_user_data->>'email' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label, 
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Primary Email',
            v_user_data->>'email', 'oauth_provider', 
            COALESCE(v_user_data->'raw_app_meta_data'->>'provider', 'email')
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Insert name if exists
    IF v_user_data->'raw_user_meta_data'->>'full_name' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Full Name',
            v_user_data->'raw_user_meta_data'->>'full_name', 'oauth_provider',
            v_user_data->'raw_app_meta_data'->>'provider'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Insert avatar if exists
    IF v_user_data->'raw_user_meta_data'->>'avatar_url' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'image', 'Profile Picture',
            v_user_data->'raw_user_meta_data'->>'avatar_url', 'oauth_provider',
            v_user_data->'raw_app_meta_data'->>'provider'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Insert phone if exists
    IF v_user_data->>'phone' IS NOT NULL THEN
        INSERT INTO public.vault_data_items (
            vault_id, user_id, category, data_type, label,
            data_value, source, source_provider
        ) VALUES (
            v_vault_id, p_user_id, 'profile', 'text', 'Phone Number',
            v_user_data->>'phone', 'oauth_provider', 'phone'
        )
        ON CONFLICT DO NOTHING;
        v_items_created := v_items_created + 1;
    END IF;
    
    -- Store complete auth metadata as JSON
    INSERT INTO public.vault_data_items (
        vault_id, user_id, category, data_type, label,
        data_json, source, source_provider
    ) VALUES (
        v_vault_id, p_user_id, 'profile', 'json', 'OAuth Profile Data',
        v_user_data->'raw_user_meta_data', 'oauth_provider',
        v_user_data->'raw_app_meta_data'->>'provider'
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
        'message', 'Vault initialized successfully'
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
-- GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_vaults TO authenticated;
GRANT ALL ON public.vault_data_items TO authenticated;

-- =====================================================
-- DONE!
-- =====================================================
-- To initialize a vault with user's auth data:
-- SELECT public.initialize_vault_with_auth_data(auth.uid());
-- =====================================================

