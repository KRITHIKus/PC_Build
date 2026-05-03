'use client'

import { motion } from 'framer-motion'
import { Cpu, Zap, Link2 } from 'lucide-react'

/* ── Format spec value ───────────────────────────────────────── */
function formatValue(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}

/* ── Format key to readable label ───────────────────────────── */
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

/* ── Spec row ────────────────────────────────────────────────── */
function SpecRow({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="flex items-start justify-between gap-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span
        className="text-xs flex-shrink-0"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)', minWidth: '100px' }}
      >
        {label}
      </span>
      <span
        className="text-xs text-right"
        style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)', fontWeight: 500 }}
      >
        {value}
      </span>
    </motion.div>
  )
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} style={{ color: 'var(--red)' }} />
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)' }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

/* ── Specs section ───────────────────────────────────────────── */
export function ComponentSpecs({ specs = {} }) {
  const entries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  )

  if (entries.length === 0) {
    return (
      <Section icon={Cpu} title="Specifications">
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>No specifications available.</p>
      </Section>
    )
  }

  return (
    <Section icon={Cpu} title="Specifications">
      <div>
        {entries.map(([key, val], i) => (
          <SpecRow
            key={key}
            label={formatKey(key)}
            value={formatValue(val)}
            index={i}
          />
        ))}
      </div>
    </Section>
  )
}

/* ── Compatibility section ───────────────────────────────────── */
export function ComponentCompatibility({ compatibility = {} }) {
  if (!compatibility || Object.keys(compatibility).length === 0) return null

  // Pull out well-known keys first, then the rest
  const knownKeys = ['socket', 'ramType', 'formFactor', 'pcieLanes', 'tdp', 'voltage']
  const allKeys   = Object.keys(compatibility)
  const ordered   = [
    ...knownKeys.filter(k => allKeys.includes(k)),
    ...allKeys.filter(k => !knownKeys.includes(k)),
  ]

  const entries = ordered
    .map(k => [k, compatibility[k]])
    .filter(([, v]) => v !== null && v !== undefined && v !== '')

  if (entries.length === 0) return null

  return (
    <Section icon={Link2} title="Compatibility">
      <div>
        {entries.map(([key, val], i) => (
          <SpecRow
            key={key}
            label={formatKey(key)}
            value={formatValue(val)}
            index={i}
          />
        ))}
      </div>
    </Section>
  )
}

/* ── Stock status badge ──────────────────────────────────────── */
export function StockBadge({ inStock }) {
  const isAvailable = inStock !== false

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: isAvailable ? 'rgba(34,197,94,0.1)' : 'rgba(255,59,31,0.1)',
        border:     isAvailable ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,59,31,0.25)',
        color:      isAvailable ? '#22c55e' : 'var(--red)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isAvailable ? '#22c55e' : 'var(--red)' }}
      />
      {isAvailable ? 'In Stock' : 'Out of Stock'}
    </span>
  )
}