'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import { createClient } from '@/lib/supabase/client';

interface SocialLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnUrl?: string;
  referralCode?: string;
}

export function SocialLoginModal({ open, onOpenChange, returnUrl, referralCode }: SocialLoginModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'github' | 'twitter' | 'linkedin_oidc' | 'discord' | 'facebook') => {
    try {
      setIsLoading(provider);
      
      if (referralCode) {
        document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'discord',
      name: 'Discord',
      icon: (
        <svg className="w-6 h-6" fill="#5865F2" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-md:fixed max-md:bottom-0 max-md:top-auto max-md:left-0 max-md:right-0 max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-t-3xl max-md:rounded-b-none max-md:border-t max-md:border-x-0 max-md:border-b-0 max-md:data-[state=closed]:slide-out-to-bottom max-md:data-[state=open]:slide-in-from-bottom">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">More login options</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Sign in with Discord or Facebook
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSocialLogin(provider.id as any)}
              disabled={isLoading !== null}
            >
              {isLoading === provider.id ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                provider.icon
              )}
              <span className="text-sm font-medium text-foreground">{provider.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


