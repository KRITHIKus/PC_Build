'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import { AuthIllustration } from './AuthIllustration'
import { APP_NAME } from '@/lib/constants'

/* ─────────────────────────────────────────────────────────────
   AuthShell — layout wrapper for Sign In / Sign Up
   Desktop: 60% illustration left | 40% form right
   Mobile:  logo → compact illustration → form card
───────────────────────────────────────────────────────────── */
export function AuthShell({ children, heading, subheading }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── Left panel — illustration (desktop) ─────────── */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width:        '58%',
          flexShrink:   0,
          background:   'var(--surface-1)',
          borderRight:  '1px solid var(--border)',
          padding:      '40px 48px',
        }}
      >
        {/* Brand */}
        <Logo size="md" />

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-lg">
            <AuthIllustration />
          </div>
        </div>

        {/* Bottom message */}
        <div>
          <p
            className="text-2xl font-bold mb-2 leading-snug"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-1)' }}
          >
            Continue building your<br />
            <span style={{ color: 'var(--red)' }}>perfect system.</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Real-time pricing · Compatibility checks · Expert builds
          </p>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Logo size="sm" />
          <Link
            href="/"
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
          >
            ← Home
          </Link>
        </div>

        {/* Mobile compact illustration */}
        <div
          className="lg:hidden px-4 pt-4 pb-2"
          style={{ maxHeight: '200px', overflow: 'hidden' }}
        >
          <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
            <AuthIllustration />
          </div>
        </div>

        {/* Form area — centered on desktop */}
        <div className="flex-1 flex items-center justify-center px-5 py-6 lg:py-0">
          <motion.div
            className="w-full"
            style={{ maxWidth: '420px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Heading */}
            <div className="mb-7">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-1.5 leading-tight"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-1)' }}
              >
                {heading}
              </h1>
              {subheading && (
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  {subheading}
                </p>
              )}
            </div>

            {/* Form card */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'var(--surface-2)',
                border:     '1px solid var(--border)',
              }}
            >
              {/* Top red accent line */}
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.4),transparent)', pointerEvents: 'none' }} />

              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}