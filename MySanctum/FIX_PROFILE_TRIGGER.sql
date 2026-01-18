-- =====================================================
-- FIX: Update Profile Trigger to Copy OAuth Data
-- =====================================================
-- This updates the trigger to properly copy avatar, name, etc.
-- from auth.users to profiles table
-- =====================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =====================================================
-- IMPROVED: Auto-create profile with OAuth data
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name,
        avatar_url,
        wallet_address
    )
    VALUES (
        NEW.id,
        NEW.email,
        -- Extract full_name from multiple possible locations in user_metadata
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'display_name'
        ),
        -- Extract avatar_url from multiple possible locations
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            NEW.raw_user_meta_data->>'image_url',
            NEW.raw_user_meta_data->>'photo_url'
        ),
        -- Extract wallet address if present (for Web3 auth)
        NEW.raw_user_meta_data->>'wallet_address'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- BONUS: Function to sync existing users
-- =====================================================
-- Run this to update existing users whose profiles are missing data
CREATE OR REPLACE FUNCTION public.sync_existing_user_profiles()
RETURNS TABLE(synced_count INTEGER, message TEXT) AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    -- Update existing profiles with data from auth.users
    UPDATE public.profiles p
    SET 
        full_name = COALESCE(
            p.full_name,
            u.raw_user_meta_data->>'full_name',
            u.raw_user_meta_data->>'name',
            u.raw_user_meta_data->>'display_name'
        ),
        avatar_url = COALESCE(
            p.avatar_url,
            u.raw_user_meta_data->>'avatar_url',
            u.raw_user_meta_data->>'picture',
            u.raw_user_meta_data->>'image_url',
            u.raw_user_meta_data->>'photo_url'
        ),
        wallet_address = COALESCE(
            p.wallet_address,
            u.raw_user_meta_data->>'wallet_address'
        ),
        updated_at = NOW()
    FROM auth.users u
    WHERE p.id = u.id
      AND (
          p.full_name IS NULL 
          OR p.avatar_url IS NULL
      );
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    RETURN QUERY SELECT v_count, 'Profiles synced successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DONE!
-- =====================================================
-- To sync existing users, run:
-- SELECT * FROM sync_existing_user_profiles();
-- =====================================================

