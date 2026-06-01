'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/* ── Count-up hook ─────────────────────────────────────────────── */
function useCountUp(end, duration = 1100, trigger = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger || !end) return
    let t0 = null
    const tick = (ts) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(eased * end))
      if (p < 1) requestAnimationFrame(tick)
      else setVal(end)
    }
    requestAnimationFrame(tick)
  }, [trigger, end, duration])
  return val
}

/* ── SVG hardware icons ────────────────────────────────────────── */
function IconCpu() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="10" height="10" rx="1" strokeWidth="1.2" />
      <rect x="5.5" y="5.5" width="5" height="5" rx="0.4" strokeWidth="0.85" opacity="0.5" />
      <line x1="6"  y1="1"  x2="6"  y2="3"  strokeWidth="1.2" />
      <line x1="10" y1="1"  x2="10" y2="3"  strokeWidth="1.2" />
      <line x1="6"  y1="13" x2="6"  y2="15" strokeWidth="1.2" />
      <line x1="10" y1="13" x2="10" y2="15" strokeWidth="1.2" />
      <line x1="1"  y1="6"  x2="3"  y2="6"  strokeWidth="1.2" />
      <line x1="1"  y1="10" x2="3"  y2="10" strokeWidth="1.2" />
      <line x1="13" y1="6"  x2="15" y2="6"  strokeWidth="1.2" />
      <line x1="13" y1="10" x2="15" y2="10" strokeWidth="1.2" />
    </svg>
  )
}

function IconGpu() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="14" height="7" rx="1" strokeWidth="1.2" />
      <rect x="3"   y="7" width="3"   height="3" rx="0.5" strokeWidth="0.85" opacity="0.5" />
      <rect x="8"   y="7" width="3"   height="3" rx="0.5" strokeWidth="0.85" opacity="0.5" />
      <line x1="4"   y1="3" x2="4"   y2="5" strokeWidth="1.2" />
      <line x1="7.5" y1="3" x2="7.5" y2="5" strokeWidth="1.2" />
      <line x1="11"  y1="3" x2="11"  y2="5" strokeWidth="1.2" />
    </svg>
  )
}

function IconRam() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="14" height="7" rx="0.5" strokeWidth="1.2" />
      <rect x="3"  y="7" width="1.6" height="3" rx="0.3" strokeWidth="0.85" opacity="0.5" />
      <rect x="6"  y="7" width="1.6" height="3" rx="0.3" strokeWidth="0.85" opacity="0.5" />
      <rect x="9"  y="7" width="1.6" height="3" rx="0.3" strokeWidth="0.85" opacity="0.5" />
      <rect x="12" y="7" width="1.6" height="3" rx="0.3" strokeWidth="0.85" opacity="0.5" />
      <line x1="4"  y1="3" x2="4"  y2="5" strokeWidth="1" />
      <line x1="7"  y1="3" x2="7"  y2="5" strokeWidth="1" />
      <line x1="10" y1="3" x2="10" y2="5" strokeWidth="1" />
    </svg>
  )
}

function IconSsd() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="14" height="10" rx="1" strokeWidth="1.2" />
      <rect x="3" y="6" width="6.5" height="4"  rx="0.5" strokeWidth="0.85" opacity="0.5" />
      <circle cx="12.5" cy="8" r="1.2" strokeWidth="0.85" opacity="0.5" />
    </svg>
  )
}

