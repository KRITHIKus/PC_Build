'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { COMPONENT_CATEGORIES, SORT_OPTIONS } from '@/lib/constants'

const BRANDS = [
  'AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte',
  'Corsair', 'G.Skill', 'Samsung', 'Western Digital',
  'Seagate', 'Cooler Master', 'Noctua', 'be quiet!',
  'Seasonic', 'EVGA', 'Kingston', 'Crucial',
]

/* ── Single filter group ─────────────────────────────────────── */
function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

/* ── Chip toggle button ──────────────────────────────────────── */
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-left"
      style={{
        background:  active ? 'rgba(255,59,31,0.12)' : 'rgba(255,255,255,0.03)',
        border:      active ? '1px solid rgba(255,59,31,0.3)' : '1px solid rgba(255,255,255,0.07)',
        color:       active ? 'var(--red)' : 'var(--text-2)',
        fontFamily:  'var(--font-display)',
        boxShadow:   active ? '0 0 8px rgba(255,59,31,0.15)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

/* ── Select dropdown ─────────────────────────────────────────── */
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none text-xs px-3 py-2.5 rounded-xl outline-none"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border:     '1px solid rgba(255,255,255,0.08)',
          color:      value ? 'var(--text-1)' : 'var(--text-3)',
          fontFamily: 'var(--font-display)',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option
            key={typeof o === 'string' ? o : o.value}
            value={typeof o === 'string' ? o : o.value}
            style={{ background: 'var(--surface-3)', color: 'var(--text-1)' }}
          >
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-3)' }}
      />
    </div>
  )
}

/* ── Filter content (shared between sidebar + drawer) ────────── */
function FilterContent({ filters, onChange, onClear }) {
  const hasActive =
    filters.type || filters.brand || filters.sort

  return (
    <div className="flex flex-col gap-6">

      {/* Clear all */}
      {hasActive && (
        <button
          onClick={onClear}
          className="self-start text-xs font-semibold transition-colors"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
        >
          Clear all filters
        </button>
      )}

      {/* Type */}
      <FilterGroup label="Component Type">
        <div className="flex flex-wrap gap-1.5">
          {COMPONENT_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              active={filters.type === cat}
              onClick={() => onChange('type', filters.type === cat ? '' : cat)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup label="Brand">
        <FilterSelect
          value={filters.brand}
          onChange={(v) => onChange('brand', v)}
          options={BRANDS}
          placeholder="All Brands"
        />
      </FilterGroup>

      {/* Sort */}
      <FilterGroup label="Sort By">
        <FilterSelect
          value={filters.sort}
          onChange={(v) => onChange('sort', v)}
          options={SORT_OPTIONS}
          placeholder="Default"
        />
      </FilterGroup>

    </div>
  )
}

/* ── Desktop sidebar ─────────────────────────────────────────── */
export function FiltersSidebar({ filters, onChange, onClear }) {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 flex-shrink-0"
      style={{ position: 'sticky', top: '88px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
    >
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={14} style={{ color: 'var(--red)' }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
          >
            Filters
          </span>
        </div>
        <FilterContent filters={filters} onChange={onChange} onClear={onClear} />
      </div>
    </aside>
  )
}

/* ── Mobile filter drawer ────────────────────────────────────── */
export function FiltersDrawer({ isOpen, onClose, filters, onChange, onClear }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="filter-backdrop"
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="filter-panel"
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex flex-col"
            style={{
              background:   'var(--surface-1)',
              borderTop:    '1px solid var(--border)',
              boxShadow:    '0 -20px 60px rgba(0,0,0,0.7)',
              maxHeight:    '85dvh',
              borderRadius: '20px 20px 0 0',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} style={{ color: 'var(--red)' }} />
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
                >
                  Filters
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ color: 'var(--text-2)' }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterContent filters={filters} onChange={onChange} onClear={onClear} />
            </div>

            {/* Apply button */}
            <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
                  color:      '#fff',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Mobile filter trigger button ────────────────────────────── */
export function FiltersTrigger({ onClick, activeCount = 0 }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium transition-all duration-150 flex-shrink-0"
      style={{
        background: activeCount > 0 ? 'rgba(255,59,31,0.1)' : 'var(--surface-2)',
        border:     activeCount > 0 ? '1px solid rgba(255,59,31,0.3)' : '1px solid var(--border)',
        color:      activeCount > 0 ? 'var(--red)' : 'var(--text-2)',
        fontFamily: 'var(--font-display)',
      }}
    >
      <SlidersHorizontal size={15} />
      Filters
      {activeCount > 0 && (
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: 'var(--red)', color: '#fff' }}
        >
          {activeCount}
        </span>
      )}
    </button>
  )
}