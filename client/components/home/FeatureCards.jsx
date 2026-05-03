'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { MotionSection } from '@/components/shared/MotionSection'

/* ─────────────────────────────────────────────────────────────
   Abstract SVG Illustrations — one per feature
───────────────────────────────────────────────────────────── */

/** Build PC — animated circuit board with data-flow trace */
function CircuitIllustration() {
  return (
    <svg viewBox="0 0 380 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Base grid traces */}
      {[60, 120, 190, 260, 320].map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="180" stroke="rgba(255,59,31,0.09)" strokeWidth="1" />
      ))}
      {[40, 95, 150].map(y => (
        <line key={y} x1="20" y1={y} x2="360" y2={y} stroke="rgba(255,59,31,0.09)" strokeWidth="1" />
      ))}

      {/* Chip body */}
      <rect x="140" y="68" width="100" height="54" rx="5" stroke="rgba(255,59,31,0.35)" strokeWidth="1.5" fill="rgba(255,59,31,0.04)" />
      {/* Chip inner grid */}
      {[158,172,186,200,214,228].map(x => (
        <line key={x} x1={x} y1="68" x2={x} y2="122" stroke="rgba(255,59,31,0.12)" strokeWidth="0.5" />
      ))}
      {[83,95,107].map(y => (
        <line key={y} x1="140" y1={y} x2="240" y2={y} stroke="rgba(255,59,31,0.12)" strokeWidth="0.5" />
      ))}

      {/* Top & bottom pins */}
      {[155,170,185,200,215,225].map(x => (
        <g key={x}>
          <line x1={x} y1="58" x2={x} y2="68" stroke="rgba(255,59,31,0.28)" strokeWidth="1.2" />
          <line x1={x} y1="122" x2={x} y2="132" stroke="rgba(255,59,31,0.28)" strokeWidth="1.2" />
          <rect x={x - 2} y="53" width="4" height="5" rx="1" fill="rgba(255,59,31,0.22)" />
          <rect x={x - 2} y="132" width="4" height="5" rx="1" fill="rgba(255,59,31,0.22)" />
        </g>
      ))}

      {/* Left & right pins */}
      {[78,90,102,110].map(y => (
        <g key={y}>
          <line x1="130" y1={y} x2="140" y2={y} stroke="rgba(255,59,31,0.28)" strokeWidth="1.2" />
          <line x1="240" y1={y} x2="250" y2={y} stroke="rgba(255,59,31,0.28)" strokeWidth="1.2" />
        </g>
      ))}

      {/* Trace paths */}
      <path d="M 60 40 L 120 40 L 120 95 L 130 95" stroke="rgba(255,59,31,0.18)" strokeWidth="1.2" fill="none" />
      <path d="M 320 150 L 260 150 L 260 110 L 250 110" stroke="rgba(255,59,31,0.14)" strokeWidth="1.2" fill="none" />
      <path d="M 60 150 L 120 150 L 190 95" stroke="rgba(255,59,31,0.12)" strokeWidth="1" fill="none" />

      {/* Animated dashed flow trace */}
      <motion.path
        d="M 20 40 L 60 40 L 120 40 L 120 95 L 130 95"
        stroke="rgba(255,59,31,0.7)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -56] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path
        d="M 360 150 L 320 150 L 260 150 L 260 110 L 250 110"
        stroke="rgba(255,100,31,0.55)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="5 7"
        animate={{ strokeDashoffset: [0, -48] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.8 }}
      />

      {/* Pulsing nodes */}
      {[
        { cx: 60,  cy: 40,  delay: 0    },
        { cx: 120, cy: 95,  delay: 0.4  },
        { cx: 190, cy: 95,  delay: 0.8  },
        { cx: 260, cy: 150, delay: 0.2  },
        { cx: 320, cy: 40,  delay: 1.0  },
      ].map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.cx} cy={n.cy} r={5} fill="rgba(255,59,31,0.12)"
            animate={{ r: [4, 8, 4], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, delay: n.delay, repeat: Infinity }}
          />
          <circle cx={n.cx} cy={n.cy} r={2.5} fill="var(--red)" />
        </g>
      ))}

      {/* Chip label */}
      <text x="190" y="99" textAnchor="middle" fill="rgba(255,59,31,0.5)" fontSize="8" fontFamily="monospace" fontWeight="bold">
        AMD
      </text>
    </svg>
  )
}

