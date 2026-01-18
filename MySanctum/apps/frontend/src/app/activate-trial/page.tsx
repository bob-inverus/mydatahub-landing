'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, LogOut, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { clearUserLocalStorage } from '@/lib/utils/clear-local-storage';
import { useAuth } from '@/components/AuthProvider';
import { useAccountState, useTrialStatus } from '@/hooks/billing';
import { useMaintenanceNoticeQuery } from '@/hooks/edge-flags';
import { useAdminRole } from '@/hooks/admin';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActivateTrialPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);
  
  // Backend state checks
  const { data: accountState, isLoading: accountLoading } = useAccountState({
    enabled: !!user && !hasAttemptedRedirect,
  });
  const { data: trialStatus, isLoading: trialLoading } = useTrialStatus({
    enabled: !!user && !hasAttemptedRedirect,
  });
  const { data: maintenanceData } = useMaintenanceNoticeQuery();
  const { data: adminData } = useAdminRole();
  
  const isAdmin = adminData?.isAdmin ?? false;
  const isLoading = authLoading || accountLoading || trialLoading;

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && !user && !hasAttemptedRedirect) {
      setHasAttemptedRedirect(true);
      router.push('/auth');
    }
  }, [user, authLoading, router, hasAttemptedRedirect]);

  // Check if user already has access and should go to dashboard
  useEffect(() => {
    if (
      !isLoading &&
      user &&
      accountState &&
      !hasAttemptedRedirect
    ) {
      const tierKey = accountState.subscription?.tier_key;
      const hasPaidTier = tierKey && 
        tierKey !== 'none' && 
        tierKey !== 'free';
      const hasFreeTier = tierKey === 'free';
      const hasActiveTrial = accountState.subscription?.is_trial && 
        accountState.subscription?.trial_status === 'active';

      // If user already has access, redirect to dashboard
      if (hasPaidTier || hasFreeTier || hasActiveTrial) {
        setHasAttemptedRedirect(true);
        router.push('/dashboard');
      }
    }
  }, [user, accountState, isLoading, router, hasAttemptedRedirect]);

  const handleStartTrial = () => {
    // Navigate to setting-up page to show loading animation
    console.log('Premium trial selected, navigating to setting-up');
    toast.success('Welcome to MySanctum Premium!');
    setHasAttemptedRedirect(true);
    window.location.href = '/setting-up';
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUserLocalStorage();
    router.push('/auth');
  };

  const plans: Array<{
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: 'outline' | 'default';
    isPrimary: boolean;
    note?: string;
  }> = [
    {
      name: 'Free Access',
      price: 0,
      period: 'forever',
      description: 'Explore MySanctum with basic features',
      features: [
        'Access to basic data vault',
        'Limited storage capacity',
        'Community support',
        'Basic privacy controls',
      ],
      buttonText: 'Continue Free',
      buttonVariant: 'outline' as const,
      isPrimary: false,
    },
    {
      name: 'Premium Trial',
      price: 0,
      period: '7 days free',
      description: 'Full access with advanced security features',
      features: [
        'Unlimited secure data vault',
        'Advanced encryption & privacy',
        'Priority support',
        'Full data sovereignty controls',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const,
      isPrimary: true,
      note: 'No credit card required',
    },
  ];

  // Show loading state while checking authentication and account status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="flex flex-col justify-center items-center gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex justify-center items-center flex-wrap gap-6 px-2 max-w-5xl">
            <Skeleton className="w-80 h-96 rounded-2xl" />
            <Skeleton className="w-80 h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Check for maintenance mode (unless user is admin)
  const isMaintenanceActive = (() => {
    if (!maintenanceData?.enabled || !maintenanceData.startTime || !maintenanceData.endTime) {
      return false;
    }
    const now = new Date();
    const start = new Date(maintenanceData.startTime);
    const end = new Date(maintenanceData.endTime);
    return now >= start && now <= end;
  })();

  if (isMaintenanceActive && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Maintenance in Progress</h1>
          <p className="text-muted-foreground">
            MySanctum is currently undergoing maintenance. Please check back soon.
          </p>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 mb-8">
        <div className="text-2xl sm:text-3xl font-medium">
          Choose Your Plan
        </div>
        <span className="text-center text-muted-foreground text-sm sm:text-base">
          Start securing your data today <br /> with free access or unlock premium features
        </span>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-6 px-2 mb-3 max-w-5xl">
        {plans.map((plan, index) => (
          <div 
            key={plan.name} 
            className={`bg-card w-80 rounded-2xl h-auto pb-10 shadow-lg border-2 ${
              plan.isPrimary ? 'border-blue-600' : 'border-border'
            }`}
          >
            <div className="p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold">{plan.name}</span>
                {plan.isPrimary && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <div className="mt-3 mb-2">
                <span className="text-foreground text-3xl font-bold">
                  ${plan.price}
                  <span className="text-xs text-muted-foreground ml-2">
                    {plan.period}
                  </span>
                </span>
              </div>
              <span className="text-muted-foreground text-sm">{plan.description}</span>
              {plan.note && (
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>{plan.note}</span>
                </div>
              )}
              <div className="mt-5">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (index === 0) {
                      // Free access - show setting up animation first
                      console.log('Free access clicked, navigating to setting-up');
                      setHasAttemptedRedirect(true);
                      window.location.href = '/setting-up';
                    } else {
                      // Premium trial - start trial process
                      handleStartTrial();
                    }
                  }}
                  variant={plan.buttonVariant}
                  className={`w-full h-10 ${
                    plan.isPrimary ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-2xl pl-5 pt-2">
              <span className="text-foreground font-semibold">Features</span>
              {plan.features.map((feature, featureIndex) => (
                <span key={featureIndex} className="text-muted-foreground text-sm flex items-center gap-2 mt-2">
                  <CheckCircle className={`h-5 w-5 ${plan.isPrimary ? 'text-blue-600' : 'text-muted-foreground'}`} />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-2 mt-6 max-w-2xl">
        <p className="text-xs">
          By continuing, you agree to our{' '}
          <Link href="/legal?tab=terms" className="underline hover:text-blue-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal?tab=privacy" className="underline hover:text-blue-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
} 