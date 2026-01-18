'use client';

import { cn } from '@/lib/utils';
import { MySanctumIcon as MySanctumIconBase } from '@/components/icons/mysanctum-icon';

interface MySanctumLogoProps {
  size?: number;
  variant?: 'symbol' | 'logomark';
  className?: string;
}

export function MySanctumIcon({ size = 24, variant = 'symbol', className }: MySanctumLogoProps) {
  // Use MySanctumIcon for both symbol and logomark variants
  return <MySanctumIconBase size={size} className={cn('flex-shrink-0', className)} />;
}

