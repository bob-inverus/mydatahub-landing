'use client';

import { motion } from 'framer-motion';
import { LocusShield } from './locus-shield';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Sparkles, 
  Key, 
  Lock, 
  ArrowRight,
  FileText,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';

/**
 * Sanctum Landing Page
 * Introduces the Universal Truth Protocol
 */
export function SanctumLanding() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sapphire-50 via-stone-50 to-amber-50 dark:from-void dark:via-void-light dark:to-void opacity-50" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <LocusShield size={180} animated={true} state="forging" className="mx-auto" />
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-stone-900 dark:text-stone-50">MYSANCTUM</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-sapphire-600 to-purple-600">
                  .AI
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-stone-700 dark:text-stone-300 font-light">
                The Universal Truth Protocol
              </p>
              
              <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Your sovereign data vault. Built on Base L2, secured by IPFS, 
                powered by cryptographic truth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/sanctum">
                <Button 
                  size="lg" 
                  className="bg-sapphire-600 hover:bg-sapphire-700 text-white px-8 text-lg h-14"
                >
                  Enter Your Sanctum
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-stone-300 dark:border-stone-700 text-lg h-14 px-8"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white dark:bg-void-light">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
              The Four Pillars
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300">
              From Defense to Creation to Infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Fortress',
                subtitle: 'Defense',
                description: 'End-to-end encrypted vault. Your data, your keys, absolute sovereignty.',
                gradient: 'from-stone-600 to-stone-800',
                delay: 0
              },
              {
                icon: Sparkles,
                title: 'Sanctuary',
                subtitle: 'Prosperity',
                description: 'Transform data into value. License access, maintain control, earn revenue.',
                gradient: 'from-amber-500 to-amber-700',
                delay: 0.1
              },
              {
                icon: Key,
                title: 'Agency',
                subtitle: 'Creation',
                description: 'Create with C2PA signatures. Prove authenticity, establish provenance.',
                gradient: 'from-sapphire-500 to-sapphire-700',
                delay: 0.2
              },
              {
                icon: Lock,
                title: 'Infrastructure',
                subtitle: 'Base Layer',
                description: 'Built on Base L2. Smart contracts, IPFS storage, on-chain truth.',
                gradient: 'from-purple-500 to-purple-700',
                delay: 0.3
              }
            ].map((pillar) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pillar.delay }}
              >
                <Card className="h-full border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 transition-all hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center`}>
                      <pillar.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {pillar.subtitle}
                      </p>
                    </div>
                    
                    <p className="text-stone-600 dark:text-stone-300">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4">
              Built for Sovereignty
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300">
              Enterprise-grade security with consumer simplicity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Client-Side Encryption',
                description: 'Files are encrypted on your device before upload. The server never sees your data in plaintext.'
              },
              {
                icon: Zap,
                title: 'Instant Revocation',
                description: 'Terminate access with a single on-chain transaction. No waiting, no intermediaries.'
              },
              {
                icon: Globe,
                title: 'IPFS Storage',
                description: 'Decentralized, censorship-resistant storage. Your data exists beyond any single server.'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-sapphire-100 to-sapphire-200 dark:from-sapphire-900 dark:to-sapphire-800 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-sapphire-600 dark:text-sapphire-300" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
                  {feature.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-sapphire-600 via-sapphire-700 to-purple-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Your Data. Your Rules. Your Revenue.
          </h2>
          
          <p className="text-xl text-sapphire-100">
            Join the sovereign data revolution. Build your vault today.
          </p>

          <Link href="/sanctum">
            <Button 
              size="lg" 
              className="bg-white hover:bg-stone-100 text-sapphire-700 px-12 text-lg h-14"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LocusShield size={40} state="idle" />
              <div className="text-sm">
                <div className="font-semibold text-stone-900 dark:text-stone-50">
                  MYSANCTUM.AI
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  The Universal Truth Protocol
                </div>
              </div>
            </div>
            
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Built on Base L2 • Secured by IPFS • Powered by Truth
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

