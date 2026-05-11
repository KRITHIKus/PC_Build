'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { MotionSection } from '@/components/shared/MotionSection'

/* ── Stat tile ───────────────────────────────────────────────── */
function PriceTile({ icon: Icon, label, value, sub, color = 'var(--red)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 p-5 rounded-2xl"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}14`, border: `1px solid ${color}25` }}
      >
        <Icon size={17} style={{ color }} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          {label}
        </p>
        <p className="text-xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ── Breakdown row ───────────────────────────────────────────── */
function BreakdownRow({ title, amount, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {title}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
        {amount != null ? formatPrice(amount) : '—'}
      </span>
    </motion.div>
  )
}

/* ── Compare Price Summary ───────────────────────────────────── */
export function ComparePriceSummary({ priceComparison }) {
  if (!priceComparison) return null

  const {
    cheapest,
    mostExpensive,
    priceDifference,
    breakdown = [],
  } = priceComparison

  const diffFormatted = priceDifference != null ? formatPrice(Math.abs(priceDifference)) : null

  return (
    <MotionSection direction="up">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
          Price Analysis
        </p>
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          Price Comparison
        </h2>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <PriceTile
          icon={TrendingDown}
          label="Most Affordable"
          value={cheapest?.totalEstimatedPrice != null ? formatPrice(cheapest.totalEstimatedPrice) : '—'}
          sub={cheapest?.title}
          color="#22c55e"
          delay={0}
        />
        <PriceTile
          icon={TrendingUp}
          label="Most Expensive"
          value={mostExpensive?.totalEstimatedPrice != null ? formatPrice(mostExpensive.totalEstimatedPrice) : '—'}
          sub={mostExpensive?.title}
          color="var(--red)"
          delay={0.08}
        />
        <PriceTile
          icon={DollarSign}
          label="Price Difference"
          value={diffFormatted ?? '—'}
          sub="between compared builds"
          color="#f59e0b"
          delay={0.16}
        />
      </div>

      {/* Breakdown table */}
      {breakdown.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
            Price Breakdown
          </p>
          {breakdown.map((row, i) => (
            <BreakdownRow
              key={row.title ?? i}
              title={row.title ?? row.label ?? `Build ${i + 1}`}
              amount={row.totalEstimatedPrice ?? row.price ?? row.amount}
              index={i}
            />
          ))}
        </div>
      )}
    </MotionSection>
  )
}