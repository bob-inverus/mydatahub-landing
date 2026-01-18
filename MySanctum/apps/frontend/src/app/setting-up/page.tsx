'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Sparkles, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useVaultInitialization, useVaultStatus } from '@/hooks/vault/use-vault-initialization';
import { useVaultDiscovery, useIntegrateVaultItem, type DiscoverableItem } from '@/hooks/vault/use-vault-discovery';
import { createClient } from '@/lib/supabase/client';
import { MySanctumIconAnimated } from '@/components/icons/mysanctum-icon-animated';
import { MySanctumIcon } from '@/components/sidebar/mysanctum-logo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/lib/toast';

export default function SettingUpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'checking' | 'initializing' | 'discovery' | 'verification' | 'success' | 'error'>('checking');
  const [integratingItems, setIntegratingItems] = useState<Set<string>>(new Set());
  const [trustSignalEnabled, setTrustSignalEnabled] = useState(false);
  const [anonymousTrustEnabled, setAnonymousTrustEnabled] = useState(false);
  const vaultInitMutation = useVaultInitialization();
  const { data: vaultStatus } = useVaultStatus();
  const { data: discoverableItems, isLoading: isDiscovering } = useVaultDiscovery();
  const integrateMutation = useIntegrateVaultItem();
  const hasAttemptedInit = useRef(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (hasAttemptedInit.current) return;
    if (status !== 'checking') return;
    if (isInitializing.current) return;

    // Mark as attempted immediately to prevent multiple calls
    hasAttemptedInit.current = true;
    isInitializing.current = true;

    // Check if vault is already initialized
    const initializeVault = async () => {
      try {
        const supabase = createClient();
        
        // Check if vault exists and is initialized
        const { data: vault, error: vaultError } = await supabase
          .from('user_vaults')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (vaultError && vaultError.code !== 'PGRST116') {
          // Error other than "not found"
          throw vaultError;
        }

        // If vault is already initialized, go to discovery
        if (vault && vault.is_initialized) {
          console.log('✅ Vault already initialized, checking for additional data');
          isInitializing.current = false;
          setStatus('discovery');
          return;
        }

        // Vault exists but not initialized, or doesn't exist - initialize it
        console.log('🔄 Initializing vault with OAuth data...');
        setStatus('initializing');
        
        if (!vaultInitMutation.isPending) {
          vaultInitMutation.mutate(undefined, {
            onSuccess: (result) => {
              console.log('✅ Vault initialized:', result);
              isInitializing.current = false;
              // Move to discovery phase
              setStatus('discovery');
            },
            onError: (error) => {
              console.error('❌ Vault initialization error:', error);
              // Even if vault init fails, move to discovery
              isInitializing.current = false;
              setStatus('discovery');
            },
          });
        } else {
          isInitializing.current = false;
        }
      } catch (error) {
        console.error('Error checking vault:', error);
        // Database error - proceed to dashboard anyway
        console.log('⚠️ Database check failed, proceeding to dashboard');
        isInitializing.current = false;
        setStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    };

    initializeVault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  // Handle integrating individual items
  const handleIntegrateItem = async (item: DiscoverableItem) => {
    setIntegratingItems(prev => new Set(prev).add(item.id));
    
    try {
      await integrateMutation.mutateAsync(item);
      toast.success(`${item.label} integrated successfully!`);
      
      // Remove from integrating set
      setIntegratingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to integrate item');
      setIntegratingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  // Handle skipping discovery and going to verification
  const handleSkipDiscovery = () => {
    setStatus('verification');
  };

  // Handle entering sanctum (complete setup)
  const handleEnterSanctum = () => {
    setStatus('success');
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="w-full relative overflow-hidden min-h-screen bg-background">
      <div className="relative flex flex-col items-center w-full px-4 sm:px-6 min-h-screen justify-center">
        <div className="relative z-10 w-full max-w-[680px] flex flex-col items-center gap-8">
          {/* Static MySanctum Logo with Brand */}
          <div className="flex flex-row items-center gap-3 mb-4">
            <MySanctumIcon size={32} />
            <h1 className="text-2xl font-semibold text-foreground tracking-tight leading-none">
              MySanctum
            </h1>
          </div>

          <h2 className="text-[32px] font-semibold text-foreground text-center leading-tight tracking-tight">
            {(status === 'checking' || status === 'initializing') && 'Setting Up Your Vault'}
            {status === 'discovery' && 'Enhance Your Vault'}
            {status === 'verification' && 'Enable Passive Verification'}
            {status === 'success' && "You're All Set!"}
            {status === 'error' && 'Setup Issue'}
          </h2>

          <p className="text-[15px] text-muted-foreground text-center opacity-80 max-w-md">
            {(status === 'checking' || status === 'initializing') && 
              "We're creating your secure vault and preparing everything you need to protect your data."}
            {status === 'discovery' && 
              "We found additional data from your profile. Choose what you'd like to add to your vault."}
            {status === 'verification' && 
              "Allow your vault to anonymously verify your humanity to trusted partners. Data never leaves."}
            {status === 'success' && 
              "Your vault is ready. Taking you to dashboard..."}
            {status === 'error' && 
              (vaultInitMutation.error instanceof Error 
                ? vaultInitMutation.error.message 
                : "An error occurred during vault setup. You can still continue - we'll try again later.")}
          </p>

          {/* Main Card Container - All phases use this */}
          <Card className="w-full bg-card border border-border rounded-2xl">
            <CardContent className="p-6">
              
              {/* PHASE 1: Checking/Initializing */}
              {(status === 'checking' || status === 'initializing') && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
                      <span className="text-base font-medium text-blue-400">Initializing</span>
                    </div>
                    <p className="text-base text-muted-foreground">Setting up your vault...</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center ml-4">
                    <MySanctumIconAnimated size={32} speed={1.2} />
                  </div>
                </div>
              )}

              {/* PHASE 2: Discovery */}
              {status === 'discovery' && (
                <>
                  {isDiscovering ? (
                    <div className="flex items-center justify-center gap-3">
                      <MySanctumIconAnimated size={24} speed={1.5} />
                      <span className="text-muted-foreground">Discovering available data...</span>
                    </div>
                  ) : discoverableItems && discoverableItems.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {discoverableItems.map((item) => (
                        <div key={item.id} className="p-4 border border-border rounded-xl hover:border-blue-500/50 transition-colors bg-card/50">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {item.icon && <span className="text-lg">{item.icon}</span>}
                                <span className="text-base font-medium text-foreground truncate">
                                  {item.label}
                                </span>
                                {item.is_sensitive && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full">
                                    Sensitive
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-1">
                                From: {item.source_provider}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleIntegrateItem(item)}
                              disabled={integratingItems.has(item.id)}
                              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-lg"
                            >
                              {integratingItems.has(item.id) ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Integrating
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Integrate
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
                          <span className="text-base font-medium text-green-400">Complete</span>
                        </div>
                        <p className="text-base text-muted-foreground">All available data has been collected!</p>
                      </div>
                      <div className="h-12 w-12 flex items-center justify-center ml-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* PHASE 3: Verification */}
              {status === 'verification' && (
                <div className="space-y-6">
                  {/* Trust Signal Toggle */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-base font-medium text-foreground">Activate Trust Signal</p>
                        <p className="text-sm text-muted-foreground">Enable anonymous verification</p>
                      </div>
                    </div>
                    <Switch
                      checked={trustSignalEnabled}
                      onCheckedChange={setTrustSignalEnabled}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  {/* Anonymous Trust Contribution Toggle */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-base font-medium text-foreground">Anonymous Trust Contribution</p>
                        <p className="text-sm text-muted-foreground">Help build global trust network</p>
                      </div>
                    </div>
                    <Switch
                      checked={anonymousTrustEnabled}
                      onCheckedChange={setAnonymousTrustEnabled}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* PHASE 4: Success */}
              {status === 'success' && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
                      <span className="text-base font-medium text-green-400">Ready</span>
                    </div>
                    <p className="text-base text-muted-foreground">Welcome to your vault!</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center ml-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              )}

              {/* PHASE 5: Error */}
              {status === 'error' && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2.5 w-2.5 bg-red-500 rounded-full"></div>
                      <span className="text-base font-medium text-red-400">Setup Error</span>
                    </div>
                    <p className="text-base text-muted-foreground">Don't worry, you can try again later.</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center ml-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Action Button - Below Card */}
          {status === 'discovery' && (
            <Button
              onClick={handleSkipDiscovery}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Continue
            </Button>
          )}

          {status === 'verification' && (
            <Button
              onClick={handleEnterSanctum}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Enter Sanctum
            </Button>
          )}

          {status === 'error' && (
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Continue to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
