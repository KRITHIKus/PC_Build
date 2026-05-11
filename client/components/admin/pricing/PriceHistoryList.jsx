'use client'

import { useEffect } from 'react'
import { useGetPricingHistoryQuery } from '@/services/pricingApi'

export default function PriceHistoryList({ componentId, refreshKey, region }) {

  const { data, isLoading, refetch } = useGetPricingHistoryQuery(
    { componentId, page: 1, limit: 10, region },
    { skip: !componentId || !region }
  )

  useEffect(() => {
    if (componentId && region && refreshKey) {
      refetch()
    }
  }, [refreshKey, componentId, region, refetch])

  if (!componentId || !region) return null

  const items = Array.isArray(data?.data) ? data.data : []

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
        >
          {region} · Pricing History
        </p>

        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-3)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {items.length}
        </span>
      </div>

      {isLoading && (
        <div className="px-5 py-4 text-xs" style={{ color: 'var(--text-3)' }}>
          Loading…
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div
          className="px-5 py-6 text-center text-xs"
          style={{ color: 'var(--text-3)' }}
        >
          No pricing history for this region.
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {items.map((item, i) => {
            const price = Number(item.price || 0)
            const isZeroPrice = price === 0
            const dateStr =
              item.createdAt || item.date
                ? new Date(item.createdAt || item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                  })
                : null

            return (
              <div
                key={item._id}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i === 0 ? 'rgba(255,59,31,0.04)' : 'transparent',
                }}
              >
                {/* Left: latest badge + price */}
                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        background: 'rgba(255,59,31,0.1)',
                        color: 'var(--red)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      Latest
                    </span>
                  )}

                  {isZeroPrice ? (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: 'var(--surface-2)',
                        color: 'var(--text-3)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      No Price Data
                    </span>
                  ) : (
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
                    >
                      ₹{price.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Right: source + date */}
                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {item.sourceName || '—'}
                  </span>

                  {dateStr && (
                    <span
                      className="text-[10px]"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                    >
                      {dateStr}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}