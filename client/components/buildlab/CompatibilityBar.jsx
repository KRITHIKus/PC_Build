'use client'

import { CheckCircle2, XCircle, Loader2, CircleDot } from 'lucide-react'

const CONFIG = {
  idle: {
    icon:    CircleDot,
    label:   'Select parts, then run a compatibility check.',
    color:   'var(--text-3)',
    bg:      'rgba(255,255,255,0.03)',
    border:  'rgba(255,255,255,0.07)',
  },
  checking: {
    icon:    Loader2,
    label:   'Checking compatibility…',
    color:   '#f59e0b',
    bg:      'rgba(245,158,11,0.07)',
    border:  'rgba(245,158,11,0.2)',
    spin:    true,
  },
  pass: {
    icon:    CheckCircle2,
    label:   'All parts are compatible.',
    color:   '#22c55e',
    bg:      'rgba(34,197,94,0.08)',
    border:  'rgba(34,197,94,0.25)',
  },
  fail: {
    icon:    XCircle,
    label:   'Compatibility issues found. Review details below.',
    color:   'var(--red)',
    bg:      'rgba(255,59,31,0.08)',
    border:  'rgba(255,59,31,0.25)',
  },
}

export function CompatibilityBar({ status = 'idle', result = null }) {
  const cfg       = CONFIG[status] ?? CONFIG.idle
  const Icon      = cfg.icon
  const blockers  = result?.blockers  ?? []
  const warnings  = result?.warnings  ?? []

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, transition: 'all 0.2s' }}
    >
      <div className="flex items-center gap-2.5 mb-1">
        <Icon
          size={15}
          style={{ color: cfg.color, flexShrink: 0 }}
          className={cfg.spin ? 'animate-spin' : ''}
        />
        <span
          className="text-sm font-medium"
          style={{ color: cfg.color, fontFamily: 'var(--font-display)' }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Detail lines */}
      {status === 'fail' && (blockers.length > 0 || warnings.length > 0) && (
        <div className="ml-6 mt-2 flex flex-col gap-1">
          {blockers.map((b, i) => (
            <p key={i} className="text-xs" style={{ color: 'var(--red)' }}>
              {typeof b === 'string' ? b : b?.message ?? JSON.stringify(b)}
            </p>
          ))}
          {warnings.map((w, i) => (
            <p key={i} className="text-xs" style={{ color: '#f59e0b' }}>
              {typeof w === 'string' ? w : w?.message ?? JSON.stringify(w)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}