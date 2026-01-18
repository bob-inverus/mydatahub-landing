'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocusShield } from './locus-shield';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Key, Lock, Sparkles } from 'lucide-react';

type InductionStep = 'welcome' | 'philosophy' | 'forge' | 'identity' | 'complete';

interface InductionFlowProps {
  onComplete: () => void;
}

/**
 * The Induction Flow - First Contact with The Sanctum
 * Guides users through the philosophy and forges their identity
 */
export function InductionFlow({ onComplete }: InductionFlowProps) {
  const [step, setStep] = useState<InductionStep>('welcome');
  const [isForging, setIsForging] = useState(false);

  const nextStep = () => {
    const steps: InductionStep[] = ['welcome', 'philosophy', 'forge', 'identity', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleForge = () => {
    setIsForging(true);
    setTimeout(() => {
      nextStep();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md text-center space-y-8"
          >
            <LocusShield size={160} animated={true} state="forging" className="mx-auto" />
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Welcome to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-sapphire-600">
                  MYSANCTUM.AI
                </span>
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-300">
                The Universal Truth Protocol
              </p>
            </div>

            <Button 
              onClick={nextStep}
              size="lg"
              className="bg-sapphire-600 hover:bg-sapphire-700 text-white px-8"
            >
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {step === 'philosophy' && (
          <motion.div
            key="philosophy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl space-y-8 px-4"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                The Four Pillars
              </h2>
              <p className="text-stone-600 dark:text-stone-300">
                From Defense to Creation to Infrastructure
              </p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Fortress',
                  subtitle: 'Defense',
                  description: 'Your data, encrypted and sovereign. No one can access without your permission.',
                  color: 'text-stone-700 dark:text-stone-300'
                },
                {
                  icon: Sparkles,
                  title: 'Sanctuary',
                  subtitle: 'Prosperity',
                  description: 'Transform your vault into value. License your data, maintain control.',
                  color: 'text-amber-600'
                },
                {
                  icon: Key,
                  title: 'Agency',
                  subtitle: 'Creation',
                  description: 'Create, sign, and prove authenticity with C2PA standards.',
                  color: 'text-sapphire-600'
                },
                {
                  icon: Lock,
                  title: 'Infrastructure',
                  subtitle: 'The Base Layer',
                  description: 'Built on Base L2, IPFS, and cryptographic truth.',
                  color: 'text-platinum-dark dark:text-platinum'
                }
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-void-light/50 backdrop-blur-sm border border-stone-200 dark:border-stone-700"
                >
                  <div className={`flex-shrink-0 ${pillar.color}`}>
                    <pillar.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                      {pillar.title} <span className="text-sm text-stone-500">({pillar.subtitle})</span>
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                size="lg"
                className="bg-sapphire-600 hover:bg-sapphire-700 text-white"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'forge' && (
          <motion.div
            key="forge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="max-w-md text-center space-y-12"
          >
            <div className="space-y-6">
              <LocusShield 
                size={200} 
                animated={true} 
                state={isForging ? 'forging' : 'idle'}
                className="mx-auto" 
              />
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                  {isForging ? 'Forging Your Sanctuary...' : 'Ready to Forge'}
                </h2>
                <p className="text-stone-600 dark:text-stone-300">
                  {isForging 
                    ? 'Creating your sovereign identity on-chain'
                    : 'Create your encrypted vault and sovereign identity'
                  }
                </p>
              </div>
            </div>

            {!isForging && (
              <Button 
                onClick={handleForge}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-12 animate-pulse-glow"
              >
                Forge My Sanctum
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            )}

            {isForging && (
              <div className="flex items-center justify-center gap-2 text-stone-600 dark:text-stone-300">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-sapphire-600 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'identity' && (
          <motion.div
            key="identity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md text-center space-y-8"
          >
            <LocusShield size={120} state="locked" className="mx-auto" />
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                Choose Your Path
              </h2>
              <p className="text-stone-600 dark:text-stone-300">
                How would you like to access your Sanctum?
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onComplete}
                size="lg"
                variant="outline"
                className="w-full border-sapphire-600 text-sapphire-600 hover:bg-sapphire-50 dark:hover:bg-sapphire-950"
              >
                <Key className="mr-2 h-5 w-5" />
                Connect Wallet (Coinbase)
              </Button>
              
              <Button 
                onClick={onComplete}
                size="lg"
                variant="outline"
                className="w-full"
              >
                Email / Social Login
              </Button>

              <p className="text-xs text-stone-500 dark:text-stone-400 pt-2">
                Your keys are split using MPC. You can export full custody anytime.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