/* ── Trace separator ────────────────────────────────────────────── */
function TraceSeparator() {
  const wrapRef = useRef()
  const [w, setW] = useState(300)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const measure = () => { if (wrapRef.current) setW(wrapRef.current.offsetWidth) }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        margin: '4px 0',
        overflow: 'hidden',
      }}
    >
      {/* Track line */}
      <div style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.25) 15%, rgba(255,59,31,0.25) 85%, transparent)',
      }} />

      {/* Left node */}
      <div style={{
        position: 'absolute', left: 0, top: '50%',
        transform: 'translateY(-50%)',
        width: '5px', height: '5px', borderRadius: '50%',
        background: 'rgba(255,59,31,0.5)',
        boxShadow: '0 0 6px rgba(255,59,31,0.6)',
      }} />

      {/* Right node */}
      <div style={{
        position: 'absolute', right: 0, top: '50%',
        transform: 'translateY(-50%)',
        width: '5px', height: '5px', borderRadius: '50%',
        background: 'rgba(255,59,31,0.5)',
        boxShadow: '0 0 6px rgba(255,59,31,0.6)',
      }} />

      {/* Traveling pulse */}
      {!shouldReduce && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%', marginTop: '-4px', left: 0,
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#ff3b1f',
            boxShadow: '0 0 10px rgba(255,59,31,1), 0 0 20px rgba(255,59,31,0.4)',
          }}
          animate={{ x: [0, w - 8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
        />
      )}

      {/* Trailing glow */}
      {!shouldReduce && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%', marginTop: '-1px', left: 0,
            height: '2px', borderRadius: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.5))',
            pointerEvents: 'none',
          }}
          animate={{ width: [0, w * 0.35], opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
        />
      )}
    </div>
  )
}

/* ── Metric card ────────────────────────────────────────────────── */
function MetricCard({ label, value, suffix = '', delay = 0 }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const isNum  = typeof value === 'number'
  const count  = useCountUp(isNum ? value : 0, 1100, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'relative',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '12px 14px',
        overflow: 'hidden',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {/* Top gradient accent */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.45), transparent)',
      }} />

      {/* Bottom ambient glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '40px',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(255,59,31,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <p style={{
        fontSize: '9px',
        color: 'var(--text-3)',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {label}
      </p>

      <p style={{
        fontSize: '1.45rem',
        fontWeight: 700,
        color: 'var(--text-1)',
        fontFamily: 'var(--font-display)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        margin: 0,
      }}>
        {isNum ? `${count}${suffix}` : value}
      </p>

      {/* Active dot */}
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, delay }}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '5px', height: '5px', borderRadius: '50%',
          background: 'var(--red)',
          boxShadow: '0 0 6px rgba(255,59,31,0.7)',
        }}
      />
    </motion.div>
  )
}

