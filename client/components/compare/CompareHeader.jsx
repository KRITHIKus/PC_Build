'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, GitCompare } from 'lucide-react'

/* ── Static system panel ─────────────────────────────────────── */
function StaticSystemPanel() {
  return (
    <div
      className="hidden lg:flex items-center justify-center w-56 h-28 rounded-2xl relative overflow-hidden"
      style={{ background: 'rgba(255,59,31,0.04)', border: '1px solid rgba(255,59,31,0.15)' }}
    >
      {/* Faint grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255,59,31,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,59,31,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
      }} />
      {/* Lines */}
      <svg viewBox="0 0 224 112" width="100%" height="100%" fill="none" className="absolute inset-0">
        <line x1="40"  y1="56" x2="184" y2="56" stroke="rgba(255,59,31,0.2)" strokeWidth="1" strokeDasharray="4 6" />
        {[40, 96, 152, 184].map(cx => (
          <g key={cx}>
            <rect x={cx - 14} y={40} width={28} height={20} rx="3"
              fill="rgba(255,59,31,0.07)" stroke="rgba(255,59,31,0.3)" strokeWidth="0.8" />
            <motion.circle cx={cx} cy={40} r={2} fill="var(--red)"
              animate={{ opacity: [0.9, 0.2, 0.9] }}
              transition={{ duration: 1.5, delay: cx * 0.005, repeat: Infinity }} />
          </g>
        ))}
        <motion.circle r={2.5} fill="var(--red)"
          style={{ filter: 'drop-shadow(0 0 3px rgba(255,59,31,0.8))' }}>
          <animateMotion path="M 40,56 L 184,56" dur="2s" repeatCount="indefinite" calcMode="linear" />
        </motion.circle>
      </svg>
      <p className="relative text-xs font-bold uppercase tracking-widest"
        style={{ color: 'rgba(255,59,31,0.5)', fontFamily: 'var(--font-display)' }}>
        BuildLab Compare
      </p>
    </div>
  )
}

/* ── Compare Header ──────────────────────────────────────────── */
export function CompareHeader({ buildCount = 0 }) {
  return (
    <div className="relative py-10 sm:py-14 overflow-hidden">

      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 55% at 40% 0%, rgba(255,59,31,0.08) 0%, transparent 70%)',
      }} />

      <div className="container-app relative">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          <Link
            href="/recommended"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)' }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Back to Recommended
          </Link>
        </motion.div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-6">
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
                style={{
                  background: 'rgba(255,59,31,0.1)',
                  border:     '1px solid rgba(255,59,31,0.25)',
                  color:      'var(--red)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <GitCompare size={11} />
                Side-by-Side
              </span>
              {buildCount > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border:     '1px solid rgba(255,255,255,0.1)',
                    color:      'var(--text-2)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {buildCount} build{buildCount !== 1 ? 's' : ''}
                </span>
              )}
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl font-bold mb-3"
              style={{
                fontFamily:    'var(--font-display)',
                letterSpacing: '-0.03em',
                color:         'var(--text-1)',
                lineHeight:    1.0,
              }}
            >
              Compare <span style={{ color: 'var(--red)', textShadow: '0 0 36px rgba(255,59,31,0.4)' }}>Builds</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base sm:text-lg"
              style={{ color: 'var(--text-2)' }}
            >
              Evaluate price, parts, compatibility, and upgrade value.
            </motion.p>
          </div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <StaticSystemPanel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}