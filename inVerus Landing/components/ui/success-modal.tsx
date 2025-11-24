"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { InverusIcon } from "@/components/icons/inverus"
import { Button } from "@/components/ui/button"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  isNewUser?: boolean
}

export function SuccessModal({ isOpen, onClose, isNewUser = true }: SuccessModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 SuccessModal mounted')
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 SuccessModal isOpen changed:', isOpen)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      // Auto close after 8 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-8 text-center space-y-6">
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
              >
                <div className="mx-auto w-16 h-16 mb-4">
                  <InverusIcon className="w-full h-full" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-foreground">
                  {isNewUser ? "Welcome to the waitlist!" : "Welcome back!"}
                </h2>
                <p className="text-muted-foreground">
                  {isNewUser 
                    ? "You're on the list. We'll reach out when it's your turn to verify who's real."
                    : "You're already on our early access list. We'll reach out when it's your turn to verify who's real."
                  }
                </p>
              </div>

              {/* Success indicator */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {isNewUser 
                    ? "✓ Successfully added to early access list"
                    : "✓ You're already on the early access list"
                  }
                </p>
              </div>

              {/* Beta access info */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Signals verify first.</strong> Access is limited.
                </p>
              </div>

              {/* Close button */}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Continue exploring
              </Button>

              {/* Auto-close indicator */}
              <p className="text-xs text-muted-foreground">
                This message will close automatically in 8 seconds
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