/* ── Spec row ───────────────────────────────────────────────────── */
function SpecRow({ Icon, label, sublabel, percent, delay, isLast, inView }) {
  return (
    <div style={{
      paddingBottom: isLast ? 0 : '12px',
      marginBottom: isLast ? 0 : '12px',
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Row header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '7px',
      }}>
        {/* Icon container */}
        <span style={{
          color: 'var(--red)',
          opacity: 0.8,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px', height: '24px',
          background: 'rgba(255,59,31,0.08)',
          borderRadius: '4px',
          border: '1px solid rgba(255,59,31,0.15)',
        }}>
          <Icon />
        </span>

        {/* Label */}
        <span style={{
          fontSize: '11.5px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          color: 'var(--text-1)',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>
          {label}
        </span>

        {/* Sub-label + percentage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'monospace',
            color: 'var(--text-3)',
            letterSpacing: '0.06em',
          }}>
            {sublabel}
          </span>
          <span style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            color: 'rgba(255,59,31,0.8)',
            fontWeight: 700,
            minWidth: '28px',
            textAlign: 'right',
          }}>
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div style={{
        height: '3px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          style={{
            height: '100%',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #ff3b1f, rgba(255,59,31,0.45))',
            position: 'relative',
          }}
          initial={{ width: '0%' }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{ duration: 0.85, delay, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Shimmer on bar */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={inView ? { backgroundPosition: ['-200% 0', '300% 0'] } : {}}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      </div>
    </div>
  )
}

/* ── Specs data ─────────────────────────────────────────────────── */
const SPECS = [
  { Icon: IconCpu, label: 'Ryzen 7 7800X3D', sublabel: 'CPU · 8C/16T', percent: 92, delay: 0.36 },
  { Icon: IconGpu, label: 'RTX 4070 Ti',     sublabel: 'GPU · 12GB',   percent: 88, delay: 0.48 },
  { Icon: IconRam, label: '32GB DDR5-6000',  sublabel: 'RAM',           percent: 75, delay: 0.60 },
  { Icon: IconSsd, label: '2TB NVMe Gen4',   sublabel: 'Storage',       percent: 62, delay: 0.72 },
]

/* ── Build card ─────────────────────────────────────────────────── */
function BuildCard({ inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2, duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'relative',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient corner bloom */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '120px', height: '120px',
        background: 'radial-gradient(circle at top right, rgba(255,59,31,0.06), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--text-2)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Build Configuration
        </span>

        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '8.5px',
            fontFamily: 'monospace',
            color: 'var(--red)',
            padding: '3px 8px',
            border: '1px solid rgba(255,59,31,0.3)',
            borderRadius: '3px',
            letterSpacing: '0.12em',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'var(--red)',
            boxShadow: '0 0 5px rgba(255,59,31,0.8)',
          }} />
          LIVE
        </motion.span>
      </div>

      {/* Spec rows */}
      {SPECS.map((s, i) => (
        <SpecRow key={s.label} {...s} isLast={i === SPECS.length - 1} inView={inView} />
      ))}

      {/* Corner circuit trace */}
      <svg
        style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', opacity: 0.07 }}
        width="80" height="60" viewBox="0 0 80 60" fill="none"
      >
        <line x1="0"  y1="20" x2="50" y2="20" stroke="#ff3b1f" strokeWidth="1" />
        <line x1="50" y1="20" x2="50" y2="60" stroke="#ff3b1f" strokeWidth="1" />
        <line x1="22" y1="36" x2="80" y2="36" stroke="#ff3b1f" strokeWidth="1" />
        <line x1="22" y1="36" x2="22" y2="60" stroke="#ff3b1f" strokeWidth="1" />
        <circle cx="50" cy="20" r="2.5" fill="#ff3b1f" />
        <circle cx="22" cy="36" r="2.5" fill="#ff3b1f" />
      </svg>
    </motion.div>
  )
}

/* ── Main export ─────────────────────────────────────────────────── */
export function AuthIllustration() {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <>
      <div ref={ref} className="auth-illustration">

        {/* Metric strip */}
        <div className="metric-strip">
          <MetricCard label="Compatibility" value={98} suffix="%" delay={0.00} />
          <MetricCard label="Components"   value={8}          delay={0.08} />
          <MetricCard label="Perf. Tier"   value="HIGH"       delay={0.16} />
        </div>

        {/* Animated trace separator */}
        <TraceSeparator />

        {/* Build spec card */}
        <BuildCard inView={inView} />

      </div>

      <style jsx>{`
  .auth-illustration {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
  }

  /* Metric strip: 3 equal columns on desktop */
  .metric-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 100%;
  }

  /* Ensure all cards fit container */
  .metric-strip > div {
    width: 100%;
    box-sizing: border-box;
  }

  /* Build card full width */
  .auth-illustration .build-card {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }

  /* ── Mobile (≤ 480px) ─────────────────────────────────── */
  @media (max-width: 480px) {
    .metric-strip {
      grid-template-columns: repeat(2, 1fr); /* 2 columns for small screens */
      gap: 6px;
    }

    .auth-illustration .build-card {
      padding: 12px;
    }
  }

  /* ── Very small screens (≤ 360px) ─────────────────────── */
  @media (max-width: 360px) {
    .metric-strip {
      grid-template-columns: 1fr; /* single column on tiny screens */
      gap: 6px;
    }

    .auth-illustration p,
    .auth-illustration span {
      font-size: 0.85rem; /* scale down text */
    }
  }
`}</style>
    </>
  )
}