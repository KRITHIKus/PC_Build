'use client'

import { RefreshCw, TrendingUp } from 'lucide-react'
import { useGetLatestPriceQuery } from '@/services/pricingApi'

export default function LatestPrice({ componentId, region }) {

  const { data, isLoading, error, refetch } = useGetLatestPriceQuery(
    { componentId, region },
    { skip: !componentId || !region }
  )

  if (!componentId || !region) return null

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
        }}
      >
        Loading latest price…
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
        }}
      >
        No price available for this region
      </div>
    )
  }

  const price = data?.data?.price
  const isZeroPrice = !price || Number(price) === 0

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,59,31,0.1)', color: 'var(--red)' }}
        >
          <TrendingUp size={14} />
        </span>

        <div className="flex flex-col gap-0.5">
          <p
            className="text-[10px] uppercase font-semibold"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
          >
            Latest Price
          </p>

          {isZeroPrice ? (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium w-fit"
              style={{
                background: 'var(--surface-1)',
                color: 'var(--text-3)',
                border: '1px solid var(--border)',
              }}
            >
              No Price Data
            </span>
          ) : (
            <p
              className="text-base font-bold"
              style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
            >
              ₹{Number(price).toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={refetch}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs flex-shrink-0"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-display)',
        }}
      >
        <RefreshCw size={11} />
        Refresh
      </button>
    </div>
  )
}