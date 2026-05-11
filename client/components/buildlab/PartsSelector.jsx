'use client'

import { useState } from 'react'
import { Search, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useGetComponentsQuery } from '@/services/componentsApi'

const PART_SLOTS = [
  { key: 'cpu',         label: 'CPU',         type: 'CPU'         },
  { key: 'gpu',         label: 'GPU',         type: 'GPU'         },
  { key: 'ram',         label: 'RAM',         type: 'RAM'         },
  { key: 'motherboard', label: 'Motherboard', type: 'Motherboard' },
  { key: 'storage',     label: 'Storage',     type: 'Storage'     },
  { key: 'psu',         label: 'PSU',         type: 'PSU'         },
  { key: 'cabinet',     label: 'Cabinet',     type: 'Cabinet'        },
  { key: 'cooling',     label: 'Cooling',     type: 'Cooling'     },
]

/* ── Single slot ─────────────────────────────────────────────── */
function PartSlot({ slot, selectedComponent, onSelect }) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetComponentsQuery(
    { type: slot.type, search: search.length >= 2 ? search : '', limit: 30 },
    { skip: !open }
  )

  const components = (() => {
    if (!data) return []
    if (Array.isArray(data))             return data
    if (Array.isArray(data.components))  return data.components
    if (Array.isArray(data.data))        return data.data
    return []
  })()

  const handleSelect = (comp) => {
    onSelect(slot.key, comp)
    setOpen(false)
    setSearch('')
  }

  return (
    <div
      className="rounded-xl overflow-auto"
      style={{ border: open ? '1px solid rgba(255,59,31,0.35)' : '1px solid var(--border)', transition: 'border-color 0.15s' }}
    >

      {/* Slot header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: 'var(--surface-1)' }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span
            className="text-[10px] font-bold uppercase tracking-wider w-14 flex-shrink-0"
            style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', width:"96px" }}
          >
            {slot.label} 
          </span>
          <span
            className="text-sm truncate"
            style={{
              color:      selectedComponent ? 'var(--text-1)' : 'var(--text-3)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {selectedComponent?.name ?? `Select ${slot.label}`}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedComponent && (
            <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
              <Check size={10} color="#fff" strokeWidth={3} />
            </span>
          )}
          {open
            ? <ChevronUp  size={15} style={{ color: 'var(--text-3)' }} />
            : <ChevronDown size={15} style={{ color: 'var(--text-3)' }} />
          }
        </div>
      </button>

      {/* Dropdown */}
     {open && (
  <div
  className="max-h-56 overflow-y-auto min-h-0 overscroll-contain"
  onWheel={(e) => e.stopPropagation()}

        
  >

    {/* Search (fixed at top inside scroll) */}
    <div
      className="sticky top-0 z-10 px-3 py-2.5"
      style={{
        background: 'var(--surface-2)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-3)' }}
        />
        <input
          type="text"
          placeholder={`Search ${slot.label}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-8 pl-8 pr-3 rounded-lg text-xs outline-none"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-1)',
            fontFamily: 'var(--font-display)',
          }}
          autoFocus
        />
      </div>
    </div>

    {/* Content */}
    <div>
      {isLoading && (
        <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-3)' }}>
          Loading…
        </div>
      )}

      {!isLoading && components.length === 0 && (
        <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-3)' }}>
          {search.length > 0 && search.length < 2
            ? 'Type at least 2 characters to search.'
            : 'No results found.'}
        </div>
      )}

      {selectedComponent && !isLoading && (
        <button
          type="button"
          onClick={() => { onSelect(slot.key, null); setOpen(false) }}
          className="w-full text-left px-4 py-2.5 text-xs"
          style={{ color: 'var(--red)' }}
        >
          Clear selection
        </button>
      )}

      {!isLoading && components.map(comp => {
        const isSelected = selectedComponent?._id === comp._id

        return (
          <button
            key={comp._id}
            type="button"
            onClick={() => handleSelect(comp)}
            className="w-full text-left px-4 py-2.5 flex justify-between"
            style={{
              background: isSelected ? 'rgba(255,59,31,0.08)' : 'transparent',
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs truncate">{comp.name}</p>
              {comp.brand && (
                <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                  {comp.brand}
                </p>
              )}
            </div>

            {comp.estimatedPrice != null && (
              <span className="text-[10px]">
                ₹{comp.estimatedPrice.toLocaleString('en-IN')}
              </span>
            )}
          </button>
        )
      })}
    </div>
  </div>
)}
    </div>
  )
}

/* ── Parts Selector ──────────────────────────────────────────── */
export function PartsSelector({ selectedParts, onSelectPart }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
        >
          Select Parts
        </p>
      </div>
      {PART_SLOTS.map(slot => (
        <PartSlot
          key={slot.key}
          slot={slot}
          selectedComponent={selectedParts[slot.key]}
          onSelect={onSelectPart}
        />
      ))}
    </div>
  )
}

export { PART_SLOTS }