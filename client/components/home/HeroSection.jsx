'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Cursor-tracked background spotlight
───────────────────────────────────────────────────────────── */
function CursorSpotlight() {
  const x  = useMotionValue(50)
  const y  = useMotionValue(50)
  const sx = useSpring(x, { stiffness: 50, damping: 20 })
  const sy = useSpring(y, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const move = (e) => {
      x.set((e.clientX / window.innerWidth)  * 100)
      y.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: useTransform(
          [sx, sy],
          ([cx, cy]) =>
            `radial-gradient(700px circle at ${cx}% ${cy}%, rgba(255,59,31,0.08) 0%, transparent 65%)`
        ),
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   Magnetic button
───────────────────────────────────────────────────────────── */
function MagneticButton({ href, label, variant = 'primary', icon: Icon }) {
  const btnRef  = useRef(null)
  const shimRef = useRef(null)
  const mx      = useMotionValue(0)
  const my      = useMotionValue(0)
  const sx      = useSpring(mx, { stiffness: 220, damping: 18 })
  const sy      = useSpring(my, { stiffness: 220, damping: 18 })

  const handleMove = useCallback((e) => {
    if (!btnRef.current) return
    const r  = btnRef.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width  / 2)) * 0.28)
    my.set((e.clientY - (r.top  + r.height / 2)) * 0.28)
  }, [mx, my])

  const handleLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  const handleEnter = () => {
    if (variant !== 'primary' || !shimRef.current) return
    shimRef.current.style.animation = 'none'
    void shimRef.current.offsetWidth
    shimRef.current.style.animation = 'shimmer 0.7s ease forwards'
  }

  const isPrimary = variant === 'primary'

  return (
    <motion.a
      ref={btnRef}
      href={href}
      
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      whileHover={isPrimary
        ? { scale: 1.04, boxShadow: '0 0 36px rgba(255,59,31,0.6), 0 0 80px rgba(255,59,31,0.2)' }
        : { scale: 1.03, borderColor: 'rgba(255,255,255,0.22)' }
      }
      whileTap={{ scale: 0.96 }}
      /* Mobile: full width. sm+: auto width side-by-side */
      className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer select-none"
      style={{
        x: sx, y: sy,
        height:         '50px',
        paddingLeft:    '28px',
        paddingRight:   '28px',
        borderRadius:   '14px',
        fontFamily:     'var(--font-display)',
        fontWeight:     600,
        fontSize:       '0.9rem',
        letterSpacing:  '0.01em',
        textDecoration: 'none',
        ...(isPrimary
          ? {
              background: 'linear-gradient(135deg, #ff4d33 0%, #ff3b1f 55%, #e11d2e 100%)',
              border:     '1px solid rgba(255,59,31,0.45)',
              color:      '#fff',
              boxShadow:  '0 4px 20px rgba(255,59,31,0.35)',
            }
          : {
              background:     'rgba(255,255,255,0.04)',
              border:         '1px solid rgba(255,255,255,0.12)',
              color:          'var(--text-1)',
              backdropFilter: 'blur(8px)',
            }),
      }}
    >
      {isPrimary && (
        <span
          ref={shimRef}
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.22) 50%,transparent 100%)',
            transform:  'translateX(-100%) skewX(-12deg)',
          }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {Icon && (
        <motion.span
          className="relative z-10 flex items-center flex-shrink-0"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.14 }}
        >
          <Icon size={16} strokeWidth={2.3} />
        </motion.span>
      )}
    </motion.a>
  )
}

