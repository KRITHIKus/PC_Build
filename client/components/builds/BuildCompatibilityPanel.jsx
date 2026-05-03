'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2, XCircle, AlertTriangle,
  Info, Link2, HelpCircle,
} from 'lucide-react'

/* ── Section title ───────────────────────────────────────────── */
function PanelSection({ icon: Icon, label, items = [], color }) {
  if (!items.length) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} style={{ color, flexShrink: 0 }} />
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
        >
          {label}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm"
            style={{
              background: `${color}0d`,
              border:     `1px solid ${color}22`,
            }}
          >
            <Icon size={13} style={{ color, flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: 'var(--text-2)' }}>
              {typeof item === 'string' ? item : item?.message ?? JSON.stringify(item)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Build Compatibility Panel ───────────────────────────────── */
export function BuildCompatibilityPanel({ compatibilityResult }) {

  // No data stored
  if (compatibilityResult === null || compatibilityResult === undefined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Link2 size={16} style={{ color: 'var(--text-3)' }} />
          </div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            Compatibility
          </h3>
        </div>

        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <HelpCircle size={16} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: '1px' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
            Compatibility data has not been stored for this build yet.
          </p>
        </div>
      </motion.div>
    )
  }

  const {
    valid,
    blockers  = [],
    warnings  = [],
    notes     = [],
  } = compatibilityResult

  const isValid   = valid !== false
  const iconColor = isValid ? '#22c55e' : 'var(--red)'
  const StatusIcon = isValid ? CheckCircle2 : XCircle

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'var(--surface-1)',
        border:     `1px solid ${isValid ? 'rgba(34,197,94,0.2)' : 'rgba(255,59,31,0.22)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isValid ? 'rgba(34,197,94,0.1)' : 'rgba(255,59,31,0.1)',
            border:     `1px solid ${iconColor}33`,
          }}
        >
          <StatusIcon size={17} style={{ color: iconColor }} />
        </div>
        <div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            Compatibility
          </h3>
          <p className="text-xs font-medium" style={{ color: iconColor }}>
            {isValid ? 'All parts compatible' : 'Compatibility issues found'}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl mb-5 text-sm font-semibold"
        style={{
          background: isValid ? 'rgba(34,197,94,0.08)' : 'rgba(255,59,31,0.08)',
          border:     `1px solid ${iconColor}33`,
          color:      iconColor,
          fontFamily: 'var(--font-display)',
        }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: iconColor }} />
        {isValid ? 'Fully Compatible' : 'Not Compatible'}
      </div>

      {/* Detail sections */}
      <div className="flex flex-col gap-5">
        <PanelSection
          icon={XCircle}
          label="Blockers"
          items={blockers}
          color="var(--red)"
        />
        <PanelSection
          icon={AlertTriangle}
          label="Warnings"
          items={warnings}
          color="#f59e0b"
        />
        <PanelSection
          icon={Info}
          label="Notes"
          items={notes}
          color="#60a5fa"
        />
      </div>

      {/* All clear */}
      {!blockers.length && !warnings.length && !notes.length && isValid && (
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          No issues detected. All components are compatible with each other.
        </p>
      )}
    </motion.div>
  )
}