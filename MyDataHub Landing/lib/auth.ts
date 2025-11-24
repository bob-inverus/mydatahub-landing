import { SupabaseClient } from "@supabase/supabase-js"
import { APP_DOMAIN } from "@/lib/config"

/**
 * Signs in user with Google OAuth via Supabase
 */
export async function signInWithGoogle(supabase: SupabaseClient) {
  try {
    const isDev = process.env.NODE_ENV === "development"

    // Force marketing site redirect URL - NEVER redirect to main app
    const baseUrl = isDev
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_MARKETING_URL || window.location.origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      throw error
    }

    // Return the provider URL
    return data
  } catch (err) {
    console.error("Error signing in with Google:", err)
    throw err
  }
}

/**
 * Signs in user with LinkedIn OAuth via Supabase
 */
export async function signInWithLinkedIn(supabase: SupabaseClient) {
  try {
    const isDev = process.env.NODE_ENV === "development"

    // Force marketing site redirect URL - NEVER redirect to main app
    const baseUrl = isDev
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_MARKETING_URL || window.location.origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        scopes: "openid profile email",
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      throw error
    }

    // Return the provider URL
    return data
  } catch (err) {
    console.error("Error signing in with LinkedIn:", err)
    throw err
  }
}

/**
 * Signs in user with X (Twitter) OAuth via Supabase
 */
export async function signInWithX(supabase: SupabaseClient) {
  try {
    const isDev = process.env.NODE_ENV === "development"

    // Force marketing site redirect URL - NEVER redirect to main app
    const baseUrl = isDev
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_MARKETING_URL || window.location.origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      throw error
    }

    // Return the provider URL
    return data
  } catch (err) {
    console.error("Error signing in with X:", err)
    throw err
  }
}

/**
 * Signs in user with Apple OAuth via Supabase
 */
export async function signInWithApple(supabase: SupabaseClient) {
  try {
    const isDev = process.env.NODE_ENV === "development"

    // Force marketing site redirect URL - NEVER redirect to main app
    const baseUrl = isDev
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_MARKETING_URL || window.location.origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      throw error
    }

    // Return the provider URL
    return data
  } catch (err) {
    console.error("Error signing in with Apple:", err)
    throw err
  }
}

/**
 * Sends OTP to user's email for passwordless login
 */
export async function signInWithOTP(supabase: SupabaseClient, email: string) {
  try {
    const isDev = process.env.NODE_ENV === "development"

    // Force marketing site redirect URL
    const baseUrl = isDev
      ? "http://localhost:3001"
      : process.env.NEXT_PUBLIC_MARKETING_URL || "https://your-marketing-site.vercel.app"

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    return data
  } catch (err) {
    console.error("Error sending OTP:", err)
    throw err
  }
}

/**
 * Verifies OTP code for email login
 */
export async function verifyOTP(
  supabase: SupabaseClient,
  email: string,
  token: string
) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (error) {
      throw error
    }

    return data
  } catch (err) {
    console.error("Error verifying OTP:", err)
    throw err
  }
}
