'use client'

import { useState, useMemo } from 'react'
import { useGetMyBuildsQuery, useGetUserFeaturedBuildsQuery } from '@/services/buildsApi'
import FeaturedBuilds from './components/FeaturedBuilds'
import BuildControls  from './components/BuildControls'
import BuildList      from './components/BuildList'

/* ─── Skeleton helpers ─── */

function SkeletonBox({ width = 'w-full', height = 'h-5', radius = 'rounded-lg' }) {
  return (
    <div className={`${width} ${height} ${radius} bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)] bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]`} />
  )
}

function SkeletonCardRow({ count = 2 }) {
  return (
    <div className="flex gap-4 overflow-x-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBox key={i} width="w-[280px] flex-shrink-0" height="h-[120px]" radius="rounded-xl" />
      ))}
    </div>
  )
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3">
          <SkeletonBox width="w-2/3" height="h-4" />
          <SkeletonBox width="w-2/5" height="h-3" />
          <SkeletonBox width="w-24"  height="h-7" radius="rounded-full" />
          <SkeletonBox height="h-9" />
        </div>
      ))}
    </div>
  )
}

/* ─── BuildsPage ─── */

export default function BuildsPage() {
  const {
    data: buildsResponse,
    isLoading: buildsLoading,
    isError: buildsError,
  } = useGetMyBuildsQuery()

  // extract the array safely (logic unchanged)
  const myBuilds = buildsResponse?.data || []

  const { data: featuredBuildsResponse, isLoading: featuredLoading } =
    useGetUserFeaturedBuildsQuery({ page: 1, limit: 12 })

  const featuredBuilds = featuredBuildsResponse?.builds || []

  const [search,        setSearch]        = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [journeyFilter, setJourneyFilter] = useState('')

  // Compute filtered builds (logic unchanged)
  const filteredBuilds = useMemo(() => {
    const featuredIds = new Set(
      (featuredBuildsResponse?.builds || []).map((b) => b._id)
    )

    return myBuilds.filter((build) => {
      if (featuredIds.has(build._id)) return false

      const matchesSearch =
        !search ||
        build.title?.toLowerCase().includes(search.toLowerCase()) ||
        build.description?.toLowerCase().includes(search.toLowerCase())

      const matchesFavorite = !showFavorites || build.isFavorite
      const matchesJourney  = !journeyFilter || build.journeyStatus === journeyFilter

      return matchesSearch && matchesFavorite && matchesJourney
    })
  }, [myBuilds, featuredBuildsResponse, search, showFavorites, journeyFilter])

  const isLoading = buildsLoading || featuredLoading

  return (
    <section className="space-y-8">

      {/* shimmer keyframe */}
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>

      {/* Error state */}
      {buildsError && (
        <div className="px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          Failed to load builds. Please refresh and try again.
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonCardRow count={2} />
          <SkeletonGrid count={6} />
        </div>
      )}

      {!isLoading && !buildsError && (
        <>
          {/* Featured section */}
          {featuredBuilds.length > 0 && (
            <FeaturedBuilds builds={featuredBuilds} />
          )}

          {/* All builds */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-display text-[var(--text-1)]">All Builds</h2>
                <span className="text-xs font-medium text-[var(--text-2)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-2.5 py-0.5">
                  {filteredBuilds.length} of {myBuilds.length - featuredBuilds.length}
                </span>
              </div>
            </div>

            <BuildControls
              search={search}
              onSearch={setSearch}
              showFavorites={showFavorites}
              onToggleFavorites={() => setShowFavorites((p) => !p)}
              journeyFilter={journeyFilter}
              onJourneyFilter={setJourneyFilter}
            />

            <BuildList builds={filteredBuilds} />
          </section>
        </>
      )}

    </section>
  )
}