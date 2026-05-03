'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, AlertCircle, RefreshCw, MapPin, ChevronDown } from 'lucide-react'
import { useGetComponentByIdQuery } from '@/services/componentsApi'
import { ComponentFallbackVisual } from '@/components/components/ComponentFallbackVisual'
import { ComponentPricing, PRICING_REGIONS } from '@/components/components/ComponentPricing'
import { ComponentSpecs, ComponentCompatibility, StockBadge } from '@/components/components/ComponentSpecs'

/* ── Type badge ──────────────────────────────────────────────── */
function TypeBadge({ type }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
      style={{
        background: 'rgba(255,59,31,0.1)',
        border:     '1px solid rgba(255,59,31,0.22)',
        color:      'var(--red)',
        fontFamily: 'var(--font-display)',
      }}
    >
      {type}
    </span>
  )
}

/* ── Region selector (detail page — controls pricing) ─────────── */
function DetailRegionSelector({ region, onChange }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <MapPin size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
      <div className="relative flex items-center">
        <select
          value={region}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none text-xs pl-0 pr-5 py-0 outline-none bg-transparent cursor-pointer"
          style={{
            color:      'var(--text-1)',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            border:     'none',
          }}
          aria-label="Select pricing region"
        >
          {PRICING_REGIONS.map((r) => (
            <option
              key={r}
              value={r}
              style={{ background: 'var(--surface-3)', color: 'var(--text-1)' }}
            >
              {r}
            </option>
          ))}
        </select>
        <ChevronDown
          size={11}
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-3)' }}
        />
      </div>
    </div>
  )
}

/* ── Detail image with onError fallback ──────────────────────── */
function DetailImage({ imageUrl, name, type }) {
  const [imgError, setImgError] = useState(false);

  const isPlaceholder = imageUrl?.includes("placehold.co");
  const shouldShowImage = imageUrl && !isPlaceholder && !imgError;

  if (!shouldShowImage) {
    return (
      <div className="w-52 h-52 flex items-center justify-center">
        <ComponentFallbackVisual type={type} size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-contain p-8"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        onError={() => setImgError(true)}
      />
    </div>
  );
}

/* ── Loading skeleton ────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div
        className="rounded-2xl animate-pulse"
        style={{ height: '360px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
      />
      <div className="flex flex-col gap-5">
        <div className="animate-pulse h-5 w-20 rounded-lg"  style={{ background: 'rgba(255,59,31,0.08)' }} />
        <div className="animate-pulse h-8 w-3/4 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="animate-pulse h-5 w-1/3 rounded"    style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="animate-pulse h-24 w-full rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="animate-pulse h-32 w-full rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  )
}

/* ── Error state ─────────────────────────────────────────────── */
function DetailError({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,59,31,0.08)', border: '1px solid rgba(255,59,31,0.18)' }}
      >
        <AlertCircle size={28} style={{ color: 'var(--red)' }} strokeWidth={1.5} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Component not found
      </h2>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-2)' }}>
        This component may have been removed or the link is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/components"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{
            background: 'var(--surface-2)',
            border:     '1px solid var(--border)',
            color:      'var(--text-1)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Back to catalog
        </Link>
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
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

/* ── Component Detail Page ───────────────────────────────────── */
export default function ComponentDetailPage({ params }) {
  const { id }  = params
  const [region, setRegion] = useState('Karnataka')

  const { data, isLoading, isError, refetch } = useGetComponentByIdQuery(id, { skip: !id })

  // Normalise response shape
  const component = data?.component ?? data?.data ?? data

  return (
    <div className="container-app py-10 sm:py-14">

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back to Components
        </Link>
      </motion.div>

      {/* Loading */}
      {isLoading && <DetailSkeleton />}

      {/* Error */}
      {isError && <DetailError onRetry={refetch} />}

      {/* Content */}
      {!isLoading && !isError && component && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">

            {/* ── Left: image / fallback ─────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center rounded-2xl overflow-hidden"
              style={{
                minHeight:  '300px',
                background: 'var(--surface-2)',
                border:     '1px solid var(--border)',
              }}
            >
              <DetailImage
                imageUrl={component.imageUrl}
                name={component.name}
                type={component.type}
              />

              {/* Top glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.4), transparent)' }}
              />
            </motion.div>

            {/* ── Right: info ────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5"
            >
              {/* Badges row */}
              <div className="flex items-center gap-3 flex-wrap">
                {component.type && <TypeBadge type={component.type} />}
                <StockBadge inStock={component.inStock} />
              </div>

              {/* Name */}
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold leading-tight mb-1"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                >
                  {component.name}
                </h1>
                {component.brand && (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                  >
                    by {component.brand}
                    {component.model ? ` · ${component.model}` : ''}
                  </p>
                )}
              </div>

              {/* Description */}
              {component.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {component.description}
                </p>
              )}

              {/* Region selector — sits above pricing card */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                >
                  Pricing region:
                </span>
                <DetailRegionSelector region={region} onChange={setRegion} />
              </div>

              {/* Pricing — controlled by region state */}
              <ComponentPricing
                componentId={component._id}
                estimatedPrice={component.estimatedPrice}
                region={region}
              />

              {/* Action buttons ─────────────────────────────
                  Mobile:  full-width stacked, 48px height
                  Desktop: side-by-side, auto width
              ────────────────────────────────────────────── */}
             <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <Link
    href="/build-lab"
    className="group relative flex min-h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_26px_rgba(255,59,31,0.45)] active:scale-[0.98]"
    style={{
      background: "linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)",
      fontFamily: "var(--font-display)",
    }}
  >
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    <Package size={17} className="relative z-10 shrink-0" />
    <span className="relative z-10">Add to Build</span>
  </Link>

  <Link
    href="/compare"
    className="group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 active:scale-[0.98]"
    style={{
      background: "var(--surface-2)",
      borderColor: "var(--border)",
      color: "var(--text-1)",
      fontFamily: "var(--font-display)",
    }}
  >
    <span>Compare</span>
  </Link>
</div>
            </motion.div>
          </div>

          {/* Specs + Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            <ComponentSpecs specs={component.specs ?? {}} />
            <ComponentCompatibility compatibility={component.compatibility ?? component.specs ?? {}} />
          </motion.div>
        </motion.div>
      )}

      {/* Not found (no error, no data) */}
      {!isLoading && !isError && !component && (
        <DetailError onRetry={refetch} />
      )}
    </div>
  )
}