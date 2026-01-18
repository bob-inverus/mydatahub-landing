'use client';

import { cn } from "@/lib/utils"
import * as React from "react"
import type { SVGProps } from "react"

interface MySanctumIconAnimatedProps extends SVGProps<SVGSVGElement> {
  size?: number;
  /**
   * Animation speed multiplier
   * @default 1
   */
  speed?: number;
  /**
   * Whether to pulse instead of rotate
   * @default false
   */
  pulse?: boolean;
  /**
   * Whether to animate
   * @default true
   */
  animate?: boolean;
}

export function MySanctumIconAnimated({ 
  className, 
  size = 32, 
  speed = 1,
  pulse = false,
  animate = true,
  ...props 
}: MySanctumIconAnimatedProps) {
  const duration = 3 / speed; // 3 seconds divided by speed
  
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 42 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="MySanctum icon"
        className={cn(
          animate && (pulse ? 'animate-pulse' : 'animate-mysanctum-spin'),
          className
        )}
        style={animate && !pulse ? {
          animation: `mysanctum-spin ${duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`
        } : undefined}
        {...props}
      >
        <path d="M28.6006 4.61092C28.6006 7.15747 25.0511 9.22185 20.6725 9.22185C16.294 9.22185 12.7445 7.15747 12.7445 4.61092C12.7445 2.06438 16.294 0 20.6725 0C25.0511 0 28.6006 2.06438 28.6006 4.61092Z" fill="#2388FF"/>
        <path d="M28.6006 39.3534C28.6006 41.8999 25.0511 43.9643 20.6725 43.9643C16.294 43.9643 12.7445 41.8999 12.7445 39.3534C12.7445 36.8068 16.294 34.7424 20.6725 34.7424C25.0511 34.7424 28.6006 36.8068 28.6006 39.3534Z" fill="#2388FF"/>
        <path d="M9.62419 15.6045C11.8135 11.8127 11.7992 7.70592 9.59245 6.43179C7.38566 5.15766 3.82196 7.19864 1.6327 10.9905C-0.556566 14.7823 -0.542357 18.889 1.66443 20.1632C3.87122 21.4373 7.43493 19.3963 9.62419 15.6045Z" fill="#2388FF"/>
        <path d="M39.6799 23.8024C41.8852 25.0757 41.8982 29.1818 39.7089 32.9736C37.5197 36.7654 33.9572 38.8071 31.7519 37.5338C29.5466 36.2605 29.5336 32.1545 31.7228 28.3627C33.9121 24.5708 37.4746 22.5292 39.6799 23.8024Z" fill="#2388FF"/>
        <path d="M9.59389 37.5328C11.8007 36.2587 11.8149 32.1519 9.62562 28.3601C7.43636 24.5683 3.87265 22.5273 1.66586 23.8014C-0.540926 25.0756 -0.555135 29.1823 1.63413 32.9741C3.82339 36.7659 7.3871 38.8069 9.59389 37.5328Z" fill="#2388FF"/>
        <path d="M39.7111 10.993C41.9003 14.7848 41.8873 18.8908 39.682 20.1641C37.4767 21.4374 33.9142 19.3957 31.725 15.6039C29.5357 11.8121 29.5487 7.70602 31.754 6.43275C33.9593 5.15948 37.5218 7.20116 39.7111 10.993Z" fill="#2388FF"/>
      </svg>
      
      <style jsx>{`
        @keyframes mysanctum-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animate-mysanctum-spin {
          animation: mysanctum-spin 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  )
}

