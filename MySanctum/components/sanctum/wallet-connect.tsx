'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, Shield, Key, ExternalLink } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

/**
 * Wallet Connect Component
 * Foundation for Coinbase CDP integration
 * For MVP: Simulates wallet connection
 */
export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection (In production: Coinbase CDP SDK)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock wallet address
    const mockAddress = `0x${Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
    
    if (onConnect) {
      onConnect(mockAddress);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Card className="border-sapphire-200 dark:border-sapphire-800 bg-sapphire-50/50 dark:bg-sapphire-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sapphire-500 to-sapphire-700 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                    Connected
                  </Badge>
                </div>
                <p className="font-mono text-sm text-stone-900 dark:text-stone-50 mt-1">
                  {formatAddress(walletAddress)}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 dark:border-stone-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-sapphire-600" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription>
          Connect to access your sovereign data vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coinbase Wallet Option */}
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-sapphire-600 hover:bg-sapphire-700 text-white"
          size="lg"
        >
          {isConnecting ? (
            <>Connecting...</>
          ) : (
            <>
              <Wallet className="h-5 w-5 mr-2" />
              Connect with Coinbase
            </>
          )}
        </Button>

        {/* Info about MPC */}
        <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <Shield className="h-4 w-4 text-sapphire-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-stone-900 dark:text-stone-50">
                Multi-Party Computation (MPC)
              </p>
              <p className="text-stone-600 dark:text-stone-300 text-xs mt-1">
                Your key is split between you and Coinbase. Neither can access alone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Key className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-stone-900 dark:text-stone-50">
                Sovereign Eject Available
              </p>
              <p className="text-stone-600 dark:text-stone-300 text-xs mt-1">
                Export your full private key anytime for absolute custody
              </p>
            </div>
          </div>
        </div>

        {/* Learn More Link */}
        <a 
          href="#" 
          className="flex items-center justify-center gap-1 text-sm text-sapphire-600 hover:text-sapphire-700"
        >
          Learn about Coinbase CDP
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

