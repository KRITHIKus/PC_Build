'use client'

import { CheckCircle2, ArrowRight, Cpu } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function PartLine({ label, name }) {
  if (!name) return null
  return (
    <div className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span
        className="text-[10px] font-bold uppercase w-8 flex-shrink-0"
        style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </span>
      <span className="text-xs truncate" style={{ color: 'var(--text-2)' }}>
        {name}
      </span>
    </div>
  )
}

function getPartName(entry) {
  if (!entry) return null
  const comp = entry.component ?? entry
  return comp?.name ?? null
}

export function PrebuiltCard({ build, onUseAsBase }) {
  if (!build) return null

  const {
    title,
    description,
    totalEstimatedPrice,
    currency,
    compatibilityResult,
    parts = {},
  } = build

  const isCompatible = compatibilityResult?.valid ?? null

  const cpu      = getPartName(parts.cpu)
  const gpu      = getPartName(parts.gpu)
  const ram      = getPartName(parts.ram)

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden group transition-all duration-200"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,59,31,0.35)'
        e.currentTarget.style.boxShadow   = '0 0 24px rgba(255,59,31,0.1), 0 12px 40px rgba(0,0,0,0.5)'
        e.currentTarget.style.transform   = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow   = 'none'
        e.currentTarget.style.transform   = 'translateY(0)'
      }}
    >
      {/* Top line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.45),transparent)' }} />

      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-base font-bold leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            {title}
          </h3>
          {isCompatible === true && (
            <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
          )}
        </div>

        {/* Description */}
        {description && (
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-3)' }}
          >
            {description}
          </p>
        )}

        {/* Parts preview */}
        <div className="flex flex-col">
          <PartLine label="CPU" name={cpu} />
          <PartLine label="GPU" name={gpu} />
          <PartLine label="RAM" name={ram} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + action */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            {totalEstimatedPrice != null ? (
              <p
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
              >
                {formatPrice(totalEstimatedPrice, currency ?? 'INR')}
              </p>
            ) : (
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Price TBD</p>
            )}
          </div>

          <button
            onClick={() => onUseAsBase?.(build)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{
              background: 'rgba(255,59,31,0.1)',
              border:     '1px solid rgba(255,59,31,0.25)',
              color:      'var(--red)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,31,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,59,31,0.1)' }}
          >
            Use as Base
            <ArrowRight size={12} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </div>
  )
}