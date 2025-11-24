"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Mail } from "lucide-react"
import { JSX, SVGProps, ReactNode } from "react"

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
)

export interface Testimonial {
  avatarSrc: string
  name: string
  handle: string
  text: string
}

interface SignInPageProps {
  title: ReactNode
  description: string
  heroImageSrc: string
  testimonials: Testimonial[]
  email: string
  setEmail: (email: string) => void
  otpToken: string
  setOtpToken: (token: string) => void
  otpSent: boolean
  setOtpSent: (sent: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  isLoading: {
    linkedin: boolean
    google: boolean
    x: boolean
    apple: boolean
    otp: boolean
    verify: boolean
  }
  onGoogleSignIn: () => void
  onLinkedInSignIn: () => void
  onXSignIn: () => void
  onAppleSignIn: () => void
  onSendOTP: (e: React.FormEvent) => void
  onVerifyOTP: (e: React.FormEvent) => void
  onCreateAccount: () => void
}

export function SignInPage({
  title,
  description,
  heroImageSrc,
  testimonials,
  email,
  setEmail,
  otpToken,
  setOtpToken,
  otpSent,
  setOtpSent,
  error,
  setError,
  isLoading,
  onGoogleSignIn,
  onLinkedInSignIn,
  onXSignIn,
  onAppleSignIn,
  onSendOTP,
  onVerifyOTP,
  onCreateAccount,
}: SignInPageProps) {
  const isAnyLoading = Object.values(isLoading).some(Boolean)

  return (
    <div className="grid h-screen w-full lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {!otpSent ? (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onGoogleSignIn}
                    disabled={isAnyLoading}
                  >
                    {isLoading.google ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <GoogleIcon className="h-4 w-4 mr-2" />
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onLinkedInSignIn}
                    disabled={isAnyLoading}
                  >
                    {isLoading.linkedin ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                          <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                            fill="currentColor"
                          />
                        </svg>
                        Continue with LinkedIn
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onXSignIn}
                    disabled={isAnyLoading}
                  >
                    {isLoading.x ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                          <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                            fill="currentColor"
                          />
                        </svg>
                        Continue with X
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onAppleSignIn}
                    disabled={isAnyLoading}
                  >
                    {isLoading.apple ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        Continue with Apple
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                {/* Email Form */}
                <form onSubmit={onSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        className="peer ps-9"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading.otp}
                      />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <Mail size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAnyLoading}
                  >
                    {isLoading.otp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Continue with Email'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* OTP Verification */}
                <div className="space-y-6">
                  <div className="text-center text-sm text-muted-foreground">
                    We've sent a verification code to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </div>
                  <form onSubmit={onVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-center block">
                        Verification code
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otpToken}
                          onChange={(value) => setOtpToken(value)}
                          disabled={isLoading.verify}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading.verify}
                    >
                      {isLoading.verify ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Code'
                      )}
                    </Button>
                  </form>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setOtpSent(false)
                      setOtpToken('')
                      setError(null)
                    }}
                    disabled={isLoading.verify}
                  >
                    Back to email
                  </Button>
                </div>
              </>
            )}

            <div className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onCreateAccount}
                className="underline underline-offset-4 hover:text-primary"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Testimonials */}
      <div className="relative hidden lg:block">
        <img
          src={heroImageSrc}
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
        
        {/* Testimonials */}
        <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background/80 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-border/50"
            >
              <p className="text-sm leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

