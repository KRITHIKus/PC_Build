'use client'

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'
import { useGetFeaturedBuildByIdQuery } from '@/services/buildsApi'
import { BuildDetailHero }         from '@/components/builds/BuildDetailHero'
import { BuildAnalyticsChart }     from '@/components/builds/BuildAnalyticsChart'
import { BuildPartCard, StoragePartCard } from '@/components/builds/BuildPartCard'
import { BuildCompatibilityPanel } from '@/components/builds/BuildCompatibilityPanel'
import { MotionSection }           from '@/components/shared/MotionSection'

/* ── Section heading ─────────────────────────────────────────── */
function SectionHeading({ label, count }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2
        className="text-xl sm:text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}
      >
        {label}
      </h2>
      {count != null && (
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(255,59,31,0.1)',
            border:     '1px solid rgba(255,59,31,0.22)',
            color:      'var(--red)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {count}
        </span>
      )}
    </div>
  )
}

/* ── Loading skeleton ────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="rounded-2xl h-64" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }} />
      <div className="rounded-2xl h-72" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl h-56" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Error state ─────────────────────────────────────────────── */
function DetailError({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Build not found
      </h2>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-2)' }}>
        This build may have been removed or the link is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/recommended"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: 'var(--surface-2)',
            border:     '1px solid var(--border)',
            color:      'var(--text-1)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Back to Recommended
        </Link>
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
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
      </div>
    </div>
  )
}

/* ── Parts section ───────────────────────────────────────────── */
function PartsSection({ parts = {} }) {
  const {
    cpu, gpu, ram, motherboard,
    storage = [], psu, cabinet, cooling,
  } = parts

  // Build ordered list of singular parts
  const singularParts = [
    { key: 'cpu',         entry: cpu         },
    { key: 'gpu',         entry: gpu         },
    { key: 'ram',         entry: ram         },
    { key: 'motherboard', entry: motherboard },
    { key: 'psu',         entry: psu         },
    { key: 'cabinet',     entry: cabinet     },
    { key: 'cooling',     entry: cooling     },
  ].filter(p => p.entry != null)

  const storageArr = Array.isArray(storage) ? storage : (storage ? [storage] : [])
  const totalCount = singularParts.length + storageArr.length

  if (totalCount === 0) {
    return (
      <MotionSection direction="up">
        <SectionHeading label="Components" />
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>No components listed for this build.</p>
      </MotionSection>
    )
  }

  return (
    <MotionSection direction="up">
      <SectionHeading label="Components" count={totalCount} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {singularParts.map(({ key, entry }, i) => (
          <BuildPartCard key={key} partKey={key} partEntry={entry} index={i} />
        ))}
        {storageArr.length > 0 && (
          <StoragePartCard
            storageArray={storageArr}
            startIndex={singularParts.length}
          />
        )}
      </div>
    </MotionSection>
  )
}

/* ── Recommended Build Detail Page ───────────────────────────── */
export default function RecommendedBuildDetailPage({ params }) {
  const { id } = params

  const { data, isLoading, isError, refetch } = useGetFeaturedBuildByIdQuery(id, { skip: !id })

  // Normalise response — API returns { success, data: build }
  const build = data?.data ?? data

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <div className="container-app py-10 sm:py-14">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <Link
            href="/recommended"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)' }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Back to Recommended
          </Link>
        </motion.div>

        {/* Loading */}
        {isLoading && <DetailSkeleton />}

        {/* Error */}
        {isError && <DetailError onRetry={refetch} />}

        {/* Not found */}
        {!isLoading && !isError && !build && <DetailError onRetry={refetch} />}

        {/* Content */}
        {!isLoading && !isError && build && (
          <div className="flex flex-col gap-10">

            {/* 1. Hero */}
            <BuildDetailHero build={build} />

            {/* 2. Analytics chart */}
            <MotionSection direction="up" delay={0.06}>
              <SectionHeading label="Cost Analytics" />
              <BuildAnalyticsChart parts={build.parts ?? {}} />
            </MotionSection>

            {/* 3. Parts */}
            <PartsSection parts={build.parts ?? {}} />

            {/* 4. Compatibility */}
            <MotionSection direction="up" delay={0.04}>
              <SectionHeading label="Compatibility" />
              <BuildCompatibilityPanel compatibilityResult={build.compatibilityResult ?? null} />
            </MotionSection>

          </div>
        )}
      </div>
    </div>
  )
}