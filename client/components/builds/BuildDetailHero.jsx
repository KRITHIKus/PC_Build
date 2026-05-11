'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Star, Sparkles, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

/* ── Dynamic import — Three.js must NOT run on SSR ───────────── */
const BuildPcModel = dynamic(
  () => import('./BuildPcModel'),
  {
    ssr:     false,
    loading: () => (
      <div className="w-full flex items-center justify-center" style={{ minHeight: '300px' }}>
        <span className="text-xs font-mono animate-pulse" style={{ color: 'rgba(255,255,255,0.25)' }}>
          loading model…
        </span>
      </div>
    ),
  }
)

/* ── Badge chip ──────────────────────────────────────────────── */
function Badge({
  icon: Icon,
  label,
  color  = 'var(--red)',
  bg     = 'rgba(255,59,31,0.1)',
  border = 'rgba(255,59,31,0.25)',
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
      style={{ background: bg, border: `1px solid ${border}`, color, fontFamily: 'var(--font-display)' }}
    >
      {Icon && <Icon size={11} fill="currentColor" />}
      {label}
    </span>
  )
}

/* ── Info row ─────────────────────────────────────────────────── */
function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
        {label}
      </span>
      <span className="text-xs font-medium" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {value}
      </span>
    </div>
  )
}

/* ── Build Detail Hero ───────────────────────────────────────── */
export function BuildDetailHero({ build }) {
  const {
    title, description,
    totalEstimatedPrice, currency,
    source, journeyStatus,
    isFeatured, isDreamBuild,
    compatibilityResult,
    buildType,
    createdAt,
    updatedAt,
    author,
    purpose,
  } = build

  const isCompatible = compatibilityResult?.valid ?? null

  const infoRows = [
    { label: 'Source',         value: source },
    { label: 'Journey Status', value: journeyStatus },
    { label: 'Build Type',     value: buildType },
    { label: 'Purpose',        value: purpose },
    { label: 'Author',         value: author },
    { label: 'Created',        value: createdAt },
    { label: 'Last Updated',   value: updatedAt },
  ]

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-8"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Top glow line */}
      <div
        style={{
          height: '1px',
          background: isDreamBuild
            ? 'linear-gradient(90deg,transparent,rgba(245,158,11,0.55),transparent)'
            : 'linear-gradient(90deg,transparent,rgba(255,59,31,0.55),transparent)',
        }}
      />

      {/* Bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDreamBuild
            ? 'radial-gradient(ellipse 60% 50% at 60% 30%, rgba(245,158,11,0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 60% 30%, rgba(255,59,31,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* ── Left: info panel ─────────────────────────── */}
        <div className="p-7 sm:p-8 flex flex-col gap-5">

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2"
          >
            {isFeatured && <Badge icon={Star} label="Featured" />}
            {isDreamBuild && (
              <Badge
                icon={Sparkles} label="Dream Build"
                color="#f59e0b" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.3)"
              />
            )}
            {isCompatible === true && (
              <Badge
                icon={CheckCircle2} label="Compatible"
                color="#22c55e" bg="rgba(34,197,94,0.1)" border="rgba(34,197,94,0.25)"
              />
            )}
            {isCompatible === false && (
              <Badge
                label="Compatibility Issues"
                color="var(--red)" bg="rgba(255,59,31,0.1)" border="rgba(255,59,31,0.25)"
              />
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-1)' }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: 'var(--text-2)' }}
            >
              {description}
            </motion.p>
          )}

          {/* Price */}
          {totalEstimatedPrice != null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-col"
            >
              <span className="text-xs mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Total Estimated Price
              </span>
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', letterSpacing: '-0.03em' }}
              >
                {formatPrice(totalEstimatedPrice, currency ?? 'INR')}
              </span>
              {currency && (
                <span className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {currency} · Prices may vary
                </span>
              )}
            </motion.div>
          )}

          {/* Info rows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border:     '1px solid rgba(255,255,255,0.06)',
              padding:    '4px 16px',
            }}
          >
            {infoRows.map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </motion.div>
        </div>

        {/* ── Right: 3-D PC model ──────────────────────────
            Same container as before; illustration swapped
            for the interactive Three.js canvas.
        ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center p-6 lg:p-8
                     border-t border-white/5
                     lg:border-t-0 lg:border-l lg:border-white/5"
        >
          <div className="w-full max-w-sm">
            <BuildPcModel
              buildName={title}
              isDreamBuild={isDreamBuild}
            />
          </div>
        </motion.div>

      </div>
    </div>
  )
}