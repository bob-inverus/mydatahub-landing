"use client"
import { SignInPage, Testimonial } from "@/components/ui/sign-in"
import { useState } from "react"
import { signInWithLinkedIn, signInWithGoogle, signInWithX, signInWithApple, signInWithOTP, verifyOTP } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

export function LoginPage() {
  const [isLoading, setIsLoading] = useState<{
    linkedin: boolean
    google: boolean
    x: boolean
    apple: boolean
    otp: boolean
    verify: boolean
  }>({
    linkedin: false,
    google: false,
    x: false,
    apple: false,
    otp: false,
    verify: false
  })
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleSocialLogin = async (provider: 'linkedin' | 'google' | 'x' | 'apple') => {
    const supabase = createClient()
    if (!supabase) {
      setError("Authentication is not available")
      return
    }

    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }))
      setError(null)

      let data
      switch (provider) {
        case 'linkedin':
          data = await signInWithLinkedIn(supabase)
          break
        case 'google':
          data = await signInWithGoogle(supabase)
          break
        case 'x':
          data = await signInWithX(supabase)
          break
        case 'apple':
          data = await signInWithApple(supabase)
          break
      }

      if (data?.url) {
        // Keep loading state active during redirect
        // The loading will persist until the page redirects
        window.location.href = data.url
      } else {
        // Only reset loading if no redirect occurred
        setIsLoading(prev => ({ ...prev, [provider]: false }))
      }
    } catch (err: unknown) {
      console.error(`Error signing in with ${provider}:`, err)
      setError(
        (err as Error).message ||
        "An unexpected error occurred. Please try again."
      )
      // Only reset loading on error
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError("Authentication is not available")
      return
    }

    try {
      setIsLoading(prev => ({ ...prev, otp: true }))
      setError(null)

      await signInWithOTP(supabase, email)
      setOtpSent(true)
    } catch (err: unknown) {
      console.error("Error sending OTP:", err)
      setError(
        (err as Error).message ||
        "Failed to send verification code. Please try again."
      )
    } finally {
      setIsLoading(prev => ({ ...prev, otp: false }))
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpToken) {
      setError("Please enter the verification code")
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError("Authentication is not available")
      return
    }

    try {
      setIsLoading(prev => ({ ...prev, verify: true }))
      setError(null)

      await verifyOTP(supabase, email, otpToken)
      // Redirect will be handled by Supabase auth state change
      window.location.href = '/'
    } catch (err: unknown) {
      console.error("Error verifying OTP:", err)
      setError(
        (err as Error).message ||
        "Invalid verification code. Please try again."
      )
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }))
    }
  }

  const handleCreateAccount = () => {
    // Same flow as login - users are auto-created if they don't exist
    // The authentication system handles both login and sign-up
    console.log("User will be auto-created on first authentication")
  }

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Welcome to MyDataHub</span>}
        description="Access your account and continue your journey with us"
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        email={email}
        setEmail={setEmail}
        otpToken={otpToken}
        setOtpToken={setOtpToken}
        otpSent={otpSent}
        setOtpSent={setOtpSent}
        error={error}
        setError={setError}
        isLoading={isLoading}
        onGoogleSignIn={() => handleSocialLogin('google')}
        onLinkedInSignIn={() => handleSocialLogin('linkedin')}
        onXSignIn={() => handleSocialLogin('x')}
        onAppleSignIn={() => handleSocialLogin('apple')}
        onSendOTP={handleSendOTP}
        onVerifyOTP={handleVerifyOTP}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  )
} 