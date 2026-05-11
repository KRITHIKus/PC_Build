'use client'

import { useState } from 'react'
import { Loader2, ShieldCheck, Hammer } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { CompatibilityBar } from './CompatibilityBar'
import { PART_SLOTS } from './PartsSelector'

export function SummaryPanel({
  selectedParts,
  compatibility,
  compatResult,
  isChecking,
  isCreating,
  onCheckCompatibility,
  onCreateBuild,
}) {
  const [buildName, setBuildName] = useState('')

  // Compute totals
  const filledSlots = PART_SLOTS.filter(s => selectedParts[s.key])
  const totalPrice  = filledSlots.reduce(
    (sum, s) => sum + (selectedParts[s.key]?.estimatedPrice ?? 0),
    0
  )
  const hasMinParts     = filledSlots.length >= 2
  const canCheck        = hasMinParts && !isChecking
  const canCreate       = compatibility === 'pass' && !isCreating && buildName.trim().length > 0

  const handleCreate = () => {
    if (!canCreate) return
    onCreateBuild(buildName.trim())
  }

  return (
    <div className="flex flex-col gap-5">
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        Build Summary
      </p>

      {/* Price total */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          Estimated Total
        </p>
        <p
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.03em' }}
        >
          {totalPrice > 0 ? formatPrice(totalPrice) : '—'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
          {filledSlots.length} / {PART_SLOTS.length} parts selected
        </p>
      </div>

      {/* Parts cost breakdown */}
      {filledSlots.length > 0 && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        >
          {filledSlots.map(slot => {
            const comp  = selectedParts[slot.key]
            const price = comp?.estimatedPrice
            return (
              <div
                key={slot.key}
                className="flex items-center justify-between py-1.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  {slot.label}
                </span>
                <span className="text-xs font-medium" style={{ color: price ? 'var(--text-2)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  {price != null ? formatPrice(price) : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Compatibility status */}
      <CompatibilityBar status={compatibility} result={compatResult} />

      {/* Check compatibility */}
      <button
        type="button"
        disabled={!canCheck}
        onClick={onCheckCompatibility}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          background: canCheck ? 'rgba(255,59,31,0.12)' : 'rgba(255,255,255,0.04)',
          border:     canCheck ? '1px solid rgba(255,59,31,0.3)' : '1px solid rgba(255,255,255,0.07)',
          color:      canCheck ? 'var(--red)' : 'var(--text-3)',
          fontFamily: 'var(--font-display)',
          cursor:     canCheck ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={e => { if (canCheck) e.currentTarget.style.background = 'rgba(255,59,31,0.2)' }}
        onMouseLeave={e => { if (canCheck) e.currentTarget.style.background = 'rgba(255,59,31,0.12)' }}
      >
        {isChecking
          ? <><Loader2 size={15} className="animate-spin" /> Checking…</>
          : <><ShieldCheck size={15} /> Check Compatibility</>
        }
      </button>

      {/* Build name input + create (only shown after pass) */}
      {compatibility === 'pass' && (
        <div className="flex flex-col gap-3">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
            >
              Build Name
            </label>
            <input
              type="text"
              placeholder="My Gaming Build"
              value={buildName}
              onChange={e => setBuildName(e.target.value)}
              maxLength={80}
              className="w-full h-10 px-3 rounded-xl text-sm outline-none transition-all duration-150"
              style={{
                background: 'var(--surface-1)',
                border:     '1px solid rgba(255,255,255,0.1)',
                color:      'var(--text-1)',
                fontFamily: 'var(--font-display)',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)'
                e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(255,59,31,0.08)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            />
          </div>

          <button
            type="button"
            disabled={!canCreate}
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden"
            style={{
              background: canCreate
                ? 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)'
                : 'rgba(255,59,31,0.25)',
              color:      canCreate ? '#fff' : 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--font-display)',
              cursor:     canCreate ? 'pointer' : 'not-allowed',
              border:     'none',
            }}
            onMouseEnter={e => { if (canCreate) e.currentTarget.style.boxShadow = '0 0 24px rgba(255,59,31,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            {isCreating
              ? <><Loader2 size={15} className="animate-spin" /> Creating Build…</>
              : <><Hammer size={15} /> Create Build</>
            }
          </button>

          {!buildName.trim() && (
            <p className="text-xs text-center" style={{ color: 'var(--text-3)' }}>
              Enter a build name to continue.
            </p>
          )}
        </div>
      )}
    </div>
  )
}