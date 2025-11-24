"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Suspense } from "react"
import { createOrUpdateUser } from "@/lib/user-utils"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      if (!supabase) {
        setError('Authentication service not available')
        setStatus('error')
        return
      }

      try {
        console.log('🔄 Auth callback processing...')
        
        // Immediately redirect and let the home page handle the session
        // This makes the flow seamless without showing loading states
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('🎉 Authentication successful! Processing user:', session.user.email)
          
          // Process user creation asynchronously to avoid delays
          createOrUpdateUser(supabase, session.user)
            .then((result) => {
              console.log('✅ User data captured and saved to database for:', session.user.email)
              console.log('👤 User is new:', result.isNewUser)
              
              // Update the URL with user status after redirect
              const currentUrl = new URL(window.location.href)
              if (currentUrl.pathname === '/') {
                const newUrl = new URL(window.location.origin)
                newUrl.searchParams.set('signup', 'success')
                newUrl.searchParams.set('new_user', result.isNewUser.toString())
                window.history.replaceState({}, '', newUrl.toString())
              }
            })
            .catch((userError) => {
              console.error('❌ Failed to create user record:', userError)
            })
          
          // Immediate redirect for seamless experience
          console.log('🔄 Redirecting immediately to home page...')
          router.replace('/?signup=success&new_user=true')
          return
        }
        
        if (sessionError) {
          console.error('❌ Auth session error:', sessionError)
          setError(sessionError.message)
          setStatus('error')
          return
        }
        
        // If no session, wait briefly and try once more
        console.log('⏳ No session found, waiting briefly...')
        setTimeout(async () => {
          const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession()
          
          if (retrySession?.user) {
            console.log('🎉 Authentication successful (retry)! Processing user:', retrySession.user.email)
            
            // Process user creation asynchronously
            createOrUpdateUser(supabase, retrySession.user)
              .then((result) => {
                console.log('✅ User data captured and saved to database (retry) for:', retrySession.user.email)
                console.log('👤 User is new (retry):', result.isNewUser)
              })
              .catch((userError) => {
                console.error('❌ Failed to create user record (retry):', userError)
              })
            
            // Immediate redirect
            console.log('🔄 Redirecting immediately to home page (retry)...')
            router.replace('/?signup=success&new_user=true')
          } else {
            console.error('Auth retry error:', retryError)
            setError('Authentication failed. Please try again.')
            setStatus('error')
          }
        }, 500) // Reduced timeout for faster experience

      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-6 h-6 border-2 border-t-transparent border-current rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    )
  }


  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Authentication Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 rounded-md px-8"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
}

export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
