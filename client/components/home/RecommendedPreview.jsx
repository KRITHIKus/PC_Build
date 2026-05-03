'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Monitor, Brain, Briefcase, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

const PREVIEW_BUILDS = [
  {
    id:       'gaming-pro',
    category: 'Gaming',
    icon:     Zap,
    name:     'Gaming Pro Build',
    tagline:  '1440p ultra settings, 144Hz+ ready',
    price:    '₹1,40,000',
    tier:     'High Performance',
    specs:    ['Ryzen 7 7800X3D', 'RTX 4070 Ti', '32GB DDR5', '2TB NVMe'],
    accent:   '#ff3b1f',
    glow:     'rgba(255,59,31,0.18)',
    badge:    'Most Popular',
  },
  {
    id:       'creator',
    category: 'Creator',
    icon:     Monitor,
    name:     'Creator Studio',
    tagline:  '4K video editing, 3D rendering ready',
    price:    '₹1,80,000',
    tier:     'Workstation',
    specs:    ['Ryzen 9 7950X', 'RTX 4080', '64GB DDR5', '4TB NVMe'],
    accent:   '#e65c1f',
    glow:     'rgba(230,92,31,0.16)',
    badge:    null,
  },
  {
    id:       'ai-ml',
    category: 'AI / ML',
    icon:     Brain,
    name:     'ML Workstation',
    tagline:  'Local model training & inference',
    price:    '₹2,20,000',
    tier:     'AI Optimised',
    specs:    ['Ryzen 9 7950X', 'RTX 4090', '128GB DDR5', '8TB NVMe'],
    accent:   '#cc2e25',
    glow:     'rgba(204,46,37,0.18)',
    badge:    'Pro',
  },
  {
    id:       'office',
    category: 'Office',
    icon:     Briefcase,
    name:     'Smart Office',
    tagline:  'Efficient, quiet, productivity-first',
    price:    '₹45,000',
    tier:     'Budget Smart',
    specs:    ['Ryzen 5 7600', 'Radeon RX 6600', '16GB DDR5', '1TB NVMe'],
    accent:   '#ff3b1f',
    glow:     'rgba(255,59,31,0.12)',
    badge:    'Best Value',
  },
]

/* ── Build card ─────────────────────────────────────────────── */
function BuildCard({ build, index }) {
  const { icon: Icon, category, name, tagline, price, tier, specs, accent, glow, badge } = build
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/recommended#${build.id}`}
        className="group block outline-none h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          className="relative flex flex-col h-full overflow-hidden rounded-2xl"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          whileHover={{
            borderColor: `${accent}55`,
            boxShadow:   `0 0 48px ${glow}, 0 20px 56px rgba(0,0,0,0.55)`,
            y: -5,
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top accent line — animated width on hover */}
          <motion.div
            className="absolute top-0 left-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            initial={{ width: '0%', left: '50%' }}
            animate={hovered ? { width: '100%', left: '0%' } : { width: '0%', left: '50%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Background glow on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 30% 20%, ${glow} 0%, transparent 60%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative p-5 flex flex-col gap-4 flex-1">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(255,59,31,0.09)`, border: `1px solid rgba(255,59,31,0.2)` }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <Icon size={18} style={{ color: accent }} strokeWidth={1.8} />
              </motion.div>

              <div className="flex flex-col items-end gap-1.5">
                {badge && (
                  <motion.span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: `rgba(255,59,31,0.12)`,
                      border:     `1px solid rgba(255,59,31,0.25)`,
                      color:      accent,
                      fontFamily: 'var(--font-display)',
                    }}
                    animate={hovered ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {badge}
                  </motion.span>
                )}
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border:     '1px solid var(--border)',
                    color:      'var(--text-3)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {category}
                </span>
              </div>
            </div>

            {/* Name + tagline */}
            <div>
              <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
                {name}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{tagline}</p>
            </div>

            {/* Specs — stagger reveal on hover */}
            <ul className="flex flex-col gap-2">
              {specs.map((s, i) => (
                <motion.li
                  key={s}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0.55, x: 0 }}
                  animate={hovered
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0.55, x: 0 }
                  }
                  transition={{ delay: hovered ? i * 0.06 : 0, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    animate={hovered ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                  >
                    <CheckCircle2 size={11} style={{ color: accent, flexShrink: 0 }} />
                  </motion.div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                    {s}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Performance bar — animates on hover */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  PERF SCORE
                </span>
                <span style={{ fontSize: '0.65rem', color: accent, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {build.id === 'gaming-pro' ? '92' : build.id === 'creator' ? '95' : build.id === 'ai-ml' ? '99' : '74'}
                </span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }}
                  initial={{ width: '0%' }}
                  animate={{ width: hovered
                    ? (build.id === 'gaming-pro' ? '92%' : build.id === 'creator' ? '95%' : build.id === 'ai-ml' ? '99%' : '74%')
                    : '30%'
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-3 mt-auto"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div>
                <p className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>{tier}</p>
                <p className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
                  {price}
                </p>
              </div>
              <motion.div
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
                animate={hovered ? { x: 4 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                View <ArrowRight size={13} strokeWidth={2.2} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ── Section ────────────────────────────────────────────────── */
export function RecommendedPreview() {
  return (
    <section className="relative py-20 sm:py-28" style={{ borderTop: '1px solid var(--border)' }}>
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255,59,31,0.055) 0%, transparent 70%)',
      }} />

      <div className="container-app relative">
        {/* Header */}
        <MotionSection direction="up" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 sm:mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
            >
              Curated Builds
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Built for every<br />kind of maker
            </h2>
            <p className="text-sm sm:text-base max-w-md" style={{ color: 'var(--text-2)' }}>
              Expert-configured builds across gaming, creation, AI, and productivity — all with live pricing.
            </p>
          </div>

          <Link
            href="/recommended"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors self-start sm:self-end flex-shrink-0"
            style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
          >
            View all builds
            <ArrowRight size={15} strokeWidth={2.2} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </MotionSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREVIEW_BUILDS.map((build, i) => (
            <BuildCard key={build.id} build={build} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}