'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2, XCircle, AlertTriangle,
  Star, Sparkles, TrendingDown, DollarSign,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

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
export function CompareBuildCard({ build, compat, index = 0, isCheapest, isMostExpensive }) {
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
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden h-full flex flex-col"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        whileHover={{
          borderColor: 'rgba(255,59,31,0.38)',
          boxShadow:   '0 0 24px rgba(255,59,31,0.1), 0 12px 40px rgba(0,0,0,0.5)',
          y: -3,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Top accent */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.5),transparent)' }} />

        {/* Price banner — icon only, no emoji */}
        {(isCheapest || isMostExpensive) && (
          <div
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider"
            style={{
              background:   isCheapest ? 'rgba(34,197,94,0.1)' : 'rgba(255,59,31,0.1)',
              borderBottom: isCheapest ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,59,31,0.2)',
              color:        isCheapest ? '#22c55e' : 'var(--red)',
              fontFamily:   'var(--font-display)',
            }}
          >
            {isCheapest
              ? <><TrendingDown size={13} /> Best Price</>
              : <><DollarSign size={13} /> Premium Build</>
            }
          </div>
        )}

        <div className="p-5 flex flex-col gap-4 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {isFeatured && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(255,59,31,0.1)', border: '1px solid rgba(255,59,31,0.25)', color: 'var(--red)', fontFamily: 'var(--font-display)' }}
              >
                <Star size={9} fill="currentColor" /> Featured
              </span>
            )}
            {isDreamBuild && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', fontFamily: 'var(--font-display)' }}
              >
                <Sparkles size={9} /> Dream Build
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-base font-bold leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            {title}
          </h3>

          {/* Price */}
          {totalEstimatedPrice != null && (
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Total Price
              </p>
              <p className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                {formatPrice(totalEstimatedPrice, currency ?? 'INR')}
              </p>
            </div>
          )}

          {/* Journey status */}
          {journeyStatus && (
            <span
              className="self-start text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border:     '1px solid rgba(255,255,255,0.08)',
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
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {isValid === true && !blockerCount && !warningCount && (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
                <span className="text-xs" style={{ color: '#22c55e', fontFamily: 'var(--font-display)' }}>
                  Fully compatible
                </span>
              </div>
            )}
            {isValid === false && (
              <div className="flex items-center gap-2">
                <XCircle size={13} style={{ color: 'var(--red)' }} />
                <span className="text-xs" style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                  Compatibility issues
                </span>
              </div>
            )}
            <CompatRow icon={XCircle}       count={blockerCount} label="blockers" color="var(--red)" />
            <CompatRow icon={AlertTriangle} count={warningCount} label="warnings" color="#f59e0b" />
            {isValid === null && (
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                No compatibility data
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}