/** Recommended Builds — fanned spec cards */
function SpecCardsIllustration() {
  const cards = [
    { rotate: -8, y: 24,  opacity: 0.35, label: 'AI Workstation' },
    { rotate: -2, y: 12,  opacity: 0.65, label: 'Creator Studio' },
    { rotate:  4, y:  0,  opacity: 1.00, label: 'Gaming Pro'    },
  ]
  return (
    <svg viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
     {cards.map((card, i) => {
  // For the third card, shift elements up a bit to reduce height
  const yOffset = i === 4 ? -20 : 0; // reduces height for Gaming Pro

  return (
    <motion.g
      key={i}
      style={{ transformOrigin: '100px 200px' }}
      initial={{ rotate: card.rotate, opacity: 0, y: card.y + 20 }}
      animate={{ rotate: card.rotate, opacity: card.opacity, y: card.y }}
      transition={{ delay: i * 0.15 + 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <rect
        x="20"
        y={60 + yOffset} // move rect up
        width="160"
        height={i === 2 ? 90 : 120} // shorter height for Gaming Pro
        rx="10"
        fill="rgba(20,20,22,0.95)"
        stroke={i === 2 ? 'rgba(255,59,31,0.4)' : 'rgba(255,255,255,0.07)'}
        strokeWidth="1"
      />

      <line
        x1="20"
        y1={61 + yOffset}
        x2="180"
        y2={61 + yOffset}
        stroke={i === 2 ? 'rgba(255,59,31,0.5)' : 'rgba(255,255,255,0.08)'}
        strokeWidth="1"
      />

      <rect
        x="30"
        y={75 + yOffset}
        width="50"
        height="14"
        rx="7"
        fill={i === 2 ? 'rgba(255,59,31,0.15)' : 'rgba(255,255,255,0.05)'}
      />

      <text
        x="55"
        y={85 + yOffset}
        textAnchor="middle"
        fill={i === 2 ? 'rgba(255,59,31,0.9)' : 'rgba(255,255,255,0.3)'}
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {card.label.split(' ')[0].toUpperCase()}
      </text>

      {[104, 118, 132, 146].map((ly, j) => (
        <g key={j}>
          <rect
            x="30"
            y={ly - 4 + yOffset}
            width={j === 0 ? 90 : j === 1 ? 110 : j === 2 ? 70 : 85}
            height="5"
            rx="2.5"
            fill={i === 2 ? 'rgba(255,59,31,0.15)' : 'rgba(255,255,255,0.06)'}
          />
          {i === 2 && (
            <motion.rect
              x="30"
              y={ly - 4 + yOffset}
              width={j === 0 ? 90 : j === 1 ? 110 : j === 2 ? 70 : 85}
              height="5"
              rx="2.5"
              fill="rgba(255,59,31,0.15)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: j * 0.3, repeat: Infinity }}
            />
          )}
        </g>
      ))}

      {i === 2 && (
        <text
          x="150"
          y={86 + yOffset}
          textAnchor="end"
          fill="rgba(255,59,31,0.9)"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          ₹1.4L
        </text>
      )}
    </motion.g>
  )
})}
    </svg>
  )
}

/** Compare Builds — two bar charts with VS divider */
function CompareIllustration() {
  const bars = [
    { x: 20, heights: [90, 55, 70, 40] },
    { x: 95, heights: [60, 80, 50, 85] },
  ]
  const barW = 14
  return (
    <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {bars.map((group, gi) => (
        <g key={gi}>
          {group.heights.map((h, bi) => {
            const bx = group.x + bi * (barW + 6)
            return (
              <g key={bi}>
                <rect x={bx} y={120 - h} width={barW} height={h} rx="3"
                  fill={gi === 0 ? 'rgba(255,59,31,0.12)' : 'rgba(255,80,50,0.08)'}
                />
                <motion.rect x={bx} y={120 - h} width={barW} height={h} rx="3"
                  fill={gi === 0 ? 'rgba(255,59,31,0.5)' : 'rgba(255,100,31,0.4)'}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${bx + barW / 2}px 120px` }}
                  transition={{ delay: bi * 0.1 + gi * 0.2 + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>
            )
          })}
          {/* Group label */}
          <text x={group.x + 39} y="135" textAnchor="middle"
            fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace"
          >
            {gi === 0 ? 'BUILD A' : 'BUILD B'}
          </text>
        </g>
      ))}

      {/* VS divider */}
      <line x1="90" y1="10" x2="90" y2="125" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 4" />
      <text x="90" y="70" textAnchor="middle" fill="rgba(255,59,31,0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">
        VS
      </text>

      {/* Winner indicator */}
      <motion.circle cx="157" cy="40" r="3" fill="rgba(255,59,31,0.8)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </svg>
  )
}

/** Learn Hardware — CPU die top-down with glowing sectors */
function LearnIllustration() {
  const sectors = [
    [0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],
  ]
  const highlighted = [[0,1],[1,0],[1,2],[2,1]]

  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Die outline */}
      <rect x="50" y="10" width="100" height="100" rx="6" stroke="rgba(255,59,31,0.35)" strokeWidth="1.5" fill="rgba(255,59,31,0.03)" />

      {/* Internal sectors 3×3 grid */}
      {[0,1,2].map(row => [0,1,2].map(col => {
        const gx = 56 + col * 32
        const gy = 16 + row * 30
        const isHi = highlighted.some(([r,c]) => r === row && c === col)
        const isCenter = row === 1 && col === 1
        return (
          <g key={`${row}-${col}`}>
            <rect x={gx} y={gy} width={28} height={28} rx="3"
              fill={isCenter ? 'rgba(255,59,31,0.14)' : isHi ? 'rgba(255,59,31,0.07)' : 'rgba(255,255,255,0.02)'}
              stroke={isCenter ? 'rgba(255,59,31,0.4)' : isHi ? 'rgba(255,59,31,0.2)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="1"
            />
            {isHi && (
              <motion.rect x={gx} y={gy} width={28} height={28} rx="3"
                fill="rgba(255,59,31,0.08)"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2 + col * 0.4, delay: row * 0.3, repeat: Infinity }}
              />
            )}
            {isCenter && (
              <text x={gx + 14} y={gy + 17} textAnchor="middle" fill="rgba(255,59,31,0.7)"
                fontSize="7" fontFamily="monospace" fontWeight="bold"
              >
                CORE
              </text>
            )}
          </g>
        )
      }))}

      {/* Pins on edges */}
      {[62, 78, 94, 110, 126].map(px => (
        <g key={px}>
          <rect x={px - 2} y="5" width="4" height="5" rx="1" fill="rgba(255,59,31,0.2)" />
          <rect x={px - 2} y="105" width="4" height="5" rx="1" fill="rgba(255,59,31,0.2)" />
        </g>
      ))}
      {[27, 46, 65, 84, 100].map(py => (
        <g key={py}>
          <rect x="45" y={py - 2} width="5" height="4" rx="1" fill="rgba(255,59,31,0.2)" />
          <rect x="150" y={py - 2} width="5" height="4" rx="1" fill="rgba(255,59,31,0.2)" />
        </g>
      ))}
    </svg>
  )
}
/** PC History — branching timeline */
function HistoryIllustration() {
  const milestones = [
    { x: 20,  y: 50, year: '\'81',  active: false },
    { x: 65,  y: 50, year: '\'93',  active: false },
    { x: 110, y: 50, year: '\'06',  active: false },
    { x: 155, y: 50, year: '\'17',  active: false },
    { x: 190, y: 50, year: 'Now',   active: true  },
  ];

  return (
    <svg viewBox="0 0 210 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main timeline */}
      <motion.line x1="20" y1="50" x2="190" y2="50"
        stroke="rgba(255,59,31,0.25)" strokeWidth="1.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={{ transformOrigin: '20px 50px' }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Animated fill */}
      <motion.line x1="20" y1="50" x2="190" y2="50"
        stroke="rgba(255,59,31,0.6)" strokeWidth="1.5" strokeDasharray="170"
        animate={{ strokeDashoffset: [170, 0] }}
        transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Branch lines */}
      <line x1="65" y1="50" x2="65" y2="20" stroke="rgba(255,59,31,0.15)" strokeWidth="1" />
      <line x1="155" y1="50" x2="155" y2="20" stroke="rgba(255,59,31,0.15)" strokeWidth="1" />
      {/* Branch labels */}
      <text x="65" y="14" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="20" fontFamily="monospace">Pentium</text>
      <text x="155" y="14" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="20" fontFamily="monospace">Ryzen</text>

      {/* Milestone dots */}
      {milestones.map((m, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {m.active && (
            <motion.circle cx={m.x} cy={m.y} r={9} fill="rgba(255,59,31,0.15)"
              animate={{ r: [7, 12, 7], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}
          <circle cx={m.x} cy={m.y} r={m.active ? 5 : 3.5}
            fill={m.active ? 'var(--red)' : 'rgba(255,59,31,0.35)'}
            stroke={m.active ? 'rgba(255,59,31,0.5)' : 'none'}
            strokeWidth="1"
          />
          <text x={m.x} y={m.y + 18} textAnchor="middle"
            fill={m.active ? 'rgba(255,59,31,0.8)' : 'rgba(255,255,255,0.25)'}
            fontSize={m.active ? 11 : 10} fontFamily="monospace" fontWeight={m.active ? 'bold' : 'normal'}
          >
            {m.year}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature data
───────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    illustration: CircuitIllustration,
    label:   'Build Your PC',
    subtext: 'Pick compatible parts, check pricing live, and configure your perfect build from scratch.',
    href:    '/build-lab',
    accent:  '#ff3b1f',
    size:    'large-wide',
  },
  {
    illustration: SpecCardsIllustration,
    label:   'Recommended Builds',
    subtext: 'Curated expert builds for gaming, creation, and AI workloads — ready to explore.',
    href:    '/recommended',
    accent:  '#ff6b1f',
    size:    'large-tall',
  },
  {
    illustration: CompareIllustration,
    label:   'Compare Builds',
    subtext: 'Side-by-side comparison of components and builds to find your best fit.',
    href:    '/compare',
    accent:  '#ff3b1f',
    size:    'small',
  },
  {
    illustration: LearnIllustration,
    label:   'Learn Hardware',
    subtext: 'Deep-dive guides on CPUs, GPUs, RAM, storage, and everything in between.',
    href:    '/learn',
    accent:  '#e11d2e',
    size:    'small',
  },
  {
    illustration: HistoryIllustration,
    label:   'PC History',
    subtext: 'Explore the evolution of personal computing from the first chips to today.',
    href:    '/history',
    accent:  '#ff3b1f',
    size:    'small',
  },
]

/* ─────────────────────────────────────────────────────────────
   3D Tilt Card
───────────────────────────────────────────────────────────── */
function TiltCard({ children, href, size, index }) {
  const ref      = useRef(null)
  const rawX     = useMotionValue(0)
  const rawY     = useMotionValue(0)
  const rotateX  = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]),  { stiffness: 160, damping: 22 })
  const rotateY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-7, 7]), { stiffness: 160, damping: 22 })
  const glowX    = useTransform(rawX, [-0.5, 0.5], ['0%', '100%'])
  const glowY    = useTransform(rawY, [-0.5, 0.5], ['0%', '100%'])

  const handleMove = useCallback((e) => {
    if (!ref.current) return
    const r  = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width  - 0.5)
    rawY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [rawX, rawY])

  const handleLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  const isWide = size === 'large-wide'
  const isTall = size === 'large-tall'

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        gridColumn: isWide ? '1 / 3' : isTall ? '3 / 4' : undefined,
        gridRow:    (isWide || isTall) ? '1 / 3' : undefined,
        perspective: '1000px',
      }}
    >
      <Link href={href} className="group block outline-none h-full">
        <motion.div
          className="relative h-full flex flex-col overflow-hidden rounded-2xl"
          style={{
            background:   'var(--surface-2)',
            border:       '1px solid var(--border)',
            minHeight:    isWide ? '200px' : isTall ? '420px' : '190px',
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{
            borderColor: 'rgba(255,59,31,0.38)',
            boxShadow:   '0 0 40px rgba(255,59,31,0.12), 0 20px 60px rgba(0,0,0,0.55)',
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Cursor-tracked inner glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([gx, gy]) =>
                  `radial-gradient(280px circle at ${gx} ${gy}, rgba(255,59,31,0.12) 0%, transparent 70%)`
              ),
            }}
          />

          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.6), transparent)' }}
          />

          {/* Illustration area */}
          <div
            className={`relative flex-shrink-0 overflow-hidden ${isWide ? 'h-[140px]' : isTall ? 'flex-1 min-h-[220px]' : 'h-[100px]'}`}
            style={{
              background: 'rgba(0,0,0,0.25)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {/* Feature-specific illustration is rendered by parent */}
            </div>
          </div>

          {/* Text content */}
          <div className={`flex flex-col ${isWide ? 'flex-row items-center' : 'flex-col'} p-5 gap-3 flex-1`}>
            <div className="flex-1">
              <h3 className="font-semibold mb-1.5 transition-colors duration-200"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', fontSize: isWide ? '1.1rem' : '0.95rem' }}
              >
                {/* label rendered by parent */}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {/* subtext rendered by parent */}
              </p>
            </div>

            <motion.div
              className="flex items-center gap-1.5 self-start flex-shrink-0"
              style={{ color: 'var(--red)' }}
              initial={{ x: 0, opacity: 0.45 }}
              whileHover={{ x: 5, opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Explore</span>
              <ArrowRight size={13} strokeWidth={2.3} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Feature Card — desktop bento cell
───────────────────────────────────────────────────────────── */
function BentoCard({ feature, index }) {
  const { illustration: Illustration, label, subtext, href, size } = feature

  const ref      = useRef(null)
  const rawX     = useMotionValue(0)
  const rawY     = useMotionValue(0)
  const rotateX  = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]),  { stiffness: 160, damping: 22 })
  const rotateY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 160, damping: 22 })
  const glowX    = useTransform(rawX, [-0.5, 0.5], ['0%', '100%'])
  const glowY    = useTransform(rawY, [-0.5, 0.5], ['0%', '100%'])

  const handleMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width  - 0.5)
    rawY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [rawX, rawY])

  const handleLeave = useCallback(() => { rawX.set(0); rawY.set(0) }, [rawX, rawY])

  const isWide = size === 'large-wide'
  const isTall = size === 'large-tall'

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        gridColumn:  isWide ? '1 / 3' : isTall ? '3 / 4' : undefined,
        gridRow:     (isWide || isTall) ? '1 / 3' : undefined,
        perspective: '1000px',
      }}
    >
      <Link href={href} className="group block outline-none h-full">
        <motion.div
          className={`relative h-full overflow-hidden rounded-2xl flex ${isWide ? 'flex-row' : 'flex-col'}`}
          style={{
            background:      'var(--surface-2)',
            border:          '1px solid var(--border)',
            minHeight:       isWide ? '210px' : isTall ? '420px' : '195px',
            rotateX,
            rotateY,
            transformStyle:  'preserve-3d',
          }}
          whileHover={{
            borderColor: 'rgba(255,59,31,0.35)',
            boxShadow:   '0 0 40px rgba(255,59,31,0.10), 0 20px 56px rgba(0,0,0,0.5)',
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Dynamic inner glow following cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-350"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([gx, gy]) =>
                  `radial-gradient(260px circle at ${gx} ${gy}, rgba(255,59,31,0.1) 0%, transparent 72%)`
              ),
            }}
          />

          {/* Top accent flash on hover */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.7), transparent)' }}
          />

          {/* Illustration panel */}
          <div
            className={`relative flex-shrink-0 flex items-center justify-center overflow-hidden
              ${isWide
                ? 'w-[52%] border-r'
                : isTall
                  ? 'h-[55%] border-b'
                  : 'h-[105px] border-b'
              }`}
            style={{
              background:   'rgba(0,0,0,0.22)',
              borderColor:  'rgba(255,255,255,0.04)',
            }}
          >
            <div className={`
              ${isWide ? 'w-full h-full p-6' : isTall ? 'w-4/5 h-4/5' : 'w-4/5 h-full py-3'}
            `}>
              <Illustration />
            </div>
          </div>

          {/* Text panel */}
          <div className={`flex flex-col justify-between flex-1 ${isWide ? 'p-7' : 'p-5'}`}>
            <div>
              <h3
                className="font-semibold mb-2 leading-snug"
                style={{
                  fontFamily: 'var(--font-display)',
                  color:      'var(--text-1)',
                  fontSize:   isWide ? '1.15rem' : '0.95rem',
                }}
              >
                {label}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-2)', fontSize: isWide ? '0.875rem' : '0.82rem' }}
              >
                {subtext}
              </p>
            </div>

            <motion.div
              className="flex items-center gap-1.5 mt-4 self-start"
              style={{ color: 'var(--red)' }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.17 }}
            >
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                Explore
              </span>
              <ArrowRight size={12} strokeWidth={2.3} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Mobile scroll card
───────────────────────────────────────────────────────────── */
function MobileCard({ feature }) {
  const { illustration: Illustration, label, subtext, href } = feature
  return (
    <Link href={href} className="block outline-none h-full snap-start flex-shrink-0" style={{ width: '82vw', maxWidth: '320px' }}>
      <div
        className="relative flex flex-col h-full ml-3 overflow-hidden rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', minHeight: '330px' }}
      >
        <div className="aspect-[1/1] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.22)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="w-full h-full p-3"><Illustration /></div>
        </div>
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-semibold mb-1.5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)', fontSize: '0.92rem' }}
            >{label}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{subtext}</p>
          </div>
          <div className="flex items-center gap-1 mt-3" style={{ color: 'var(--red)' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Explore</span>
            <ArrowRight size={11} strokeWidth={2.3} />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─────────────────────────────────────────────────────────────
   Feature Cards Section
   FIXED: Dynamic carousel on mobile with:
   - Active dot tracks current slide via scroll event
   - Clicking a dot scrolls to that card
   - Auto-advances every 3s, pauses on user touch
   - Dots update in real time as user swipes
───────────────────────────────────────────────────────────── */
export function FeatureCards() {
  const trackRef        = useRef(null)
  const autoRef         = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const isPausedRef     = useRef(false)
  const TOTAL           = FEATURES.length

  /* ── Track scroll → update active dot ── */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const onScroll = () => {
      const scrollLeft  = el.scrollLeft
      const cardWidth   = el.scrollWidth / TOTAL
      const idx         = Math.round(scrollLeft / cardWidth)
      setActiveIdx(Math.min(Math.max(idx, 0), TOTAL - 1))
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Auto-advance every 3s ── */
  useEffect(() => {
    const start = () => {
      autoRef.current = setInterval(() => {
        if (isPausedRef.current || !trackRef.current) return
        setActiveIdx((prev) => {
          const next = (prev + 1) % TOTAL
          scrollToIndex(next)
          return next
        })
      }, 3000)
    }
    start()
    return () => clearInterval(autoRef.current)
  }, [])

  /* ── Pause auto-advance on touch ── */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const pause  = () => { isPausedRef.current = true }
    const resume = () => {
      setTimeout(() => { isPausedRef.current = false }, 2500)
    }
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend',   resume, { passive: true })
    return () => {
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend',   resume)
    }
  }, [])

  /* ── Scroll carousel to a specific index ── */
  const scrollToIndex = (idx) => {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / TOTAL
    el.scrollTo({ left: cardWidth * idx, behavior: 'smooth' })
  }

  const handleDotClick = (idx) => {
    isPausedRef.current = true
    setActiveIdx(idx)
    scrollToIndex(idx)
    setTimeout(() => { isPausedRef.current = false }, 3000)
  }

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-app">

        {/* Section header */}
        <MotionSection direction="up" className="mb-12 sm:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
          >
            Everything You Need
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            One platform for<br />every builder
          </h2>
          <p className="text-sm sm:text-base max-w-md" style={{ color: 'var(--text-2)' }}>
            From first-time builders to seasoned enthusiasts — find components, compare builds, and learn hardware all in one place.
          </p>
        </MotionSection>

        {/* ── Mobile: auto-sliding carousel with dynamic dots ── */}
        <div className="sm:hidden -mx-4">
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto px-4 pb-4"
            style={{
              scrollSnapType:            'x mandatory',
              WebkitOverflowScrolling:   'touch',
              scrollbarWidth:            'none',
              msOverflowStyle:           'none',
            }}
          >
            {FEATURES.map((f) => (
              <MobileCard key={f.href} feature={f} />
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden />
          </div>

          {/* Dynamic dots — click navigates, active dot is wider + red */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300 rounded-full flex-shrink-0 cursor-pointer"
                style={{
                  width:      i === activeIdx ? '22px' : '7px',
                  height:     '7px',
                  background: i === activeIdx ? 'var(--red)' : 'rgba(255,255,255,0.18)',
                  border:     'none',
                  padding:    0,
                  outline:    'none',
                  boxShadow:  i === activeIdx ? '0 0 8px rgba(255,59,31,0.55)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop: bento grid ── */}
        <div
          className="hidden sm:grid gap-4"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto auto' }}
        >
          {FEATURES.map((f, i) => <BentoCard key={f.href} feature={f} index={i} />)}
        </div>

      </div>
    </section>
  )
}