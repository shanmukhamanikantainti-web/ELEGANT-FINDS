'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'luxury'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
  glowColor?: string
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  glowColor = 'rgba(122, 30, 44, 0.5)',
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-cormorant uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'

  const variants = {
    primary: 'bg-burgundy-700 text-white hover:bg-burgundy-800',
    secondary: 'bg-transparent border-2 border-burgundy-700 text-burgundy-700 hover:bg-burgundy-700 hover:text-white',
    ghost: 'text-burgundy-700 hover:text-burgundy-900 hover:bg-rose-50',
    outline: 'border-2 border-charcoal-800 text-charcoal-800 hover:bg-charcoal-800 hover:text-white',
    luxury: 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white hover:from-burgundy-800 hover:to-burgundy-900',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {/* Glow effect overlay */}
      {variant === 'primary' && !disabled && !isLoading && (
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      {/* Animated border for secondary/outline */}
      {(variant === 'secondary' || variant === 'outline') && !disabled && !isLoading && (
        <motion.span
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={{ transform: ['translateX(-100%)', 'translateX(100%)'] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center">
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </span>

      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300 to-transparent"
        initial={{ width: '0%', opacity: 0 }}
        whileHover={{ width: '100%', opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}