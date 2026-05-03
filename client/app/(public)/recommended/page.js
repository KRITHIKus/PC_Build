'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, PackageSearch } from 'lucide-react'
import { useGetFeaturedBuildsQuery } from '@/services/buildsApi'
import { RecommendedHeader }         from '@/components/builds/RecommendedHeader'
import { BuildFilters }              from '@/components/builds/BuildFilters'
import { BuildCard }                 from '@/components/builds/BuildCard'
import { CompareTray }               from '@/components/builds/CompareTray'

/* ── Skeleton card ───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col gap-4 p-6"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', minHeight: '380px' }}
    >
      <div className="flex items-center justify-between">
        <div className="animate-pulse h-6 w-24 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }} />
        <div className="animate-pulse h-5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="animate-pulse h-7 w-3/4 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="animate-pulse h-4 w-full rounded"    style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="animate-pulse h-4 w-5/6 rounded"    style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex flex-col gap-2.5 mt-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="animate-pulse w-7 h-7 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,59,31,0.08)' }} />
            <div className="animate-pulse h-4 flex-1 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="animate-pulse h-8 w-32 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="flex gap-2.5">
          <div className="animate-pulse flex-1 h-11 rounded-xl" style={{ background: 'rgba(255,59,31,0.15)' }} />
          <div className="animate-pulse flex-1 h-11 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyState({ filter, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center col-span-full"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <PackageSearch size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h3
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
      >
        No builds found
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-2)' }}>
        {filter !== 'all'
          ? `No builds match the "${filter}" filter.`
          : 'No recommended builds are available right now.'}
      </p>
      {filter !== 'all' && (
        <button
          onClick={onClear}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: 'rgba(255,59,31,0.1)',
            border:     '1px solid rgba(255,59,31,0.25)',
            color:      'var(--red)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Show all builds
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
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h3
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
      >
        Failed to load builds
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-2)' }}>
        Could not reach the server. Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
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

/* ── Filter matching ─────────────────────────────────────────── */
function matchesFilter(build, filter) {
  if (filter === 'all') return true

  const haystack = [
    build.title        ?? '',
    build.useCase      ?? '',
    build.source       ?? '',
    build.description  ?? '',
    ...(build.tags ?? []),
  ].join(' ').toLowerCase()

  const map = {
    gaming:  ['gaming', 'game', 'fps', 'esport'],
    creator: ['creator', 'creation', 'content', 'video', 'edit', 'render', '3d', 'studio'],
    ai:      ['ai', 'ml', 'machine learning', 'deep learning', 'training', 'inference'],
    office:  ['office', 'productivity', 'work', 'business', 'everyday', 'budget', 'smart'],
    dream:   ['dream', 'ultimate', 'flagship', 'extreme', 'no compromise', 'beast'],
  }

  const keywords = map[filter] ?? [filter]
  return keywords.some(kw => haystack.includes(kw))
}

/* ── Recommended Page ────────────────────────────────────────── */
export default function RecommendedPage() {
  const [activeFilter, setActiveFilter]   = useState('all')
  const [selectedIds,  setSelectedIds]    = useState([])

  const { data, isLoading, isError, refetch, isFetching } = useGetFeaturedBuildsQuery({
    page: 1, limit: 50,
  })

  // Normalise — API may return { data: builds } or { builds } or array
  const allBuilds = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data))           return data
    if (Array.isArray(data.data))      return data.data
    if (Array.isArray(data.builds))    return data.builds
    return []
  }, [data])

  // Client-side filter
  const builds = useMemo(
    () => allBuilds.filter(b => matchesFilter(b, activeFilter)),
    [allBuilds, activeFilter]
  )

  // Compare toggle
  const handleCompareToggle = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 4)  return prev   // max 4 in tray
      return [...prev, id]
    })
  }

  const loading = isLoading || isFetching

  return (
    <div style={{ background: 'var(--bg)', paddingBottom: selectedIds.length > 0 ? '96px' : '0' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <RecommendedHeader />

      {/* ── Divider ────────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* ── Filters + Grid ─────────────────────────────────── */}
      <div className="container-app py-10 sm:py-14">

        {/* Filter bar */}
        <div className="mb-8 sm:mb-10">
          <BuildFilters
            active={activeFilter}
            onChange={(val) => { setActiveFilter(val); setSelectedIds([]) }}
          />
        </div>

        {/* Result count */}
        {!loading && !isError && allBuilds.length > 0 && (
          <motion.p
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mb-6"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
          >
            {builds.length === allBuilds.length
              ? `${builds.length} build${builds.length !== 1 ? 's' : ''}`
              : `${builds.length} of ${allBuilds.length} builds`}
          </motion.p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* Error */}
          {!loading && isError && <ErrorState onRetry={refetch} />}

          {/* Empty */}
          {!loading && !isError && builds.length === 0 && (
            <EmptyState filter={activeFilter} onClear={() => setActiveFilter('all')} />
          )}

          {/* Build cards */}
          {!loading && !isError && builds.map((build, i) => (
            <BuildCard
              key={build._id ?? i}
              build={build}
              index={i}
              isSelected={selectedIds.includes(build._id)}
              onCompareToggle={handleCompareToggle}
            />
          ))}
        </div>
      </div>

      {/* ── Compare tray ───────────────────────────────────── */}
      <CompareTray
        selected={selectedIds}
        onClear={() => setSelectedIds([])}
      />
    </div>
  )
}