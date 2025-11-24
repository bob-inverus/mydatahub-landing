"use client"

import { ChatLandingWindow } from "@/app/components/chat-landing-window"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { SuccessModal } from "@/components/ui/success-modal"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { createOrUpdateUser } from "@/lib/user-utils"

export function HomeContent() {
  const searchParams = useSearchParams()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isNewUser, setIsNewUser] = useState(true)

  useEffect(() => {
    const signupSuccess = searchParams.get('signup')
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')
    const code = searchParams.get('code') // OAuth code from callback
    
    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 HomeContent useEffect - signup param:', signupSuccess)
      console.log('🔍 HomeContent useEffect - error param:', error)
      console.log('🔍 HomeContent useEffect - code param:', code)
      console.log('🔍 Current URL:', window.location.href)
      console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()))
    }

    // Handle OAuth code directly on home page (fallback)
    if (code && !signupSuccess && !error) {
      console.log('🔄 OAuth code detected on home page, redirecting to callback...')
      // Redirect to the proper callback handler
      window.location.href = `/auth/callback?code=${code}`
      return
    }
    
    if (error) {
      const decodedDescription = errorDescription ? decodeURIComponent(errorDescription) : ''
      console.error('❌ OAuth Error detected:', {
        error,
        error_code: errorCode,
        error_description: decodedDescription
      })
      
      // Show error alert with better messaging
      const errorMessage = decodedDescription || error || 'Unknown authentication error'
      alert(`Authentication Error: ${errorMessage}\n\nPlease check your Google OAuth configuration.`)
      
      // Clean up error parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      url.searchParams.delete('error_code')  
      url.searchParams.delete('error_description')
      window.history.replaceState({}, '', url.pathname)
    }
    
    if (signupSuccess === 'success') {
      console.log('✅ Setting success modal to true')
      
      // Check if user is new or existing from URL parameter
      const newUser = searchParams.get('new_user')
      let userIsNew = newUser === 'true' || newUser === null // default to true if not specified
      
      // If we don't have user status, check the session and create user record
      if (newUser === null) {
        const supabase = createClient()
        if (supabase) {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              createOrUpdateUser(supabase, session.user)
                .then((result) => {
                  console.log('✅ User data processed on home page for:', session.user.email)
                  console.log('👤 User is new (home page):', result.isNewUser)
                  setIsNewUser(result.isNewUser)
                })
                .catch((error) => {
                  console.error('❌ Failed to process user on home page:', error)
                })
            }
          })
        }
      } else {
        setIsNewUser(userIsNew)
      }
      
      setShowSuccessModal(true)
      
      // Clean up the URL parameters after showing the modal
      const url = new URL(window.location.href)
      url.searchParams.delete('signup')
      url.searchParams.delete('new_user')
      window.history.replaceState({}, '', url.pathname)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 URL cleaned, new URL:', url.pathname)
        console.log('👤 User is new:', userIsNew)
      }
    }
  }, [searchParams])

  // Debug: Log modal state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 Success modal state changed:', showSuccessModal)
    }
  }, [showSuccessModal])

  const handleCloseModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <LayoutApp>
      <ChatLandingWindow />
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} isNewUser={isNewUser} />
    </LayoutApp>
  )
}
