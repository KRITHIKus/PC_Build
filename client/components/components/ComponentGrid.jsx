'use client'

import { motion } from 'framer-motion'
import { PackageSearch, AlertCircle, RefreshCw } from 'lucide-react'
import { ComponentCard } from './ComponentCard'

/* ── Skeleton card ───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      {/* Image area */}
      <div
        className="animate-pulse"
        style={{ height: '140px', background: 'rgba(255,255,255,0.04)' }}
      />
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="animate-pulse h-5 w-12 rounded-md" style={{ background: 'rgba(255,59,31,0.1)' }} />
          <div className="animate-pulse h-5 w-16 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="animate-pulse h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="animate-pulse h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="animate-pulse h-3 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="flex gap-1.5 mt-1">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse h-5 w-14 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
        <div className="flex justify-between items-center mt-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="animate-pulse h-5 w-20 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="animate-pulse h-5 w-14 rounded" style={{ background: 'rgba(255,59,31,0.08)' }} />
        </div>
      </div>
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyState({ hasFilters, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center col-span-full"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <PackageSearch size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
      >
        No components found
      </h3>
      <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--text-2)' }}>
        {hasFilters
          ? 'Try adjusting your filters or search term.'
          : 'No components are available right now.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
          style={{
            background: 'rgba(255,59,31,0.1)',
            border:     '1px solid rgba(255,59,31,0.25)',
            color:      'var(--red)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Clear filters
        </button>
      )}
    </motion.div>
  )
}

/* ── Error state ─────────────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center col-span-full"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
      >
        Failed to load components
      </h3>
      <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--text-2)' }}>
        Something went wrong connecting to the server. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
        style={{
          background: 'rgba(255,59,31,0.1)',
          border:     '1px solid rgba(255,59,31,0.25)',
          color:      'var(--red)',
          fontFamily: 'var(--font-display)',
        }}
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </motion.div>
  )
}

/* ── Component Grid ──────────────────────────────────────────── */
export function ComponentGrid({
  components = [],
  isLoading  = false,
  isError    = false,
  hasFilters = false,
  onClear,
  onRetry,
}) {
  // Loading — show 12 skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  // Error
  if (isError) {
    return (
      <div className="grid grid-cols-1">
        <ErrorState onRetry={onRetry} />
      </div>
    )
  }

  // Empty
  if (components.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState hasFilters={hasFilters} onClear={onClear} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {components.map((c, i) => (
        <ComponentCard key={c._id} component={c} index={i} />
      ))}
    </div>
  )
}