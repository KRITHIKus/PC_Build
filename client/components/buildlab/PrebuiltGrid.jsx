'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { useGetFeaturedBuildsQuery } from '@/services/buildsApi'
import { PrebuiltCard } from './PrebuiltCard'

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', minHeight: '260px' }}
    >
      <div className="animate-pulse h-5 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="animate-pulse h-4 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex flex-col gap-2 mt-2">
        {[1,2,3].map(i => (
          <div key={i} className="animate-pulse h-7 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
      <div className="mt-auto flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="animate-pulse h-6 w-24 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="animate-pulse h-8 w-24 rounded-xl" style={{ background: 'rgba(255,59,31,0.1)' }} />
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={24} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
        Failed to load templates
      </p>
      <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>Could not reach server.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
        style={{ background: 'rgba(255,59,31,0.1)', border: '1px solid rgba(255,59,31,0.25)', color: 'var(--red)', fontFamily: 'var(--font-display)' }}
      >
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  )
}

export function PrebuiltGrid({ onUseAsBase }) {
  const { data, isLoading, isError, refetch, isFetching } = useGetFeaturedBuildsQuery({ page: 1, limit: 6 })

  const builds = (() => {
    if (!data) return []
    if (Array.isArray(data))        return data
    if (Array.isArray(data.data))   return data.data
    if (Array.isArray(data.builds)) return data.builds
    return []
  })()

  const loading = isLoading || isFetching

  return (
    <div className="py-10 sm:py-12">
      <div className="container-app">
        <div className="mb-7">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
          >
            Templates
          </p>
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}
          >
            Start from a prebuilt template
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
            Pick a build and customise it to fit your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          {!loading && isError && <ErrorState onRetry={refetch} />}
          {!loading && !isError && builds.length === 0 && (
            <p className="col-span-full text-sm text-center py-12" style={{ color: 'var(--text-3)' }}>
              No templates available.
            </p>
          )}
          {!loading && !isError && builds.slice(0, 6).map((build, i) => (
            <PrebuiltCard
              key={build._id ?? i}
              build={build}
              onUseAsBase={onUseAsBase}
            />
          ))}
        </div>
      </div>
    </div>
  )
}