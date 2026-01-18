'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LocusShieldProps {
  size?: number;
  animated?: boolean;
  state?: 'idle' | 'forging' | 'locked' | 'active';
  className?: string;
}

/**
 * The Locus Shield - The Mark of MYSANCTUM
 * Two interlocking arcs representing Vault (Shield) and Agency (Key)
 */
export function LocusShield({ 
  size = 120, 
  animated = false,
  state = 'idle',
  className = '' 
}: LocusShieldProps) {
  const [isForged, setIsForged] = useState(!animated);

  useEffect(() => {
    if (animated && state === 'forging') {
      setIsForged(false);
      const timer = setTimeout(() => setIsForged(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animated, state]);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.08;

  // Shield Arc - 270° heavy protective arc (Stone-900)
  const shieldPath = describeArc(centerX, centerY, radius, 45, 315);
  
  // User/Key Arc - Luminous active arc (Sapphire)
  const keyPath = describeArc(centerX, centerY, radius * 0.8, 225, 135);

  const shieldColor = state === 'active' ? '#1D4ED8' : '#1C1917'; // sapphire or stone-900
  const keyColor = state === 'locked' ? '#10B981' : '#1D4ED8'; // green when locked, sapphire otherwise
  const glowColor = state === 'active' ? 'rgba(29, 78, 216, 0.4)' : 'rgba(217, 119, 6, 0.3)';

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Glow effect */}
        {state === 'active' && (
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={glowColor}
            strokeWidth={strokeWidth * 2}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Shield Arc - The Vault */}
        {animated && !isForged ? (
          <motion.path
            d={shieldPath}
            fill="none"
            stroke={shieldColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0 
            }}
          />
        ) : (
          <path
            d={shieldPath}
            fill="none"
            stroke={shieldColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}

        {/* Key Arc - The Agency */}
        {animated && !isForged ? (
          <motion.path
            d={keyPath}
            fill="none"
            stroke={keyColor}
            strokeWidth={strokeWidth * 0.9}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2 
            }}
          />
        ) : (
          <path
            d={keyPath}
            fill="none"
            stroke={keyColor}
            strokeWidth={strokeWidth * 0.9}
            strokeLinecap="round"
            className={state === 'active' ? 'drop-shadow-[0_0_8px_rgba(29,78,216,0.6)]' : ''}
          />
        )}

        {/* Center point - the lock */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={strokeWidth * 0.6}
          fill={state === 'locked' ? '#10B981' : keyColor}
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3, type: "spring" }}
        />
      </svg>
    </div>
  );
}

/**
 * Utility to generate SVG arc path
 */
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

