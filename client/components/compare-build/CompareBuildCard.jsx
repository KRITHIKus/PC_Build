'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2, XCircle, AlertTriangle,
  Star, Sparkles, TrendingDown, DollarSign,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

/* ── Compat row ──────────────────────────────────────────────── */
function CompatRow({ icon: Icon, count, label, color }) {
  if (!count) return null
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} style={{ color, flexShrink: 0 }} />
      <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {count} {label}
      </span>
    </div>
  )
}

/* ── Compare Build Card ──────────────────────────────────────── */
export function CompareBuildCard({ build, compat, index = 0, isCheapest, isMostExpensive, isSelected, onSelect }) {
  const router=useRouter()
  if (!build) return null

  const {
    title,
    totalEstimatedPrice,
    currency,
    journeyStatus,
    isFeatured,
    isDreamBuild,
  } = build

  const isValid      = compat?.valid ?? null
  const blockerCount = compat?.blockers?.length  ?? 0
  const warningCount = compat?.warnings?.length  ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <motion.div
        className="relative rounded-xl overflow-hidden h-full flex flex-col"
        style={{
          background: 'var(--surface-2)',
          border: isSelected
            ? '1px solid var(--red-border)'
            : '1px solid var(--border)',
          boxShadow: isSelected
            ? '0 0 0 1px var(--red-border), 0 0 20px var(--red-glow)'
            : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        whileHover={{
          y: -2,
          boxShadow: isSelected
            ? '0 0 0 1px var(--red-border), 0 0 28px var(--red-glow), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 24px rgba(0,0,0,0.35)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: '1px',
            background: isSelected
              ? 'linear-gradient(90deg, transparent, var(--red), transparent)'
              : 'linear-gradient(90deg, transparent, var(--border-strong), transparent)',
            transition: 'background 0.2s ease',
          }}
        />

        {/* Price banner */}
        {(isCheapest || isMostExpensive) && (
          <div
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background:   isCheapest ? 'rgba(255,59,31,0.06)' : 'rgba(255,59,31,0.08)',
              borderBottom: '1px solid var(--border)',
              color:        'var(--red)',
              fontFamily:   'var(--font-display)',
              letterSpacing: '0.1em',
            }}
          >
            {isCheapest
              ? <><TrendingDown size={11} /> Best Price</>
              : <><DollarSign size={11} /> Premium Build</>
            }
          </div>
        )}

        <div className="p-5 flex flex-col gap-3.5 flex-1">

          {/* Badges */}
          {(isFeatured || isDreamBuild) && (
            <div className="flex flex-wrap gap-1.5">
              {isFeatured && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: 'rgba(255,59,31,0.08)',
                    border: '1px solid var(--red-border)',
                    color: 'var(--red)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  <Star size={9} fill="currentColor" /> Featured
                </span>
              )}
              {isDreamBuild && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: 'rgba(255,59,31,0.06)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-2)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  <Sparkles size={9} /> Dream Build
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3
            className="text-sm font-semibold leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h3>

          {/* Price */}
          {totalEstimatedPrice != null && (
            <div>
              <p
                className="text-[10px] mb-0.5 uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                Total
              </p>
              <p
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.03em' }}
              >
                {formatPrice(totalEstimatedPrice, currency ?? 'INR')}
              </p>
            </div>
          )}

          {/* Journey status */}
          {journeyStatus && (
            <span
              className="self-start text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wider"
              style={{
                background: 'var(--surface-3)',
                border:     '1px solid var(--border)',
                color:      'var(--text-3)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {journeyStatus}
            </span>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Compatibility summary */}
          <div
            className="flex flex-col gap-1.5 pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {isValid === true && !blockerCount && !warningCount && (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} style={{ color: 'var(--red)', opacity: 0.8 }} />
                <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                  Fully compatible
                </span>
              </div>
            )}

            {isValid === false && (
              <div className="flex items-center gap-2">
                <XCircle size={12} style={{ color: 'var(--red)' }} />
                <span className="text-xs" style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                  Compatibility issues
                </span>
              </div>
            )}

            <CompatRow icon={XCircle}       count={blockerCount} label="blockers" color="var(--red)"        />
            <CompatRow icon={AlertTriangle} count={warningCount} label="warnings" color="var(--text-3)"     />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => router.push(`/dashboard/builds/${build._id}`)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:  'var(--surface-3)',
                border:      '1px solid var(--border)',
                color:       'var(--text-1)',
                fontFamily:  'var(--font-display)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.color = 'var(--text-1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              View Build
            </button>

            <button
              onClick={() => onSelect?.(build._id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: isSelected ? 'rgba(255,59,31,0.1)' : 'var(--surface-3)',
                border:     isSelected ? '1px solid var(--red-border)' : '1px solid var(--border)',
                color:      isSelected ? 'var(--red)' : 'var(--text-2)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
              }}
            >
              {isSelected ? 'Selected' : 'Compare'}
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}