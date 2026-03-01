'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function Logo({ 
  variant = 'full', 
  size = 'md', 
  className,
  showText = true 
}: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', bolt: 'w-3.5 h-3.5' },
    md: { icon: 'w-8 h-8', text: 'text-xl', bolt: 'w-4 h-4' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', bolt: 'w-5 h-5' },
  };

  const { icon, text, bolt } = sizes[size];

  return (
    <Link href="/" className={cn('flex items-center gap-2.5 group', className)}>
      {/* Icon Container */}
      <div 
        className={cn(
          icon,
          'relative flex items-center justify-center rounded-lg overflow-hidden',
          'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
          'shadow-lg shadow-orange-500/25',
          'group-hover:shadow-orange-500/40 group-hover:scale-105',
          'transition-all duration-200'
        )}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        
        {/* Bolt/Lightning Icon - Custom SVG for better control */}
        <svg 
          viewBox="0 0 24 24" 
          className={cn(bolt, 'relative z-10 text-white')}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        
        {/* Subtle pulse animation on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
      </div>
      
      {/* Text */}
      {(variant === 'full' || variant === 'text') && showText && (
        <span 
          className={cn(
            text,
            'font-bold text-white tracking-tight',
            'group-hover:text-orange-400 transition-colors duration-200'
          )}
        >
          Field<span className="text-orange-400">Flow</span>
        </span>
      )}
    </Link>
  );
}

// Alternative compact version for navbar
export function LogoCompact({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <div 
        className={cn(
          'w-8 h-8 relative flex items-center justify-center rounded-lg overflow-hidden',
          'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
          'shadow-md shadow-orange-500/20',
          'group-hover:shadow-orange-500/30 group-hover:scale-105',
          'transition-all duration-200'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 relative z-10 text-white"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <span className="text-lg font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors">
        Field<span className="text-orange-400">Flow</span>
      </span>
    </Link>
  );
}

// Icon only version for app header
export function LogoIcon({ className }: { className?: string }) {
  return (
    <Link href="/app" className={cn('group', className)}>
      <div 
        className={cn(
          'w-7 h-7 relative flex items-center justify-center rounded-lg overflow-hidden',
          'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
          'shadow-md shadow-orange-500/20',
          'group-hover:shadow-orange-500/30 group-hover:scale-105',
          'transition-all duration-200'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        <svg 
          viewBox="0 0 24 24" 
          className="w-3.5 h-3.5 relative z-10 text-white"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    </Link>
  );
}

export default Logo;
