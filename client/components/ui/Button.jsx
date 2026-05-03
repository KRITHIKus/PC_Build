'use client'

import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Premium Button
 *
 * variants:  'primary' | 'secondary' | 'ghost' | 'danger'
 * sizes:     'sm' | 'md' | 'lg'
 *
 * Primary  → red fill + shimmer + glow on hover
 * Secondary→ bordered, surface fill on hover
 * Ghost    → transparent, subtle red on hover
 * Danger   → red-border, fills red on hover
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant  = 'primary',
    size     = 'md',
    icon,
    iconPosition = 'right',
    loading  = false,
    disabled = false,
    className,
    onClick,
    type = 'button',
    ...rest
  },
  ref
) {
  const shimmerRef = useRef(null)

  /* ── Size tokens ───────────────────────────────────────────── */
  const sizeMap = {
    sm: 'h-8  px-4 text-xs  gap-1.5 rounded-lg',
    md: 'h-10 px-5 text-sm  gap-2   rounded-xl',
    lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',
  }

  /* ── Variant styles ────────────────────────────────────────── */
  const variantMap = {
    primary: {
      base: [
        'relative overflow-hidden font-semibold',
        'bg-[#ff3b1f] text-white',
        'border border-[rgba(255,59,31,0.6)]',
        'transition-all duration-200',
      ].join(' '),
      hover: {},
      whileHover: { scale: 1.02 },
      whileTap:   { scale: 0.97 },
    },
    secondary: {
      base: [
        'relative overflow-hidden font-medium',
        'bg-[var(--surface-2)] text-[var(--text-1)]',
        'border border-[var(--border)]',
        'hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)]',
        'transition-all duration-200',
      ].join(' '),
      whileHover: { scale: 1.01 },
      whileTap:   { scale: 0.98 },
    },
    ghost: {
      base: [
        'relative font-medium',
        'bg-transparent text-[var(--text-2)]',
        'border border-transparent',
        'hover:text-[var(--text-1)] hover:border-[var(--border)]',
        'transition-all duration-200',
      ].join(' '),
      whileHover: { scale: 1.01 },
      whileTap:   { scale: 0.98 },
    },
    danger: {
      base: [
        'relative overflow-hidden font-medium',
        'bg-transparent text-[#ff3b1f]',
        'border border-[rgba(255,59,31,0.35)]',
        'hover:bg-[rgba(255,59,31,0.1)]',
        'transition-all duration-200',
      ].join(' '),
      whileHover: { scale: 1.01 },
      whileTap:   { scale: 0.98 },
    },
  }

  const v = variantMap[variant] || variantMap.primary
  const isDisabled = disabled || loading

  const handleMouseEnter = () => {
    if (variant === 'primary' && shimmerRef.current) {
      shimmerRef.current.style.animation = 'none'
      // Force reflow
      void shimmerRef.current.offsetWidth
      shimmerRef.current.style.animation = 'shimmer 0.65s ease forwards'
    }
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      whileHover={isDisabled ? {} : v.whileHover}
      whileTap={isDisabled  ? {} : v.whileTap}
      className={cn(
        'inline-flex items-center justify-center select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]',
        sizeMap[size],
        v.base,
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        /* Glow on primary hover */
        variant === 'primary' && !isDisabled
          ? 'hover:shadow-[0_0_24px_rgba(255,59,31,0.5)]'
          : '',
        className
      )}
      style={
        variant === 'primary'
          ? { background: 'linear-gradient(135deg, #ff4d33 0%, #ff3b1f 60%, #e11d2e 100%)' }
          : undefined
      }
      {...rest}
    >
      {/* ── Shimmer (primary only) ──────────────────────────── */}
      {variant === 'primary' && (
        <span
          ref={shimmerRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
            transform: 'translateX(-100%) skewX(-12deg)',
          }}
        />
      )}

      {/* ── Icon left ──────────────────────────────────────── */}
      {icon && iconPosition === 'left' && (
        <motion.span
          className="flex-shrink-0"
          whileHover={{ x: -1 }}
          transition={{ duration: 0.15 }}
        >
          {icon}
        </motion.span>
      )}

      {/* ── Label ──────────────────────────────────────────── */}
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden
          />
          Loading…
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}

      {/* ── Icon right ─────────────────────────────────────── */}
      {icon && iconPosition === 'right' && !loading && (
        <motion.span
          className="flex-shrink-0 relative z-10"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  )
})