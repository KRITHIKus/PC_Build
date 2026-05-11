'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

/* ── Issue list ──────────────────────────────────────────────── */
function IssueList({ items = [], icon: Icon, color }) {
  if (!items.length) return null
  return (
    <div className="flex flex-col gap-2 mt-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm"
          style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
          <Icon size={13} style={{ color, flexShrink: 0, marginTop: '2px' }} />
          <span style={{ color: 'var(--text-2)' }}>
            {typeof item === 'string' ? item : item?.message ?? JSON.stringify(item)}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Single build compat block ───────────────────────────────── */
function CompatBlock({ result, buildTitle, index }) {
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.42 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        <p className="text-sm font-semibold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
          {buildTitle}
        </p>
        <div className="flex items-center gap-2">
          <HelpCircle size={14} style={{ color: 'var(--text-3)' }} />
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            No compatibility data stored.
          </span>
        </div>
      </motion.div>
    )
  }

  const { valid, blockers = [], warnings = [], notes = [] } = result
  const isValid     = valid !== false
  const iconColor   = isValid ? '#22c55e' : 'var(--red)'
  const StatusIcon  = isValid ? CheckCircle2 : XCircle

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.42 }}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--surface-1)',
        border:     `1px solid ${isValid ? 'rgba(34,197,94,0.2)' : 'rgba(255,59,31,0.22)'}`,
      }}
    >
      {/* Title + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-semibold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
          {buildTitle}
        </p>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
          style={{
            background: `${iconColor}14`,
            border:     `1px solid ${iconColor}30`,
            color:      iconColor,
            fontFamily: 'var(--font-display)',
          }}
        >
          <StatusIcon size={10} />
          {isValid ? 'Compatible' : 'Issues Found'}
        </span>
      </div>

      {/* Counts */}
      <div className="flex gap-4 mb-2">
        {blockers.length > 0 && (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--red)' }}>
            <XCircle size={11} /> {blockers.length} blocker{blockers.length !== 1 ? 's' : ''}
          </span>
        )}
        {warnings.length > 0 && (
          <span className="text-xs flex items-center gap-1" style={{ color: '#f59e0b' }}>
            <AlertTriangle size={11} /> {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </span>
        )}
        {!blockers.length && !warnings.length && isValid && (
          <span className="text-xs" style={{ color: '#22c55e' }}>No issues detected.</span>
        )}
      </div>

      <IssueList items={blockers}  icon={XCircle}       color="var(--red)" />
      <IssueList items={warnings}  icon={AlertTriangle} color="#f59e0b" />
    </motion.div>
  )
}

/* ── Compare Compatibility ───────────────────────────────────── */
export function CompareCompatibility({ compatibility, builds = [] }) {
  if (!compatibility) return null

  // results may be an object keyed by buildId, or an array
  const results = compatibility.results ?? compatibility

  return (
    <MotionSection direction="up">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Compatibility Check
        </p>
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          Compatibility Status
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {builds.map((build, i) => {
          const result = Array.isArray(results)
            ? results[i]
            : results?.[build._id] ?? results?.[build.id] ?? null

          return (
            <CompatBlock
              key={build._id ?? i}
              result={result}
              buildTitle={build.title ?? `Build ${i + 1}`}
              index={i}
            />
          )
        })}
      </div>
    </MotionSection>
  )
}