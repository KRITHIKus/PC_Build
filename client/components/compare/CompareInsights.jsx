'use client'

import { motion } from 'framer-motion'
import { Gamepad2, Wallet, Zap, ArrowUpRight, Briefcase, Map } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

/* ── Safe string coerce ──────────────────────────────────────── */
function safeString(val) {
  if (val === null || val === undefined) return null
  if (typeof val === 'string') return val.trim() || null
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (Array.isArray(val)) {
    const parts = val.map(safeString).filter(Boolean)
    return parts.length ? parts.join(', ') : null
  }
  // Objects: try common keys
  if (typeof val === 'object') {
    return val.title ?? val.name ?? val.label ?? val.id ?? null
  }
  return null
}

/* ── Render a map entry value (array → joined, else string) ─── */
function renderMapValue(val) {
  if (val === null || val === undefined) return '—'
  if (Array.isArray(val)) {
    const parts = val.map(item => safeString(item)).filter(Boolean)
    return parts.length ? parts.join(', ') : '—'
  }
  if (typeof val === 'object') {
    // Could be { rating, reason } or similar
    const str = val.rating ?? val.level ?? val.value ?? val.label ?? safeString(val)
    return str ?? '—'
  }
  return String(val)
}

const INSIGHT_FIELDS = [
  { key: 'bestForGaming',      label: 'Best for Gaming',      icon: Gamepad2,    color: '#ff3b1f' },
  { key: 'bestForBudget',      label: 'Best for Budget',      icon: Wallet,      color: '#22c55e' },
  { key: 'bestForPerformance', label: 'Best for Performance', icon: Zap,         color: '#f59e0b' },
  { key: 'bestForUpgrade',     label: 'Best for Upgrades',    icon: ArrowUpRight, color: '#60a5fa' },
]

/* ── Insight card ────────────────────────────────────────────── */
function InsightCard({ icon: Icon, label, rawValue, color, delay }) {
  const display = safeString(rawValue)
  const isEmpty = !display

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 p-5 rounded-2xl"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}14`, border: `1px solid ${color}28` }}
        >
          <Icon size={17} style={{ color }} strokeWidth={2} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          {label}
        </p>
      </div>
      <p className="text-base font-semibold leading-snug"
        style={{
          fontFamily: 'var(--font-display)',
          color:      isEmpty ? 'var(--text-3)' : 'var(--text-1)',
          fontStyle:  isEmpty ? 'italic' : 'normal',
        }}>
        {isEmpty ? 'No data' : display}
      </p>
    </motion.div>
  )
}

/* ── Use case / flexibility map ──────────────────────────────── */
function MapSection({ data, title, icon: Icon }) {
  if (!data || typeof data !== 'object') return null

  const entries = Object.entries(data)
  if (!entries.length) return null

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} style={{ color: 'var(--red)' }} />
        <p className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          {title}
        </p>
      </div>
      <div>
        {entries.map(([buildName, val], i) => {
          const display = renderMapValue(val)
          return (
            <div
              key={buildName}
              className="flex items-start gap-4 py-3"
              style={{ borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              <span
                className="text-xs font-semibold flex-shrink-0"
                style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)', minWidth: '130px' }}
              >
                {buildName}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                {display}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Compare Insights ────────────────────────────────────────── */
export function CompareInsights({ insights }) {
  if (!insights) return null

  const {
    bestForGaming,
    bestForBudget,
    bestForPerformance,
    bestForUpgrade,
    useCaseMap,
    upgradeFlexibilityMap,
  } = insights

  const hasCards = INSIGHT_FIELDS.some(f => insights[f.key] != null)
  const hasMaps  = useCaseMap || upgradeFlexibilityMap

  if (!hasCards && !hasMaps) return null

  return (
    <MotionSection direction="up">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Analysis
        </p>
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          Build Insights
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Best-for cards */}
        {hasCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INSIGHT_FIELDS.map(({ key, label, icon, color }, i) => (
              <InsightCard
                key={key}
                icon={icon}
                label={label}
                rawValue={insights[key]}
                color={color}
                delay={i * 0.08}
              />
            ))}
          </div>
        )}

        {/* Map sections */}
        {hasMaps && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCaseMap && (
              <MapSection
                data={useCaseMap}
                title="Use Case by Build"
                icon={Briefcase}
              />
            )}
            {upgradeFlexibilityMap && (
              <MapSection
                data={upgradeFlexibilityMap}
                title="Upgrade Flexibility by Build"
                icon={Map}
              />
            )}
          </div>
        )}
      </div>
    </MotionSection>
  )
}