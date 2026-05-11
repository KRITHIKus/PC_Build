'use client'

import { X, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { PART_SLOTS } from './PartsSelector'
import { ComponentFallbackVisual } from '@/components/components/ComponentFallbackVisual'

function SelectedPartRow({ slot, component, onRemove }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      {/* Mini visual */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ width: '32px', height: '32px' }}>
          <ComponentFallbackVisual type={component.type ?? slot.type} size="lg" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold truncate"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          {component.name}
        </p>
        <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          {slot.label}
          {component.estimatedPrice != null && ` · ${formatPrice(component.estimatedPrice)}`}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(slot.key)}
        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
        style={{ color: 'var(--text-3)' }}
        aria-label={`Remove ${slot.label}`}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(255,59,31,0.08)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent' }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

function EmptySlotRow({ slot }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
    >
      <span
        className="text-[10px] font-bold uppercase w-14 flex-shrink-0"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {slot.label}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-3)' }}>Not selected</span>
    </div>
  )
}

export function SelectedParts({ selectedParts, onRemovePart }) {
  const filledCount = PART_SLOTS.filter(s => selectedParts[s.key]).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
        >
          Selected Parts
        </p>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{
            background: filledCount > 0 ? 'rgba(255,59,31,0.12)' : 'rgba(255,255,255,0.05)',
            color:      filledCount > 0 ? 'var(--red)' : 'var(--text-3)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {filledCount} / {PART_SLOTS.length}
        </span>
      </div>

      {/* ✦ Empty state only — no slot rows rendered beneath it */}
      {filledCount === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-8 text-center rounded-xl"
          style={{ border: '1px dashed rgba(255,255,255,0.07)' }}
        >
          <Package size={22} style={{ color: 'var(--text-3)', marginBottom: '8px' }} strokeWidth={1.5} />
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>No parts selected yet.</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-3)', opacity: 0.6 }}>
            Pick parts from the left panel.
          </p>
        </div>
      ) : (
        /* ✦ When at least 1 part is filled: show all rows (filled + empty stubs) */
        PART_SLOTS.map(slot => {
          const comp = selectedParts[slot.key]
          return comp
            ? <SelectedPartRow key={slot.key} slot={slot} component={comp} onRemove={onRemovePart} />
            : <EmptySlotRow    key={slot.key} slot={slot} />
        })
      )}
    </div>
  )
}