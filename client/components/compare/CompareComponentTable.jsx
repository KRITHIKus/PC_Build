'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

const PART_KEYS = [
  { key: 'cpu',         label: 'CPU'         },
  { key: 'gpu',         label: 'GPU'         },
  { key: 'ram',         label: 'RAM'         },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'storage',     label: 'Storage'     },
  { key: 'psu',         label: 'PSU'         },
  { key: 'cabinet',     label: 'Cabinet'     },
  { key: 'cooling',     label: 'Cooling'     },
]

/* ─────────────────────────────────────────────────────────────
   Data resolution helpers
   
   Backend shapes vary per part type:
   
   Singular parts (cpu/gpu/ram/etc):
     componentComparison.cpu = [
       { name, brand, ... },        // build 0
       { name, brand, ... },        // build 1
     ]
   
   Storage (array of builds, each with components[]):
     componentComparison.storage = [
       { buildTitle: "...", components: [{ name, ... }, ...] },
       { buildTitle: "...", components: [{ name, ... }, ...] },
     ]
───────────────────────────────────────────────────────────── */

function resolvePartValue(row, buildIndex, partKey) {
  if (!row) return '—'

  // Storage: special shape
  if (partKey === 'storage') {
    const buildEntry = row[buildIndex]
    if (!buildEntry) return '—'

    // { buildTitle, components: [...] }
    if (buildEntry.components && Array.isArray(buildEntry.components)) {
      const names = buildEntry.components
        .map(c => c?.name ?? c?.component?.name)
        .filter(Boolean)
      return names.length ? names.join(', ') : '—'
    }

    // Fallback: it might just be a component object
    return buildEntry.name ?? buildEntry.component?.name ?? '—'
  }

  // Singular parts
  const entry = row[buildIndex]
  if (!entry) return '—'

  // { name, brand, ... } directly
  if (typeof entry === 'string') return entry
  if (entry.name) return entry.name

  // { component: { name, ... } }
  if (entry.component?.name) return entry.component.name

  return '—'
}

/* ── Desktop table ───────────────────────────────────────────── */
function DesktopTable({ componentComparison, buildTitles }) {
 
  const needsScroll = buildTitles.length > 2

  return (
    <div className={needsScroll ? 'overflow-x-auto' : ''}>
<div style={{ minWidth: needsScroll ? `${160 + buildTitles.length * 200}px` : '100%' }}>        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        >
          {/* Header row */}
          <div
            className="grid"
style={{ gridTemplateColumns: `160px repeat(${buildTitles.length}, minmax(180px, 1fr))` }}          >
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Component
              </span>
            </div>
            {buildTitles.map((title, i) => (
              <div key={i} className="px-4 py-4"
                style={{ borderBottom: '1px solid var(--border)', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-sm font-semibold line-clamp-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
                  {title}
                </p>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {PART_KEYS.map(({ key, label }, rowIdx) => {
            const row    = componentComparison?.[key] ?? null
            const isLast = rowIdx === PART_KEYS.length - 1

            return (
              <motion.div
                key={key}
                className="grid"
style={{ gridTemplateColumns: `160px repeat(${buildTitles.length}, minmax(180px, 1fr))` }}                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIdx * 0.05, duration: 0.35 }}
              >
                {/* Part label */}
                <div
                  className="px-5 py-4 flex items-center"
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                    background:   'rgba(255,59,31,0.03)',
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                    {label}
                  </span>
                </div>

                {/* Values per build */}
                {buildTitles.map((_, i) => {
                  const displayVal = resolvePartValue(row, i, key)
                  const isEmpty    = displayVal === '—'

                  return (
                    <div key={i} className="px-4 py-4"
                      style={{
                        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
                        borderLeft:   '1px solid rgba(255,255,255,0.04)',
                      }}>
                      <span className="text-sm break-words" style={{ color: isEmpty ? 'var(--text-3)' : 'var(--text-2)' }}>
                        {displayVal}
                      </span>
                    </div>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Mobile accordion card ───────────────────────────────────── */
function MobilePartCard({ partKey, label, row, buildTitles, index }) {
  const [open, setOpen] = useState(index < 3)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          {label}
        </span>
        {open
          ? <ChevronUp size={16} style={{ color: 'var(--text-3)' }} />
          : <ChevronDown size={16} style={{ color: 'var(--text-3)' }} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {buildTitles.map((title, i) => {
                const displayVal = resolvePartValue(row, i, partKey)
                const isEmpty    = displayVal === '—'

                return (
                  <div key={i} className="flex flex-col gap-1 px-5 py-3"
                    style={{ borderBottom: i < buildTitles.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <p className="text-[11px] font-semibold"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                      {title}
                    </p>
                    <p className="text-sm"
                      style={{ color: isEmpty ? 'var(--text-3)' : 'var(--text-2)' }}>
                      {displayVal}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Compare Component Table ─────────────────────────────────── */
export function CompareComponentTable({ componentComparison, builds = [] }) {
  if (!componentComparison || !builds.length) return null

  const buildTitles = builds.map((b, i) => b.title ?? `Build ${i + 1}`)

  return (
    <MotionSection direction="up">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Parts
        </p>
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          Component Breakdown
        </h2>
        {builds.length > 2 && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            Scroll horizontally to view all builds.
          </p>
        )}
      </div>

      {/* Desktop table — hidden on small screens */}
      <div className="hidden sm:block">
        <DesktopTable componentComparison={componentComparison} buildTitles={buildTitles} />
      </div>

      {/* Mobile accordion — shown on small screens */}
      <div className="sm:hidden flex flex-col gap-3">
        {PART_KEYS.map(({ key, label }, i) => (
          <MobilePartCard
            key={key}
            partKey={key}
            label={label}
            row={componentComparison?.[key]}
            buildTitles={buildTitles}
            index={i}
          />
        ))}
      </div>
    </MotionSection>
  )
}