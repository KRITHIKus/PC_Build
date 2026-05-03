'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { APP_NAME } from '@/lib/constants'

export function Logo({ size = 'md', href = '/' }) {
  const sizes = {
    sm: { icon: 20, text: 'text-base',  gap: 'gap-2'   },
    md: { icon: 26, text: 'text-xl',    gap: 'gap-2.5' },
    lg: { icon: 32, text: 'text-2xl',   gap: 'gap-3'   },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link href={href} className="inline-flex items-center select-none group outline-none" aria-label={APP_NAME}>
      <div className={`flex items-center ${s.gap}`}>

        {/* Icon mark */}
        <motion.div
          className="relative flex-shrink-0"
          style={{ width: s.icon, height: s.icon }}
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <svg
            width={s.icon}
            height={s.icon}
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="13,1 24,7 24,19 13,25 2,19 2,7"
              stroke="rgba(255,59,31,0.4)"
              strokeWidth="1"
              fill="none"
            />
            <polygon
              points="13,5 20,9 20,17 13,21 6,17 6,9"
              fill="rgba(255,59,31,0.13)"
              stroke="#ff3b1f"
              strokeWidth="1.2"
            />
            <line x1="13" y1="9"  x2="13" y2="17" stroke="#ff3b1f" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="9"  y1="13" x2="17" y2="13" stroke="#ff3b1f" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="13" cy="13" r="1.5" fill="#ff3b1f"/>
          </svg>

          {/* Glow on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'radial-gradient(circle, rgba(255,59,31,0.22) 0%, transparent 70%)',
              filter:     'blur(5px)',
            }}
          />
        </motion.div>

        {/* Brand name — Sora font */}
        <span
          className={`${s.text} font-bold tracking-tight leading-none`}
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
        >
          {APP_NAME.slice(0, -3)}
          <span style={{ color: 'var(--red)' }}>
            {APP_NAME.slice(-3)}
          </span>
        </span>

      </div>
    </Link>
  )
}