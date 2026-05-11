'use client'

import { useEffect } from 'react'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { useGetPricingHistoryQuery } from '@/services/pricingApi'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const value = Number(payload?.[0]?.value || 0)

  return (
    <div
      className="px-3 py-2.5 rounded-xl shadow-xl"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
      }}
    >
      <p
        className="text-[10px] mb-1"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </p>
      <p
        className="text-sm font-bold"
        style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
      >
        ₹{value.toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default function PricingChart({ componentId, refreshKey, region }) {

  const { data, isLoading, refetch } = useGetPricingHistoryQuery(
    { componentId, page: 1, limit: 30, region },
    { skip: !componentId || !region }
  )

  useEffect(() => {
    if (componentId && region && refreshKey) {
      refetch()
    }
  }, [refreshKey, componentId, region, refetch])

  if (!componentId || !region) return null

  const raw = Array.isArray(data?.data) ? data.data : []
  const items = [...raw].reverse()

  const chartData = items.map((item) => {
    const safeDate = item.createdAt || item.date
    const parsedDate = safeDate ? new Date(safeDate) : null

    return {
      date:
        parsedDate && !isNaN(parsedDate)
          ? parsedDate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
            })
          : '—',
      price: Number(item.price || 0),
    }
  })

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider mb-4"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        Price History · {region}
      </p>

      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Loading chart…
          </p>
        </div>
      )}

      {!isLoading && chartData.length < 2 && (
        <div className="flex items-center justify-center h-40">
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            {chartData.length === 0
              ? 'No pricing data for this region.'
              : 'Add more data points to see the chart.'}
          </p>
        </div>
      )}

      {!isLoading && chartData.length >= 2 && (
        <div className="overflow-x-auto">
          <div style={{ minWidth: '520px', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: 'var(--text-3)',
                    fontFamily: 'var(--font-display)',
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                />

                <YAxis
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{
                    fontSize: 10,
                    fill: 'var(--text-3)',
                    fontFamily: 'var(--font-display)',
                  }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                  width={48}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#ff3b1f"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ff3b1f', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#ff3b1f', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}