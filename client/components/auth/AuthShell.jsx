'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import { AuthIllustration } from './AuthIllustration'
import { APP_NAME } from '@/lib/constants'

export function AuthShell({ children, heading, subheading }) {
  return (
    <div
      className="auth-shell min-h-screen w-full flex flex-col lg:flex-row"
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
        <Logo size="md" />
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-lg">
            <AuthIllustration />
          </div>
        </div>
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

        {/* Remove compact illustration on mobile */}
        <div className="lg:hidden" style={{ display: 'none' }} />

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
              className="auth-card rounded-2xl p-6 sm:p-8"
              style={{
                background: 'var(--surface-2)',
                border:     '1px solid var(--border)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.4),transparent)', pointerEvents: 'none' }} />
              {children}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile animation background ───────────────────── */}
      <style jsx>{`

        /* ── Page shell ── */
        @media (max-width: 1023px) {
          .auth-shell {
            position: relative;
            overflow: hidden;
            background: #0a0a0a;
          }

          /* ── Layer 1: slow rotating conic sweep behind everything ── */
          .auth-shell::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            width: 200vmax;
            height: 200vmax;
            transform: translate(-50%, -50%);
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(255, 59, 31, 0.06) 40deg,
              rgba(255, 59, 31, 0.13) 80deg,
              transparent 120deg,
              transparent 240deg,
              rgba(255, 59, 31, 0.07) 300deg,
              transparent 360deg
            );
            animation: conicSpin 18s linear infinite;
            z-index: 0;
            pointer-events: none;
          }

          /* ── Layer 2: radial pulse that breathes from card center outward ── */
          .auth-shell::after {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            width: 480px;
            height: 480px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(255, 59, 31, 0.22) 0%,
              rgba(255, 59, 31, 0.10) 35%,
              rgba(255, 59, 31, 0.03) 65%,
              transparent 100%
            );
            animation: radialBreath 4s ease-in-out infinite;
            z-index: 0;
            pointer-events: none;
          }

          @keyframes conicSpin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to   { transform: translate(-50%, -50%) rotate(360deg); }
          }

          @keyframes radialBreath {
            0%, 100% {
              transform: translate(-50%, -50%) scale(0.85);
              opacity: 0.6;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.25);
              opacity: 1;
            }
          }

          /* ── Card: transparent glass so the animation bleeds through ── */
          .auth-shell .auth-card {
            position: relative;
            z-index: 1;
            background: rgba(10, 10, 10, 0.45) !important;
            backdrop-filter: blur(20px) saturate(1.4) !important;
            -webkit-backdrop-filter: blur(20px) saturate(1.4) !important;
            border: 1px solid rgba(255, 59, 31, 0.18) !important;
            box-shadow:
              0 0 0 1px rgba(255, 59, 31, 0.08) inset,
              0 8px 40px rgba(0, 0, 0, 0.45),
              0 0 80px rgba(255, 59, 31, 0.07);
            animation: cardEdgeGlow 4s ease-in-out infinite;
          }

          /* Card border pulses subtly in sync with the radial behind it */
          @keyframes cardEdgeGlow {
            0%, 100% {
              box-shadow:
                0 0 0 1px rgba(255, 59, 31, 0.08) inset,
                0 8px 40px rgba(0, 0, 0, 0.45),
                0 0 60px rgba(255, 59, 31, 0.06);
            }
            50% {
              box-shadow:
                0 0 0 1px rgba(255, 59, 31, 0.22) inset,
                0 8px 40px rgba(0, 0, 0, 0.5),
                0 0 100px rgba(255, 59, 31, 0.13);
            }
          }

          /* Ensure headings and content above card stay on top */
          .auth-shell .mb-7 {
            position: relative;
            z-index: 1;
          }
        }
      `}</style>
    </div>
  )
}