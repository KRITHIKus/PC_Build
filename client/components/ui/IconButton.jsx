'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * IconButton — square icon-only button with glow interaction
 * sizes: 'sm' | 'md' | 'lg'
 * variants: 'ghost' | 'surface' | 'red'
 */
export const IconButton = forwardRef(function IconButton(
  { children, size = 'md', variant = 'ghost', label, className, disabled, ...rest },
  ref
) {
  const sizeMap = {
    sm: 'w-7  h-7  rounded-lg  text-sm',
    md: 'w-9  h-9  rounded-xl  text-base',
    lg: 'w-11 h-11 rounded-xl  text-lg',
  }

  const variantMap = {
    ghost: [
      'text-[var(--text-2)] bg-transparent',
      'border border-transparent',
      'hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] hover:border-[var(--border)]',
    ].join(' '),
    surface: [
      'text-[var(--text-2)] bg-[var(--surface-2)]',
      'border border-[var(--border)]',
      'hover:text-[var(--text-1)] hover:border-[var(--border-strong)]',
    ].join(' '),
    red: [
      'text-[var(--red)] bg-[rgba(255,59,31,0.08)]',
      'border border-[rgba(255,59,31,0.25)]',
      'hover:bg-[rgba(255,59,31,0.18)] hover:shadow-[0_0_12px_rgba(255,59,31,0.35)]',
    ].join(' '),
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.06 }}
      whileTap={disabled   ? {} : { scale: 0.94 }}
      className={cn(
        'inline-flex items-center justify-center flex-shrink-0 cursor-pointer select-none',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]',
        sizeMap[size],
        variantMap[variant] || variantMap.ghost,
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
})