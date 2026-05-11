'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Clock, Store, AlertCircle, MapPin, ChevronDown } from 'lucide-react'
import { useGetLatestPriceQuery } from '@/services/pricingApi'
import { formatPrice }           from '@/lib/utils'

/* ── Available regions ───────────────────────────────────────── */
export const PRICING_REGIONS = [
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Delhi',
  'Kerala',
]

/* ── Skeleton ────────────────────────────────────────────────── */
function PriceSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="animate-pulse h-8 w-32 rounded-lg"  style={{ background: 'rgba(255,59,31,0.08)' }} />
      <div className="animate-pulse h-4 w-48 rounded"     style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="animate-pulse h-4 w-36 rounded"     style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  )
}

/* ── Format checkedAt date ───────────────────────────────────── */
function formatChecked(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return null
  }
}

/* ── Region selector ─────────────────────────────────────────── */
function RegionSelector({ region, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-1.5">
      <MapPin size={11} style={{ color: 'var(--red)', flexShrink: 0 }} />
      <div className="relative">
        <select
          value={region}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none text-xs pr-5 pl-0 py-0 outline-none bg-transparent cursor-pointer"
          style={{
            color:      'var(--text-2)',
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
          size={10}
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-3)' }}
        />
      </div>
    </div>
  )
}

/* ── Component Pricing Section ───────────────────────────────── */
export function ComponentPricing({ componentId, estimatedPrice, region: regionProp }) {
  // If parent passes region (detail page), use it; otherwise manage locally
  const [localRegion, setLocalRegion] = useState('Karnataka')
  const region    = regionProp ?? localRegion
  const setRegion = regionProp !== undefined ? () => {} : setLocalRegion

  const { data, isLoading, isError, refetch } = useGetLatestPriceQuery(
    { componentId, region },
    { skip: !componentId }
    
  )
  // Normalise: API may return { price, sourceName, checkedAt } nested or flat
  const priceData = data?.pricing ?? data?.data ?? data

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Header row — title + region selector */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap gap-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: 'var(--red)' }} />
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)' }}
          >
            Live Pricing
          </h3>
        </div>

        {/* Region selector — shown when parent doesn't control region */}
        {regionProp === undefined && (
          <RegionSelector region={localRegion} onChange={setLocalRegion} />
        )}

        {/* If parent controls region, just show it as a label */}
        {regionProp !== undefined && (
          <div className="flex items-center gap-1">
            <MapPin size={11} style={{ color: 'var(--red)' }} />
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
            >
              {region}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && <PriceSkeleton />}

      {/* Error */}
      {isError && (
        <div className="flex flex-col gap-3">
          {estimatedPrice != null && (
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Estimated Price</p>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
              >
                {formatPrice(estimatedPrice)}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
            <AlertCircle size={12} />
            <span>Live pricing unavailable.</span>
            <button
              onClick={refetch}
              className="underline"
              style={{ color: 'var(--red)' }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {!isLoading && !isError && (
        <AnimatePresence mode="wait">
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-4"
          >
            {/* Live price */}
            {priceData?.price != null ? (
              <div>
                <p
                  className="text-xs mb-1"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                >
                  Current Market Price
                </p>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
                >
                  {formatPrice(priceData.price)}
                </p>
                {priceData.sourceName && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                    <Store size={11} />
                    <span>{priceData.sourceName}</span>
                  </div>
                )}
                {priceData.checkedAt && (
                  <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                    <Clock size={11} />
                    <span>{formatChecked(priceData.checkedAt)}</span>
                  </div>
                )}
              </div>
            ) : (
              /* No live price — show estimated */
              estimatedPrice != null && (
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>Estimated Price</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
                  >
                    {formatPrice(estimatedPrice)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                    Live pricing not available for {region}.
                  </p>
                </div>
              )
            )}

            {/* Comparison row */}
            {priceData?.price != null && estimatedPrice != null && (
              <div
                className="pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                  Estimated:{' '}
                  <span style={{ color: 'var(--text-2)' }}>{formatPrice(estimatedPrice)}</span>
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}