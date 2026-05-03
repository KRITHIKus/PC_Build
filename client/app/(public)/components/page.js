'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGetComponentsQuery } from '@/services/componentsApi'
import { ComponentsHeader }     from '@/components/components/ComponentsHeader'
import { ComponentGrid }        from '@/components/components/ComponentGrid'
import { FiltersSidebar, FiltersDrawer, FiltersTrigger } from '@/components/components/ComponentsFilters'
import { COMPONENT_CATEGORIES } from '@/lib/constants'

const INITIAL_FILTERS = { type: '', brand: '', sort: '', search: '' }

export default function ComponentsPage() {
  const [filters,       setFilters]       = useState(INITIAL_FILTERS)
  const [filterDrawer,  setFilterDrawer]  = useState(false)
  const [page,          setPage]          = useState(1)

  /* ── RTK Query ────────────────────────────────────────────── */
  const { data, isLoading, isError, refetch, isFetching } = useGetComponentsQuery({
    page,
    limit:  20,
    type:   filters.type,
    brand:  filters.brand,
    sort:   filters.sort,
    search: filters.search,
  })

  const components  = data?.components  ?? data?.data  ?? []
  const totalCount  = data?.total       ?? data?.count ?? null
  const totalPages  = data?.totalPages  ?? null

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const handleSearch = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPage(1)
  }, [])

  const handleClear = useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
  }, [])

  const hasFilters  = !!(filters.type || filters.brand || filters.sort || filters.search)
  const activeCount = [filters.type, filters.brand, filters.sort].filter(Boolean).length

  return (
    <div className="container-app py-10 sm:py-14">

      {/* Page header + search */}
      <ComponentsHeader
        search={filters.search}
        onSearch={handleSearch}
        totalCount={totalCount}
      />

      {/* Mobile: type chips + filter trigger row */}
      <div className="lg:hidden flex items-center gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <FiltersTrigger
          onClick={() => setFilterDrawer(true)}
          activeCount={activeCount}
        />
        {/* Type quick chips */}
        {COMPONENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange('type', filters.type === cat ? '' : cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background:  filters.type === cat ? 'rgba(255,59,31,0.12)' : 'rgba(255,255,255,0.04)',
              border:      filters.type === cat ? '1px solid rgba(255,59,31,0.3)' : '1px solid rgba(255,255,255,0.07)',
              color:       filters.type === cat ? 'var(--red)' : 'var(--text-2)',
              fontFamily:  'var(--font-display)',
              whiteSpace:  'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main layout: sidebar + grid */}
      <div className="flex gap-6 lg:gap-8 items-start">

        {/* Desktop filters sidebar */}
        <FiltersSidebar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClear}
        />

        {/* Grid area */}
        <div className="flex-1 min-w-0">
          <ComponentGrid
            components={components}
            isLoading={isLoading || isFetching}
            isError={isError}
            hasFilters={hasFilters}
            onClear={handleClear}
            onRetry={refetch}
          />

          {/* Pagination */}
          {totalPages > 1 && !isLoading && !isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-10"
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-30"
                style={{
                  background: 'var(--surface-2)',
                  border:     '1px solid var(--border)',
                  color:      'var(--text-2)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                ← Prev
              </button>

              <span
                className="px-3 py-2 text-sm"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-30"
                style={{
                  background: 'var(--surface-2)',
                  border:     '1px solid var(--border)',
                  color:      'var(--text-2)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Next →
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FiltersDrawer
        isOpen={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClear}
      />
    </div>
  )
}