/* ─────────────────────────────────────────────────────────────
   Word-by-word headline with clip reveal
───────────────────────────────────────────────────────────── */
function AnimatedHeadline({ line1, line2, accent }) {
  const words1 = line1.split(' ')
  const words2 = line2.split(' ')
  const wv = {
    hidden:  { y: '110%', opacity: 0, skewY: 3 },
    visible: (i) => ({
      y: '0%', opacity: 1, skewY: 0,
      transition: { delay: i * 0.075 + 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    }),
  }
  return (
    <div>
      <div className="flex flex-wrap gap-x-3 sm:gap-x-4 mb-1 sm:mb-2">
        {words1.map((w, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.span
              custom={i} variants={wv} initial="hidden" animate="visible"
              className="block"
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    800,
                fontSize:      'clamp(2.6rem, 7vw, 5.4rem)',
                lineHeight:    1.0,
                letterSpacing: '-0.03em',
                color:         'var(--text-1)',
              }}
            >{w}</motion.span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 sm:gap-x-4">
        {words2.map((w, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.span
              custom={words1.length + i} variants={wv} initial="hidden" animate="visible"
              className="block"
              style={{
                fontFamily:    'var(--font-display)',
                fontWeight:    800,
                fontSize:      'clamp(2.6rem, 7vw, 5.4rem)',
                lineHeight:    1.0,
                letterSpacing: '-0.03em',
                color:         w === accent ? 'var(--red)' : 'var(--text-1)',
                textShadow:    w === accent ? '0 0 48px rgba(255,59,31,0.45)' : 'none',
              }}
            >{w}</motion.span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Animated stat counter
───────────────────────────────────────────────────────────── */
function AnimatedStat({ value, label, delay = 0 }) {
  const isNumeric  = !isNaN(parseInt(value))
  const numericVal = parseInt(value) || 0
  const suffix     = isNumeric ? value.replace(/[0-9]/g, '') : ''
  const count      = useMotionValue(0)
  const display    = useTransform(count, (v) => Math.round(v) + suffix)

  useEffect(() => {
    const t = setTimeout(() => {
      if (isNumeric) animate(count, numericVal, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    }, (delay + 1.2) * 1000)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-5 py-3 rounded-2xl"
      style={{
        background:     'rgba(255,255,255,0.035)',
        border:         '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--red)', lineHeight: 1 }}>
        {isNumeric ? <motion.span>{display}</motion.span> : value}
      </span>
      <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: '4px', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Live Build Mockup
───────────────────────────────────────────────────────────── */
const BUILD_PARTS = [
  { slot: 'CPU', name: 'Ryzen 7 7800X3D',   price: 32000 },
  { slot: 'GPU', name: 'RTX 4070 Ti Super', price: 68000 },
  { slot: 'RAM', name: '32GB DDR5-6000',    price: 11000 },
  { slot: 'SSD', name: '2TB NVMe Gen4',     price:  8500 },
  { slot: 'PSU', name: '850W Gold Modular', price:  7500 },
]

function LiveBuildMockup() {
  const [visible, setVisible]     = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const priceVal                  = useMotionValue(0)
  const displayPrice              = useTransform(priceVal, (v) =>
    '₹' + Math.round(v).toLocaleString('en-IN')
  )

  useEffect(() => {
    const timers = BUILD_PARTS.map((_, i) =>
      setTimeout(() => {
        setVisible(i + 1)
        const total = BUILD_PARTS.slice(0, i + 1).reduce((s, p) => s + p.price, 0)
        animate(priceVal, total, { duration: 0.7, ease: 'easeOut' })
      }, 1000 + i * 650)
    )
    const tb = setTimeout(() => setShowBadge(true), 1000 + BUILD_PARTS.length * 650 + 300)
    return () => { timers.forEach(clearTimeout); clearTimeout(tb) }
  }, []) // eslint-disable-line

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      <div className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{ boxShadow: '0 0 60px rgba(255,59,31,0.1), 0 32px 80px rgba(0,0,0,0.6)' }}
      />
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(22,22,26,0.98) 0%, rgba(12,12,14,0.98) 100%)',
          border:     '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.6), transparent)' }} />
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: 'var(--red)', boxShadow: '0 0 6px rgba(255,59,31,0.8)' }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-1)' }}>
              Gaming Pro Build
            </span>
          </div>
          <motion.span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--red)', flexShrink: 0 }}>
            {displayPrice}
          </motion.span>
        </div>
        <div className="px-5 py-3 flex flex-col gap-1">
          {BUILD_PARTS.map((part, i) => (
            <motion.div
              key={part.slot}
              initial={{ opacity: 0, x: -12 }}
              animate={visible > i ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between py-2.5 gap-4"
              style={{ borderBottom: i < BUILD_PARTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider tabular-nums px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-3)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    minWidth: '36px', textAlign: 'center',
                  }}
                >
                  {part.slot}
                </span>
                <span className="truncate" style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                  {part.name}
                </span>
              </div>
              <span className="flex-shrink-0" style={{ fontSize: '0.78rem', color: 'var(--text-1)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                ₹{part.price.toLocaleString('en-IN')}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="px-5 pb-4 pt-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={showBadge ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckCircle2 size={13} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#22c55e', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              All parts compatible · Ships together
            </span>
          </motion.div>
        </div>
      </div>
      {[
        { top: -4, left: -4, bt: true, bl: true },
        { top: -4, right: -4, bt: true, br: true },
        { bottom: -4, left: -4, bb: true, bl: true },
        { bottom: -4, right: -4, bb: true, br: true },
      ].map((c, i) => (
        <div key={i} className="absolute w-5 h-5 pointer-events-none" style={{
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          borderTopWidth:    c.bt ? '1.5px' : 0,
          borderBottomWidth: c.bb ? '1.5px' : 0,
          borderLeftWidth:   c.bl ? '1.5px' : 0,
          borderRightWidth:  c.br ? '1.5px' : 0,
          borderStyle: 'solid', borderColor: 'rgba(255,59,31,0.5)',
          borderRadius: c.bt && c.bl ? '4px 0 0 0' : c.bt && c.br ? '0 4px 0 0'
            : c.bb && c.bl ? '0 0 0 4px' : '0 0 4px 0',
        }} />
      ))}
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,59,31,0.12) 0%, transparent 70%)', filter: 'blur(16px)' }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex items-start"
      style={{
        minHeight:  '100dvh',
        /* Content starts exactly at navbar bottom, not centered vertically */
        
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 55% at 50% 0%, rgba(255,59,31,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 85% 55%, rgba(180,20,20,0.07) 0%, transparent 60%)
        `,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      <CursorSpotlight />

      <div className="container-app w-full pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — copy */}
          <div className="flex flex-col">

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 self-start"
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
                style={{
                  background: 'rgba(255,59,31,0.09)',
                  border:     '1px solid rgba(255,59,31,0.22)',
                  color:      'var(--red)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                <Zap size={10} fill="currentColor" />
                Premium PC Builder
              </span>
            </motion.div>

            <div className="mb-5">
              <AnimatedHeadline line1="Configure Your" line2="Perfect Machine" accent="Machine" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-7 max-w-md text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--text-2)' }}
            >
              Browse real-time priced components, check compatibility instantly, and save your ideal build — all in one platform.
            </motion.p>

            {/*
              FIXED MOBILE BUTTONS:
              - flex-col on mobile so they stack vertically
              - w-full on mobile so each fills the row
              - sm:flex-row sm:w-auto for desktop side-by-side
            */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.88, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-9"
            >
              <MagneticButton href="/build-lab"   label="Start Building"     variant="primary"   icon={ArrowRight} />
              <MagneticButton href="/recommended" label="Recommended Builds" variant="secondary" />
            </motion.div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <AnimatedStat value="500+" label="Components"     delay={0}    />
              <AnimatedStat value="50+"  label="Build Configs"  delay={0.07} />
              <AnimatedStat value="Live" label="Price Tracking" delay={0.14} />
            </div>
          </div>

          {/* Right — desktop mockup */}
          <div className="hidden lg:block">
            <LiveBuildMockup />
          </div>
        </div>

        {/* Mobile mockup below CTA */}
        <div className="lg:hidden mt-8">
          <LiveBuildMockup />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, var(--bg) 0%, transparent 100%)' }}
      />
    </section>
  )
}