'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { formatPrice } from '@/lib/utils'
import { BarChart2 } from 'lucide-react'

/* ── Colour palette per bar ──────────────────────────────────── */
const BAR_COLORS = [
  '#ff3b1f', '#ff5533', '#e11d2e', '#ff6b4a',
  '#cc2e25', '#ff4d33', '#d9341e', '#ff7055',
]

/* ── Custom tooltip ──────────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div
      className="px-4 py-3 rounded-xl text-sm"
      style={{
        background:     'rgba(14,14,16,0.97)',
        border:         '1px solid rgba(255,59,31,0.35)',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.7)',
        fontFamily:     'var(--font-display)',
      }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{name}</p>
      <p style={{ color: 'var(--red)', fontWeight: 700, fontSize: '1rem' }}>
        {value > 0 ? formatPrice(value) : 'No price data'}
      </p>
    </div>
  )
}

/* ── Custom X-axis tick ──────────────────────────────────────── */
function CustomXTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0} y={0} dy={14}
        textAnchor="middle"
        fill="var(--text-3)"
        fontSize={11}
        fontFamily="var(--font-display)"
      >
        {payload.value}
      </text>
    </g>
  )
}

/* ── Custom Y-axis tick ──────────────────────────────────────── */
function CustomYTick({ x, y, payload }) {
  const val = payload.value
  const label = val >= 100000
    ? `₹${(val / 100000).toFixed(0)}L`
    : val >= 1000
    ? `₹${(val / 1000).toFixed(0)}k`
    : `₹${val}`
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-6} y={4}
        textAnchor="end"
        fill="var(--text-3)"
        fontSize={10}
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  )
}

/* ── Build Analytics Chart ───────────────────────────────────── */
export function BuildAnalyticsChart({ parts = {} }) {

  const chartData = useMemo(() => {
    const storageTotal = (parts.storage ?? []).reduce(
      (sum, s) => sum + (s?.component?.estimatedPrice ?? 0), 0
    )

    const rows = [
      { name: 'CPU',         value: parts.cpu?.component?.estimatedPrice         ?? 0 },
      { name: 'GPU',         value: parts.gpu?.component?.estimatedPrice         ?? 0 },
      { name: 'RAM',         value: parts.ram?.component?.estimatedPrice         ?? 0 },
      { name: 'Motherboard', value: parts.motherboard?.component?.estimatedPrice ?? 0 },
      { name: 'Storage',     value: storageTotal },
      { name: 'PSU',         value: parts.psu?.component?.estimatedPrice         ?? 0 },
      { name: 'Cabinet',     value: parts.cabinet?.component?.estimatedPrice     ?? 0 },
      { name: 'Cooling',     value: parts.cooling?.component?.estimatedPrice     ?? 0 },
    ]

    return rows
  }, [parts])

  const hasAnyPrice = chartData.some(d => d.value > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,59,31,0.1)', border: '1px solid rgba(255,59,31,0.2)' }}
        >
          <BarChart2 size={17} style={{ color: 'var(--red)' }} strokeWidth={2} />
        </div>
        <div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            Cost Breakdown
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Estimated price per component
          </p>
        </div>
      </div>

      {!hasAnyPrice ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            No pricing data available for this build.
          </p>
        </div>
      ) : (
        /* Mobile scrollable wrapper */
        <div className="overflow-x-auto -mx-1">
          <div style={{ minWidth: '640px', paddingLeft: '4px', paddingRight: '4px' }}>
            <BarChart
              width={640}
              height={280}
              data={chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={<CustomXTick />}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tick={<CustomYTick />}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,59,31,0.06)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.value > 0 ? BAR_COLORS[i % BAR_COLORS.length] : 'rgba(255,255,255,0.06)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
      )}

      {/* Legend row */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
        {chartData.filter(d => d.value > 0).map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: BAR_COLORS[chartData.indexOf(d) % BAR_COLORS.length] }}
            />
            <span className="text-[11px]" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}