'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

interface Web3LoginButtonProps {
  returnUrl?: string;
  referralCode?: string;
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Web3LoginButton({ returnUrl, referralCode }: Web3LoginButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    // Check if MetaMask or other wallet is installed
    if (!window.ethereum) {
      toast.error('No Web3 wallet detected. Please install MetaMask or another wallet.');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      
      if (!address) {
        throw new Error('No account found');
      }

      // Create a message to sign (SIWE format)
      const message = `Sign in to MySanctum\n\nWallet Address: ${address}\nTimestamp: ${new Date().toISOString()}\nNonce: ${Math.random().toString(36).substring(7)}`;

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Send to backend for verification and session creation
      const response = await fetch('/api/auth/web3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          message,
          referralCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const data = await response.json();

      toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);

      // Redirect to return URL or dashboard
      const redirectUrl = returnUrl || '/dashboard';
      router.push(redirectUrl);
      
    } catch (error: any) {
      console.error('Web3 login error:', error);
      
      if (error.code === 4001) {
        toast.error('Connection request rejected');
      } else if (error.message.includes('User rejected')) {
        toast.error('Signature request rejected');
      } else {
        toast.error(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="lg"
      className="w-full h-12"
      type="button"
      disabled={isConnecting}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L3 7V12C3 16.97 6.84 21.5 12 22.5C17.16 21.5 21 16.97 21 12V7L12 2Z" />
      </svg>
      <span>{isConnecting ? 'Connecting...' : 'Continue with a wallet'}</span>
    </Button>
  );
}
