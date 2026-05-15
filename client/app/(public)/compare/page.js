'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, RefreshCw, LayoutGrid, ArrowRight } from 'lucide-react'
import { useComparePublicBuildsMutation, useCompareHybridBuildsMutation
 } from '@/services/compareApi'
import { SystemLoader }           from '@/components/shared/SystemLoader'
import { CompareHeader }          from '@/components/compare/CompareHeader'
import { CompareBuildCard }       from '@/components/compare-build/CompareBuildCard'
import { ComparePriceSummary }    from '@/components/compare/ComparePriceSummary'
import { CompareCompatibility }   from '@/components/compare/CompareCompatibility'
import { CompareComponentTable }  from '@/components/compare/CompareComponentTable'
import { CompareInsights }        from '@/components/compare/CompareInsights'
import { MotionSection }          from '@/components/shared/MotionSection'

const MIN_IDS = 2
const MAX_IDS = 4



/* ── Thin divider ────────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
  )
}

/* ── Section label + heading ─────────────────────────────────── */
function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mb-6">
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-xl sm:text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
    </div>
  )
}

/* ── Not enough / too many IDs ───────────────────────────────── */
function InvalidIdState({ count }) {
  const tooMany  = count > MAX_IDS
  const tooFew   = count < MIN_IDS

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <LayoutGrid size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
        {tooMany ? 'Too many builds selected' : 'Not enough builds selected'}
      </h2>
      <p className="text-sm mb-7 max-w-sm" style={{ color: 'var(--text-2)' }}>
        {tooMany
          ? `Compare supports 2 to 4 builds at a time. You selected ${count}.`
          : 'Select at least 2 builds to run a comparison.'}
      </p>
      <Link
        href="/recommended"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
          color:      '#fff',
          fontFamily: 'var(--font-display)',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(255,59,31,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
      >
        Browse Recommended Builds
        <ArrowRight size={15} strokeWidth={2.2} />
      </Link>
    </div>
  )
}

/* ── API error ───────────────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
        Comparison failed
      </h2>
      <p className="text-sm mb-7 max-w-xs" style={{ color: 'var(--text-2)' }}>
        Could not compare these builds. Check your connection and try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/recommended"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
          Back to Builds
        </Link>
        <button onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,59,31,0.1)', border: '1px solid rgba(255,59,31,0.25)', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    </div>
  )
}

/* ── Inner page ──────────────────────────────────────────────── */
function ComparePageInner() {
  const searchParams = useSearchParams()
  const idsParam     = searchParams.get('ids') ?? ''
  const buildIds     = idsParam.split(',').map(s => s.trim()).filter(Boolean)
  const idCount      = buildIds.length
  const base= searchParams.get('base')

const [comparePublic, publicState] = useComparePublicBuildsMutation()
const [compareHybrid, hybridState] = useCompareHybridBuildsMutation()

const isHybrid = Boolean(base)

const {
  isLoading,
  isError,
  data,
  reset
} = isHybrid ? hybridState : publicState
  const [hasTriggered, setHasTriggered] = useState(false) // about this

  const isValidCount = idCount >= MIN_IDS && idCount <= MAX_IDS

useEffect(() => {
  if (isValidCount && !hasTriggered) {
    setHasTriggered(true)

    if (isHybrid) {
      compareHybrid({ base, buildIds })
    } else {
      comparePublic(buildIds)
    }
  }
}, [idsParam, base]) // eslint-disable-line

  const handleRetry = () => {
    reset()
    setHasTriggered(false)
    setTimeout(() => { setHasTriggered(true); if (isHybrid) {
  compareHybrid({ base, buildIds })
} else {
  comparePublic(buildIds)
} }, 50)
  }

  // Normalise response
  const result              = data?.data ?? data
  const builds              = result?.builds              ?? []
  const priceComparison     = result?.priceComparison     ?? null
  const componentComparison = result?.componentComparison ?? null
  const compatibility       = result?.compatibility       ?? null
  const insights            = result?.insights            ?? null
  const summary             = result?.summary             ?? null

  // Price order for banners
  const priceOrder = [...builds].sort(
    (a, b) => (a.totalEstimatedPrice ?? Infinity) - (b.totalEstimatedPrice ?? Infinity)
  )
  const cheapestId   = priceOrder[0]?._id
  const expensiveId  = priceOrder[priceOrder.length - 1]?._id

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>

      {/* Header — always visible */}
      <CompareHeader buildCount={idCount} />
      <div style={{ borderTop: '1px solid var(--border)' }} />

      <div className="container-app py-10 sm:py-14">

        {/* Validation: wrong count */}
        {!isValidCount && <InvalidIdState count={idCount} />}

        {/* Loading */}
        {isValidCount && isLoading && <SystemLoader />}

        {/* API Error */}
        {isValidCount && isError && !isLoading && <ErrorState onRetry={handleRetry} />}

        {/* Results — ordered: summary → builds → price → compat → components → insights */}
        {isValidCount && !isLoading && !isError && result && (
          <div className="flex flex-col gap-12">

            {/* 1 — Decision Summary */}
            {summary && (
              <MotionSection direction="up">
                <SectionHeading eyebrow="Overview" title="Decision Summary" />
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: 'rgba(255,59,31,0.05)', border: '1px solid rgba(255,59,31,0.18)' }}
                >
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
                  >
                    {typeof summary === 'string' ? summary : JSON.stringify(summary)}
                  </p>
                </div>
              </MotionSection>
            )}

            {/* 2 — Compared Builds */}
            {builds.length > 0 && (
              <MotionSection direction="up">
                <SectionHeading eyebrow="Builds" title="Compared Builds" />
                <div className={`grid gap-5 ${
                  builds.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : builds.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
                }`}>
                  {builds.map((build, i) => {
                    const compatResults = compatibility?.results
                    const compat = Array.isArray(compatResults)
                      ? compatResults[i]
                      : compatResults?.[build._id] ?? null

                    return (
                      <CompareBuildCard
                        key={build._id ?? i}
                        build={build}
                        compat={compat}
                        index={i}
                        isCheapest={builds.length > 1 && build._id === cheapestId}
                        isMostExpensive={builds.length > 1 && build._id === expensiveId && cheapestId !== expensiveId}
                      />
                    )
                  })}
                </div>
              </MotionSection>
            )}

            <Divider />

            {/* 3 — Price Analysis */}
            {priceComparison && (
              <ComparePriceSummary priceComparison={priceComparison} />
            )}

            <Divider />

            {/* 4 — Compatibility Status */}
            {compatibility && (
              <CompareCompatibility compatibility={compatibility} builds={builds} />
            )}

            <Divider />

            {/* 5 — Component Breakdown */}
            {componentComparison && (
              <CompareComponentTable componentComparison={componentComparison} builds={builds} />
            )}

            {/* 6 — Build Insights */}
            {insights && (
              <>
                <Divider />
                <CompareInsights insights={insights} />
              </>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page export — Suspense required for useSearchParams ─────── */
export default function ComparePage() {
  return (
    <Suspense fallback={<SystemLoader title="Loading…" subtitle="Preparing comparison" />}>
      <ComparePageInner />
    </Suspense>
  )
}