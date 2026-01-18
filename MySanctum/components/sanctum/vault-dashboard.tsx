'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LocusShield } from './locus-shield';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Shield, 
  Key, 
  FileText, 
  Image as ImageIcon, 
  Film,
  Lock,
  Unlock,
  ExternalLink,
  Trash2,
  Plus,
  Settings
} from 'lucide-react';

interface VaultItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'other';
  size: string;
  uploadedAt: Date;
  encrypted: boolean;
  cid?: string; // IPFS Content ID
  grants: number; // Number of active permissions
  leases: number; // Number of active leases
}

interface VaultDashboardProps {
  userName?: string;
  walletAddress?: string;
}

/**
 * Vault Dashboard - The Main Control Center
 * Manage files, permissions, and sovereignty
 */
export function VaultDashboard({ userName = 'Sovereign', walletAddress }: VaultDashboardProps) {
  const [items, setItems] = useState<VaultItem[]>([
    {
      id: '1',
      name: 'Medical Records 2024.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedAt: new Date('2024-01-15'),
      encrypted: true,
      cid: 'Qm...',
      grants: 2,
      leases: 1
    },
    {
      id: '2',
      name: 'Identity Verification.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadedAt: new Date('2024-01-20'),
      encrypted: true,
      cid: 'Qm...',
      grants: 0,
      leases: 0
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('vault');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'image': return ImageIcon;
      case 'video': return Film;
      default: return FileText;
    }
  };

  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-void/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LocusShield size={48} state="active" />
            <div>
              <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">
                MYSANCTUM.AI
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {walletAddress ? formatAddress(walletAddress) : 'Not Connected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">
                Total Encrypted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-stone-900 dark:text-stone-50">
                  {items.length}
                </span>
                <span className="text-sm text-stone-500">items</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-stone-500">
                <Lock className="h-3 w-3" />
                <span>All encrypted with your key</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Active Grants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {items.reduce((acc, item) => acc + item.grants, 0)}
                </span>
                <span className="text-sm text-amber-600 dark:text-amber-400">permissions</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 dark:text-amber-400">
                <Key className="h-3 w-3" />
                <span>Temporary access tokens</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sapphire-200 dark:border-sapphire-900 bg-sapphire-50/50 dark:bg-sapphire-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-sapphire-700 dark:text-sapphire-300">
                Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-sapphire-700 dark:text-sapphire-300">
                  {items.reduce((acc, item) => acc + item.leases, 0)}
                </span>
                <span className="text-sm text-sapphire-600 dark:text-sapphire-400">streams</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-sapphire-600 dark:text-sapphire-400">
                <Shield className="h-3 w-3" />
                <span>Revenue generating</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="vault">
                <Shield className="h-4 w-4 mr-2" />
                Vault
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Key className="h-4 w-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload to Vault
            </Button>
          </div>

          <TabsContent value="vault" className="space-y-4">
            {items.length === 0 ? (
              <Card className="border-dashed border-2 border-stone-300 dark:border-stone-700">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Upload className="h-16 w-16 text-stone-400 dark:text-stone-600 mb-4" />
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                    Your Vault is Empty
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 mb-4 max-w-sm">
                    Upload your first file to create an encrypted, sovereign data vault
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First File
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => {
                  const Icon = getFileIcon(item.type);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="border-stone-200 dark:border-stone-700 hover:border-sapphire-300 dark:hover:border-sapphire-700 transition-colors">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                              <Icon className="h-6 w-6 text-stone-600 dark:text-stone-300" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                                  {item.name}
                                </h3>
                                {item.encrypted && (
                                  <Badge variant="outline" className="text-xs border-sapphire-600 text-sapphire-600">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Encrypted
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-300">
                                <span>{item.size}</span>
                                <span>•</span>
                                <span>{item.uploadedAt.toLocaleDateString()}</span>
                                {item.cid && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono text-xs">IPFS: {item.cid}</span>
                                  </>
                                )}
                              </div>
                              {(item.grants > 0 || item.leases > 0) && (
                                <div className="flex items-center gap-3 mt-2">
                                  {item.grants > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                      {item.grants} Grant{item.grants !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  {item.leases > 0 && (
                                    <Badge variant="secondary" className="text-xs bg-sapphire-100 dark:bg-sapphire-950 text-sapphire-700 dark:text-sapphire-300">
                                      {item.leases} Lease{item.leases !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Key className="h-4 w-4 mr-2" />
                              Manage Access
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader>
                <CardTitle>Permission Management</CardTitle>
                <CardDescription>
                  View and manage who has access to your vault items
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12 text-stone-600 dark:text-stone-300">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active permissions yet</p>
                <p className="text-sm mt-2">Grant access to specific items to get started</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

