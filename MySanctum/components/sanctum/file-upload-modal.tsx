'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Lock, 
  Shield, 
  CheckCircle2, 
  FileText,
  Image as ImageIcon,
  Film,
  X,
  AlertCircle
} from 'lucide-react';

type UploadStage = 'select' | 'encrypting' | 'uploading' | 'complete' | 'error';

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (file: any) => void;
}

/**
 * File Upload Modal - The Vault Sealing Process
 * Shows client-side encryption → IPFS pinning → On-chain registration
 */
export function FileUploadModal({ open, onOpenChange, onUploadComplete }: FileUploadModalProps) {
  const [stage, setStage] = useState<UploadStage>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [cid, setCid] = useState<string>('');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.startsWith('video/')) return Film;
    return FileText;
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStage('select');
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Stage 1: Encrypting
    setStage('encrypting');
    setProgress(0);
    
    // Simulate encryption process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    // Stage 2: Uploading to IPFS
    setStage('uploading');
    setProgress(0);
    
    // Simulate IPFS upload
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 80));
      setProgress(i);
    }

    // Generate mock CID
    const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setCid(mockCid);

    // Complete
    setStage('complete');
    
    // Call completion handler
    if (onUploadComplete) {
      onUploadComplete({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        cid: mockCid
      });
    }
  };

  const handleClose = () => {
    setStage('select');
    setSelectedFile(null);
    setProgress(0);
    setCid('');
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-sapphire-600" />
            Upload to Vault
          </DialogTitle>
          <DialogDescription>
            Files are encrypted client-side before upload. Only you hold the keys.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {stage === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!selectedFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl cursor-pointer hover:border-sapphire-400 dark:hover:border-sapphire-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-12 w-12 text-stone-400 dark:text-stone-600 mb-3" />
                      <p className="mb-2 text-sm text-stone-600 dark:text-stone-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-stone-500">
                        Any file type • Max 100MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="*/*"
                    />
                  </label>
                ) : (
                  <div className="border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const Icon = getFileIcon(selectedFile.type);
                        return (
                          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                            <Icon className="h-8 w-8 text-stone-600 dark:text-stone-300" />
                          </div>
                        );
                      })()}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 dark:text-stone-50 truncate">
                          {selectedFile.name}
                        </h4>
                        <p className="text-sm text-stone-600 dark:text-stone-300">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-sapphire-50 dark:bg-sapphire-950/20 rounded-lg border border-sapphire-200 dark:border-sapphire-800">
                      <div className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-sapphire-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-sapphire-900 dark:text-sapphire-100">
                            End-to-End Encryption
                          </p>
                          <p className="text-sapphire-700 dark:text-sapphire-300 mt-1">
                            File will be encrypted with your wallet signature before leaving your device
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <Button
                    onClick={handleUpload}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    size="lg"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Encrypt & Upload to Vault
                  </Button>
                )}
              </motion.div>
            )}

            {stage === 'encrypting' && (
              <motion.div
                key="encrypting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 py-8"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="h-16 w-16 text-sapphire-600" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                      Encrypting File...
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                      Using your wallet signature to encrypt data
                    </p>
                  </div>

                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-stone-500 mt-2">{progress}% complete</p>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 py-8"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Upload className="h-16 w-16 text-amber-600" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                      Uploading to IPFS...
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                      Pinning encrypted file to decentralized storage
                    </p>
                  </div>

                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-stone-500 mt-2">{progress}% complete</p>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-4 py-8"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                      File Secured!
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                      Your file is encrypted and stored on IPFS
                    </p>
                  </div>

                  <div className="w-full max-w-md p-4 bg-stone-100 dark:bg-stone-800 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">File:</span>
                        <span className="font-medium text-stone-900 dark:text-stone-50 truncate max-w-[200px]">
                          {selectedFile?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600 dark:text-stone-400">Status:</span>
                        <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                          Encrypted
                        </Badge>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-stone-600 dark:text-stone-400">CID:</span>
                        <code className="font-mono text-xs text-stone-900 dark:text-stone-50 break-all max-w-[200px]">
                          {cid}
                        </code>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleClose}
                    className="w-full bg-sapphire-600 hover:bg-sapphire-700 text-white"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

