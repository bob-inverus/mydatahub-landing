'use client';

import { MorphPanel } from './ask-sanctum';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function VaultDashboardContent() {
  const { state } = useSidebar();
  const isSidebarCollapsed = state === 'collapsed';

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Sticky Ask Sanctum Button - Centered on main content area */}
      <div className={cn(
        "fixed bottom-12 z-50 transition-all duration-300",
        isSidebarCollapsed ? "left-1/2" : "left-[calc(50%+128px)]",
        "-translate-x-1/2"
      )}>
        <MorphPanel />
      </div>
    </div>
  );
}

