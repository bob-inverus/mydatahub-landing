-- =====================================================
-- MySanctum Database Schema Setup
-- =====================================================
-- This SQL file creates the essential tables and policies
-- for MySanctum to function properly.
--
-- Run this in your Supabase SQL Editor:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a new query
-- 4. Paste this entire file
-- 5. Click "Run"
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- User profiles with personal information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    wallet_address TEXT, -- For Web3 authentication
    auth_method TEXT DEFAULT 'email', -- 'email', 'google', 'github', 'web3', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- MySanctum specific fields
    data_vault_enabled BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- DATA CONNECTIONS TABLE
-- =====================================================
-- Track user's connected applications and data sources
CREATE TABLE IF NOT EXISTS public.data_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    app_name TEXT NOT NULL, -- e.g., 'Facebook', 'Google', 'X', 'Chase Bank'
    app_type TEXT NOT NULL, -- 'social', 'financial', 'health', 'productivity', etc.
    connection_status TEXT DEFAULT 'active', -- 'active', 'revoked', 'pending'
    
    -- Data access permissions
    permissions JSONB DEFAULT '[]'::jsonb, -- Array of permission objects
    -- Example: [{"type": "contacts", "granted": true}, {"type": "posts", "granted": false}]
    
    -- Connection metadata
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- OAuth/API credentials (encrypted)
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_data_connections_user_id ON public.data_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_data_connections_status ON public.data_connections(connection_status);
CREATE INDEX IF NOT EXISTS idx_data_connections_app_name ON public.data_connections(app_name);

-- Enable Row Level Security
ALTER TABLE public.data_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own connections"
    ON public.data_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections"
    ON public.data_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
    ON public.data_connections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
    ON public.data_connections FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
-- Track all data access and permission changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connection_id UUID REFERENCES public.data_connections(id) ON DELETE SET NULL,
    
    action_type TEXT NOT NULL, -- 'access_granted', 'access_revoked', 'data_accessed', etc.
    resource_type TEXT, -- 'contacts', 'photos', 'posts', etc.
    resource_id TEXT,
    
    -- Details
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- IP and user agent for security
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_connection_id ON public.audit_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true); -- Allow system to insert logs

-- =====================================================
-- USER SETTINGS TABLE
-- =====================================================
-- Store user preferences and settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT true,
    security_alerts BOOLEAN DEFAULT true,
    access_notifications BOOLEAN DEFAULT true,
    
    -- Privacy settings
    data_sharing_enabled BOOLEAN DEFAULT false,
    analytics_enabled BOOLEAN DEFAULT true,
    
    -- UI preferences
    theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
    language TEXT DEFAULT 'en',
    
    -- Additional settings
    settings JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- Create storage buckets for user data

-- User avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- User documents bucket (encrypted)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
    'user_documents',
    'user_documents',
    false,
    52428800 -- 50MB
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Avatars are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

-- Storage policies for user documents
CREATE POLICY "Users can upload their own documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'user_documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user_documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own documents"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'user_documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user_documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, auth_method, metadata)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'auth_method', 'email'),
        COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
    );
    
    -- Create default settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_data_connections_updated_at ON public.data_connections;
CREATE TRIGGER update_data_connections_updated_at
    BEFORE UPDATE ON public.data_connections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Your MySanctum database is now set up!
-- 
-- Next steps:
-- 1. Configure OAuth providers in Authentication > Providers
-- 2. Set up your environment variables (see ENV_SETUP_WEB3.md)
-- 3. Test user signup and login
-- =====================================================

