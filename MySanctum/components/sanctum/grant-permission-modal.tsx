'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Clock, 
  DollarSign, 
  Shield,
  Eye,
  Download,
  Share2,
  Calendar,
  Wallet
} from 'lucide-react';

type PermissionType = 'grant' | 'lease';
type AccessLevel = 'view' | 'download' | 'full';

interface GrantPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onGrant?: (permission: any) => void;
}

/**
 * Grant Permission Modal - Create Access Tokens or Revenue Streams
 * Two modes: Grant (temporary access) or Lease (payment stream)
 */
export function GrantPermissionModal({ 
  open, 
  onOpenChange, 
  fileName,
  onGrant 
}: GrantPermissionModalProps) {
  const [type, setType] = useState<PermissionType>('grant');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('view');
  const [walletAddress, setWalletAddress] = useState('');
  const [duration, setDuration] = useState('7'); // days
  const [price, setPrice] = useState('10'); // USDC per month
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate on-chain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onGrant) {
      onGrant({
        type,
        accessLevel,
        walletAddress,
        duration: type === 'grant' ? parseInt(duration) : undefined,
        price: type === 'lease' ? parseFloat(price) : undefined,
        fileName
      });
    }
    
    setIsCreating(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-600" />
            Grant Access
          </DialogTitle>
          <DialogDescription>
            Create a permission for: <span className="font-semibold">{fileName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permission Type */}
          <div className="space-y-3">
            <Label>Permission Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setType('grant')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'grant'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <Key className={`h-8 w-8 mb-2 ${type === 'grant' ? 'text-amber-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-stone-50">Grant</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  Temporary access token
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setType('lease')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'lease'
                    ? 'border-sapphire-500 bg-sapphire-50 dark:bg-sapphire-950/20'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <DollarSign className={`h-8 w-8 mb-2 ${type === 'lease' ? 'text-sapphire-600' : 'text-stone-400'}`} />
                <h4 className="font-semibold text-stone-900 dark:text-stone-50">Lease</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  Payment stream
                </p>
              </motion.button>
            </div>
          </div>

          {/* Recipient Wallet */}
          <div className="space-y-2">
            <Label htmlFor="wallet">
              <Wallet className="h-4 w-4 inline mr-1" />
              Recipient Wallet Address
            </Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Access Level */}
          <div className="space-y-3">
            <Label>Access Level</Label>
            <RadioGroup value={accessLevel} onValueChange={(v) => setAccessLevel(v as AccessLevel)}>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  <RadioGroupItem value="view" id="view" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="view" className="flex items-center gap-2 cursor-pointer">
                      <Eye className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                      <span className="font-semibold">View Only</span>
                    </Label>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      Can preview but not download
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  <RadioGroupItem value="download" id="download" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="download" className="flex items-center gap-2 cursor-pointer">
                      <Download className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                      <span className="font-semibold">Download</span>
                    </Label>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      Can download encrypted file (requires key)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  <RadioGroupItem value="full" id="full" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer">
                      <Share2 className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                      <span className="font-semibold">Full Access</span>
                    </Label>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      Can decrypt and access original file
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Duration or Price */}
          {type === 'grant' ? (
            <div className="space-y-2">
              <Label htmlFor="duration">
                <Clock className="h-4 w-4 inline mr-1" />
                Access Duration (Days)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="365"
              />
              <p className="text-xs text-stone-500">
                Access will expire after {duration} days
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="price">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Monthly Price (USDC)
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-stone-500">
                Recipient pays {price} USDC/month for continued access
              </p>
            </div>
          )}

          {/* Info Card */}
          <div className={`p-4 rounded-lg border ${
            type === 'grant' 
              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
              : 'bg-sapphire-50 dark:bg-sapphire-950/20 border-sapphire-200 dark:border-sapphire-800'
          }`}>
            <div className="flex items-start gap-2">
              <Shield className={`h-5 w-5 mt-0.5 ${
                type === 'grant' ? 'text-amber-600' : 'text-sapphire-600'
              }`} />
              <div className="text-sm">
                <p className={`font-medium ${
                  type === 'grant' 
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-sapphire-900 dark:text-sapphire-100'
                }`}>
                  {type === 'grant' ? 'Non-Transferable Token' : 'ERC-20 Stream'}
                </p>
                <p className={`mt-1 ${
                  type === 'grant'
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-sapphire-700 dark:text-sapphire-300'
                }`}>
                  {type === 'grant'
                    ? 'A soulbound token will be minted to the recipient wallet. You can revoke at any time.'
                    : 'A payment stream will be created. You can terminate the stream to revoke access instantly.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className={`flex-1 text-white ${
                type === 'grant'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-sapphire-600 hover:bg-sapphire-700'
              }`}
              disabled={!walletAddress || isCreating}
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Create {type === 'grant' ? 'Grant' : 'Lease'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

