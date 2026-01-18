'use client';

import Link from 'next/link';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/utils';
import { useState, useEffect, Suspense, lazy } from 'react';
import { signUp, resendMagicLink } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { MailCheck, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useAuthMethodTracking } from '@/stores/auth-tracking';
import { toast } from '@/lib/toast';
import { useTranslations } from 'next-intl';
import { MySanctumIcon } from '@/components/sidebar/mysanctum-logo';
import { MySanctumIconAnimated } from '@/components/icons/mysanctum-icon-animated';
import { ReferralCodeDialog } from '@/components/referrals/referral-code-dialog';
import { isElectron, getAuthOrigin } from '@/lib/utils/is-electron';
import { ExampleShowcase } from '@/components/auth/example-showcase';
import { trackSendAuthLink } from '@/lib/analytics/gtm';
import { createClient } from '@/lib/supabase/client';

// Lazy load heavy components
const GoogleSignIn = lazy(() => import('@/components/GoogleSignIn'));
const Web3LoginButton = lazy(() => import('@/components/Web3LoginButton'));
// const GitHubSignIn = lazy(() => import('@/components/GithubSignIn'));
const AnimatedBg = lazy(() => import('@/components/ui/animated-bg').then(mod => ({ default: mod.AnimatedBg })));

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const mode = searchParams.get('mode');
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect');
  const message = searchParams.get('message');
  const isExpired = searchParams.get('expired') === 'true';
  const expiredEmail = searchParams.get('email') || '';
  const referralCodeParam = searchParams.get('ref') || '';
  const t = useTranslations('auth');

  const isSignUp = mode !== 'signin';
  const [referralCode, setReferralCode] = useState(referralCodeParam);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // GDPR requires explicit opt-in

  const { wasLastMethod: wasEmailLastMethod, markAsUsed: markEmailAsUsed } = useAuthMethodTracking('email');

  useEffect(() => {
    // Don't auto-redirect if showing expired link state
    if (!isLoading && user && !isExpired) {
      // Check if vault is initialized before redirecting
      const checkVaultAndRedirect = async () => {
        try {
          const supabase = createClient();
          const { data: vault } = await supabase
            .from('user_vaults')
            .select('is_initialized')
            .eq('user_id', user.id)
            .single();

          if (!vault || !vault.is_initialized) {
            router.push('/setting-up');
          } else {
            router.push(returnUrl || '/dashboard');
          }
        } catch (error) {
          // If error checking vault, go to setting-up to initialize
          router.push('/setting-up');
        }
      };

      checkVaultAndRedirect();
    }
  }, [user, isLoading, router, returnUrl, isExpired]);

  const isSuccessMessage =
    message &&
    (message.includes('Check your email') ||
      message.includes('Account created') ||
      message.includes('success'));

  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] =
    useState(!!isSuccessMessage);
  const [registrationEmail, setRegistrationEmail] = useState('');

  // Expired link state
  const [linkExpired, setLinkExpired] = useState(isExpired);
  const [expiredEmailState, setExpiredEmailState] = useState(expiredEmail);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSuccessMessage) {
      setRegistrationSuccess(true);
    }
  }, [isSuccessMessage]);

  useEffect(() => {
    if (isExpired) {
      setLinkExpired(true);
      if (expiredEmail) {
        setExpiredEmailState(expiredEmail);
      }
    }
  }, [isExpired, expiredEmail]);

  const handleAuth = async (prevState: any, formData: FormData) => {
    trackSendAuthLink();
    markEmailAsUsed();

    const email = formData.get('email') as string;
    setRegistrationEmail(email);

    const finalReturnUrl = returnUrl || '/dashboard';
    formData.append('returnUrl', finalReturnUrl);
    // Use custom protocol for Electron, standard origin for web
    formData.append('origin', isElectron() ? getAuthOrigin() : window.location.origin);
    formData.append('acceptedTerms', acceptedTerms.toString());
    // Flag for Electron to use custom callback handling
    if (isElectron()) {
      formData.append('isDesktopApp', 'true');
    }

    const result = await signUp(prevState, formData);

    // Magic link always returns success with message (no immediate redirect)
    if (result && typeof result === 'object' && 'success' in result && result.success) {
      if ('email' in result && result.email) {
        setRegistrationEmail(result.email as string);
        setRegistrationSuccess(true);
        return result;
      }
    }

    if (result && typeof result === 'object' && 'message' in result) {
      toast.error(t('signUpFailed'), {
        description: result.message as string,
        duration: 5000,
      });
      return {};
    }

    return result;
  };


  // Helper to get email provider info for "Open in X" button
  // Uses mobile deep links when on mobile devices
  const getEmailProviderInfo = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    // Detect mobile device for deep links
    const isMobileDevice = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Provider config with web and mobile URLs
    // Mobile URLs use deep links that open native apps if installed
    const providers: { [key: string]: { name: string; webUrl: string; mobileUrl: string } } = {
      // Gmail - googlemail:// opens Gmail app on iOS/Android
      'gmail.com': { name: 'Gmail', webUrl: 'https://mail.google.com', mobileUrl: 'googlegmail://' },
      'googlemail.com': { name: 'Gmail', webUrl: 'https://mail.google.com', mobileUrl: 'googlegmail://' },
      // Outlook - ms-outlook:// opens Outlook app
      'outlook.com': { name: 'Outlook', webUrl: 'https://outlook.live.com', mobileUrl: 'ms-outlook://' },
      'hotmail.com': { name: 'Outlook', webUrl: 'https://outlook.live.com', mobileUrl: 'ms-outlook://' },
      'live.com': { name: 'Outlook', webUrl: 'https://outlook.live.com', mobileUrl: 'ms-outlook://' },
      'msn.com': { name: 'Outlook', webUrl: 'https://outlook.live.com', mobileUrl: 'ms-outlook://' },
      // Yahoo - ymail:// opens Yahoo Mail app
      'yahoo.com': { name: 'Yahoo Mail', webUrl: 'https://mail.yahoo.com', mobileUrl: 'ymail://' },
      'yahoo.de': { name: 'Yahoo Mail', webUrl: 'https://mail.yahoo.com', mobileUrl: 'ymail://' },
      'yahoo.co.uk': { name: 'Yahoo Mail', webUrl: 'https://mail.yahoo.com', mobileUrl: 'ymail://' },
      // iCloud - Use web URL, Apple Mail is default on iOS
      'icloud.com': { name: 'Mail', webUrl: 'https://www.icloud.com/mail', mobileUrl: 'message://' },
      'me.com': { name: 'Mail', webUrl: 'https://www.icloud.com/mail', mobileUrl: 'message://' },
      'mac.com': { name: 'Mail', webUrl: 'https://www.icloud.com/mail', mobileUrl: 'message://' },
      // ProtonMail - protonmail:// opens ProtonMail app
      'protonmail.com': { name: 'ProtonMail', webUrl: 'https://mail.proton.me', mobileUrl: 'protonmail://' },
      'proton.me': { name: 'ProtonMail', webUrl: 'https://mail.proton.me', mobileUrl: 'protonmail://' },
      'pm.me': { name: 'ProtonMail', webUrl: 'https://mail.proton.me', mobileUrl: 'protonmail://' },
      // AOL - Use web URL (no widely-used deep link)
      'aol.com': { name: 'AOL Mail', webUrl: 'https://mail.aol.com', mobileUrl: 'https://mail.aol.com' },
      // Zoho - Use web URL
      'zoho.com': { name: 'Zoho Mail', webUrl: 'https://mail.zoho.com', mobileUrl: 'https://mail.zoho.com' },
      // GMX - Use web URL
      'gmx.com': { name: 'GMX', webUrl: 'https://www.gmx.com', mobileUrl: 'https://www.gmx.com' },
      'gmx.de': { name: 'GMX', webUrl: 'https://www.gmx.net', mobileUrl: 'https://www.gmx.net' },
      'gmx.net': { name: 'GMX', webUrl: 'https://www.gmx.net', mobileUrl: 'https://www.gmx.net' },
      'web.de': { name: 'WEB.DE', webUrl: 'https://web.de', mobileUrl: 'https://web.de' },
      't-online.de': { name: 'T-Online', webUrl: 'https://email.t-online.de', mobileUrl: 'https://email.t-online.de' },
    };

    const provider = providers[domain];
    if (!provider) return null;

    return {
      name: provider.name,
      url: isMobileDevice ? provider.mobileUrl : provider.webUrl,
    };
  };

  const handleResendMagicLink = async (prevState: any, formData: FormData) => {
    trackSendAuthLink();
    markEmailAsUsed();

    const email = expiredEmailState || formData.get('email') as string;
    if (!email) {
      toast.error(t('pleaseEnterValidEmail'));
      return {};
    }

    setRegistrationEmail(email);

    const finalReturnUrl = returnUrl || '/dashboard';
    formData.append('email', email);
    formData.append('returnUrl', finalReturnUrl);
    // Use custom protocol for Electron, standard origin for web
    formData.append('origin', isElectron() ? getAuthOrigin() : window.location.origin);
    // If email is already known from expired link, assume terms were already accepted
    formData.append('acceptedTerms', 'true');
    // Flag for Electron to use custom callback handling
    if (isElectron()) {
      formData.append('isDesktopApp', 'true');
    }

    const result = await resendMagicLink(prevState, formData);

    // Magic link always returns success with message (no immediate redirect)
    if (result && typeof result === 'object' && 'success' in result && result.success) {
      if ('email' in result && result.email) {
        setRegistrationEmail(result.email as string);
        setLinkExpired(false);
        setRegistrationSuccess(true);
        // Clean up URL params
        const params = new URLSearchParams(window.location.search);
        params.delete('expired');
        params.delete('email');
        window.history.pushState({ path: window.location.pathname }, '', window.location.pathname + (params.toString() ? '?' + params.toString() : ''));
        return result;
      }
    }

    if (result && typeof result === 'object' && 'message' in result) {
      toast.error(t('signUpFailed'), {
        description: result.message as string,
        duration: 5000,
      });
      return {};
    }

    return result;
  };

  // Don't block render while checking auth - let content show immediately
  // The useEffect will redirect if user is already authenticated

  // Expired link view - always show resend form (Supabase clears session on expired links anyway)
  if (linkExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-full p-4 mb-6 inline-flex">
              <Clock className="h-12 w-12 text-orange-500 dark:text-orange-400" />
            </div>

            <h1 className="text-3xl font-semibold text-foreground mb-4">
              {t('magicLinkExpired')}
            </h1>

            <p className="text-muted-foreground mb-6">
              {t('magicLinkExpiredDescription')}
            </p>

            {expiredEmailState && (
              <p className="text-lg font-medium mb-6 text-foreground">
                {expiredEmailState}
              </p>
            )}

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-orange-800 dark:text-orange-400">
                {t('magicLinkDescription')}
              </p>
            </div>

            <form className="space-y-4">
              {!expiredEmailState && (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('emailAddress')}
                  required
                  onChange={(e) => setResendEmail(e.target.value)}
                />
              )}

              <SubmitButton
                formAction={handleResendMagicLink}
                className="w-full h-10"
                pendingText={t('resending')}
                disabled={!expiredEmailState && !resendEmail}
              >
                {t('resendMagicLink')}
              </SubmitButton>

              {/* Show "Open X" button when email is known */}
              {(() => {
                const email = expiredEmailState || resendEmail;
                const provider = email ? getEmailProviderInfo(email) : null;
                if (provider) {
                  return (
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <a
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('openProvider', { provider: provider.name })}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                }
                return null;
              })()}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Registration success view
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-full p-4 mb-6 inline-flex">
              <MailCheck className="h-12 w-12 text-green-500 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-semibold text-foreground mb-4">
              {t('checkYourEmail')}
            </h1>

            <p className="text-muted-foreground mb-2">
              {t('magicLinkSent') || 'We sent a magic link to'}
            </p>

            <p className="text-lg font-medium mb-6">
              {registrationEmail || t('emailAddress')}
            </p>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-800 dark:text-green-400">
                {t('magicLinkDescription') || 'Click the link in your email to sign in. The link will expire in 1 hour.'}
              </p>
            </div>

            {(() => {
              const provider = registrationEmail ? getEmailProviderInfo(registrationEmail) : null;
              if (provider) {
                return (
                  <Button asChild size="lg" className="w-full">
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('openProvider', { provider: provider.name })}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                );
              }
              return null;
            })()}

            <p className="text-sm text-muted-foreground text-center mt-6">
              {t('didntReceiveEmail')}{' '}
              <button
                onClick={() => {
                  setRegistrationSuccess(false);
                  const params = new URLSearchParams(window.location.search);
                  params.set('mode', 'signin');
                  const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
                  window.history.pushState({ path: newUrl }, '', newUrl);
                }}
                className="text-primary hover:underline font-medium"
              >
                {t('resend')}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center space-x-2">
          <MySanctumIcon size={28} />
        </Link>
      </div>
      <div className="flex min-h-screen">
        <div className="relative flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-sm">
            <div className="mb-4 flex items-center flex-col gap-3 sm:gap-4 justify-center">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground text-center leading-tight">
                Welcome to MySanctum
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Your Personal Data Vault
              </p>
            </div>
            
            {/* Google Login Button */}
            <div className="space-y-3 mb-3">
              <Suspense fallback={<div className="h-12 bg-muted/20 rounded-full animate-pulse" />}>
                <GoogleSignIn returnUrl={returnUrl || undefined} referralCode={referralCode} />
              </Suspense>
            </div>

            {/* Social Icon Buttons */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={async () => {
                  const supabase = (await import('@/lib/supabase/client')).createClient();
                  if (referralCode) {
                    document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
                  }
                  await supabase.auth.signInWithOAuth({
                    provider: 'twitter',
                    options: { redirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}` },
                  });
                }}
                className="w-14 h-14 rounded-lg bg-background border border-border hover:bg-accent flex items-center justify-center transition-colors"
                title="Sign in with X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              <button
                onClick={async () => {
                  const supabase = (await import('@/lib/supabase/client')).createClient();
                  if (referralCode) {
                    document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
                  }
                  await supabase.auth.signInWithOAuth({
                    provider: 'linkedin_oidc',
                    options: { redirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}` },
                  });
                }}
                className="w-14 h-14 rounded-lg bg-background border border-border hover:bg-accent flex items-center justify-center transition-colors"
                title="Sign in with LinkedIn"
              >
                <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>

              <button
                onClick={async () => {
                  const supabase = (await import('@/lib/supabase/client')).createClient();
                  if (referralCode) {
                    document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
                  }
                  await supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: { redirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}` },
                  });
                }}
                className="w-14 h-14 rounded-lg bg-background border border-border hover:bg-accent flex items-center justify-center transition-colors"
                title="Sign in with GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>

              <button
                onClick={() => {
                  const { toast } = require('@/lib/toast');
                  toast.info('Apple sign-in coming soon...');
                }}
                className="w-14 h-14 rounded-lg bg-background border border-border hover:bg-accent flex items-center justify-center transition-colors"
                title="Sign in with Apple"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>

              <button
                onClick={async () => {
                  const supabase = (await import('@/lib/supabase/client')).createClient();
                  if (referralCode) {
                    document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
                  }
                  await supabase.auth.signInWithOAuth({
                    provider: 'facebook',
                    options: { redirectTo: `${window.location.origin}/auth/callback${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}` },
                  });
                }}
                className="w-14 h-14 rounded-lg bg-background border border-border hover:bg-accent flex items-center justify-center transition-colors"
                title="Sign in with Facebook"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* "or" Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* Web3 Wallet Button */}
            <div className="mb-5">
              <Suspense fallback={
                <Button variant="outline" size="lg" className="w-full h-12" type="button" disabled>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L3 7V12C3 16.97 6.84 21.5 12 22.5C17.16 21.5 21 16.97 21 12V7L12 2Z" />
                  </svg>
                  <span>Continue with a wallet</span>
                </Button>
              }>
                <Web3LoginButton returnUrl={returnUrl || undefined} referralCode={referralCode} />
              </Suspense>
            </div>

            {/* Email Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  or Email
                </span>
              </div>
            </div>
            <form className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('emailAddress')}
                required
              />

              {referralCodeParam && (
                <div className="bg-card border rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">{t('referralCode')}</p>
                  <p className="text-sm font-semibold">{referralCode}</p>
                </div>
              )}

              {!referralCodeParam && <input type="hidden" name="referralCode" value={referralCode} />}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="gdprConsent"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  required
                  className="h-5 w-5"
                />
                <label
                  htmlFor="gdprConsent"
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none flex-1"
                >
                  {t.rich('acceptPrivacyTerms', {
                    privacyPolicy: (chunks) => {
                      return (
                        <a
                          href="https://www.mysanctum.ai/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-2 text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {chunks}
                        </a>
                      );
                    },
                    termsOfService: (chunks) => {
                      return (
                        <a
                          href="https://www.mysanctum.ai/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-2 text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {chunks}
                        </a>
                      );
                    }
                  })}
                </label>
              </div>

              <div className="relative">
                <SubmitButton
                  formAction={handleAuth}
                  className="w-full h-10"
                  pendingText={t('sending')}
                  disabled={!acceptedTerms}
                >
                  {t('sendMagicLink')}
                </SubmitButton>
                {wasEmailLastMethod && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm">
                    <div className="w-full h-full bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              {/* Magic Link Explanation */}
              <p className="text-xs text-muted-foreground text-center">
                {t('magicLinkExplanation')}
              </p>

              {/* Minimal Referral Link */}
              {!referralCodeParam && (
                <button
                  type="button"
                  onClick={() => setShowReferralDialog(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center mt-1"
                >
                  Have a referral code?
                </button>
              )}
            </form>

            {/* Referral Code Dialog */}
            <ReferralCodeDialog
              open={showReferralDialog}
              onOpenChange={setShowReferralDialog}
              referralCode={referralCode}
              onCodeChange={(code) => {
                setReferralCode(code);
                setShowReferralDialog(false);
              }}
            />
          </div>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <Suspense fallback={null}>
              <AnimatedBg
                variant="hero"
                customArcs={{
                  left: [
                    { pos: { left: -120, top: 150 }, opacity: 0.15 },
                    { pos: { left: -120, top: 400 }, opacity: 0.18 },
                  ],
                  right: [
                    { pos: { right: -150, top: 50 }, opacity: 0.2 },
                    { pos: { right: 10, top: 650 }, opacity: 0.17 },
                  ]
                }}
              />
            </Suspense>
          </div>

          <ExampleShowcase />
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <MySanctumIconAnimated size={48} speed={1} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
