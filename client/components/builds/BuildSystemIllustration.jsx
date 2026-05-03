'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   BuildSystemIllustration
   Meaningful hardware block diagram — CPU, GPU, RAM, Storage
   with animated signal lines and scanning glow effect.
───────────────────────────────────────────────────────────── */

/* ── Block component ─────────────────────────────────────────── */
function SystemBlock({ x, y, width, height, label, sublabel, accent = false, delay = 0 }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer glow */}
      {accent && (
        <motion.rect
          x={x - 3} y={y - 3}
          width={width + 6} height={height + 6}
          rx="7"
          fill="none"
          stroke="rgba(255,59,31,0.25)"
          strokeWidth="1"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      )}

      {/* Block body */}
      <rect
        x={x} y={y}
        width={width} height={height}
        rx="5"
        fill={accent ? 'rgba(255,59,31,0.08)' : 'rgba(255,255,255,0.03)'}
        stroke={accent ? 'rgba(255,59,31,0.45)' : 'rgba(255,255,255,0.1)'}
        strokeWidth="1"
      />

      {/* Inner grid lines */}
      {Array.from({ length: 3 }, (_, i) => (
        <line
          key={i}
          x1={x + 6} y1={y + 14 + i * 8}
          x2={x + width - 6} y2={y + 14 + i * 8}
          stroke={accent ? 'rgba(255,59,31,0.1)' : 'rgba(255,255,255,0.04)'}
          strokeWidth="0.7"
        />
      ))}

      {/* Top accent line */}
      <line
        x1={x + 10} y1={y}
        x2={x + width - 10} y2={y}
        stroke={accent ? 'rgba(255,59,31,0.6)' : 'rgba(255,255,255,0.15)'}
        strokeWidth="1.5"
      />

      {/* Label */}
      <text
        x={x + width / 2} y={y + 16}
        textAnchor="middle"
        fill={accent ? 'rgba(255,59,31,0.9)' : 'rgba(255,255,255,0.6)'}
        fontSize="8"
        fontWeight="700"
        fontFamily="var(--font-display), monospace"
        letterSpacing="0.08em"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + width / 2} y={y + 27}
          textAnchor="middle"
          fill="rgba(255,255,255,0.25)"
          fontSize="6"
          fontFamily="monospace"
        >
          {sublabel}
        </text>
      )}

      {/* Corner dots */}
      {[[x+4, y+4], [x+width-4, y+4]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5"
          fill={accent ? 'rgba(255,59,31,0.5)' : 'rgba(255,255,255,0.12)'} />
      ))}
    </motion.g>
  )
}

/* ── Animated signal packet traveling a path ─────────────────── */
function SignalPacket({ path, delay = 0, duration = 2, color = 'rgba(255,59,31,0.8)' }) {
  return (
    <motion.circle r="2.5" fill={color}
      style={{ filter: 'drop-shadow(0 0 4px rgba(255,59,31,0.9))' }}
    >
      <animateMotion
        path={path}
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        calcMode="linear"
      />
    </motion.circle>
  )
}

/* ── Glow node ───────────────────────────────────────────────── */
function GlowNode({ cx, cy, delay = 0 }) {
  return (
    <g>
      <motion.circle cx={cx} cy={cy} r={5}
        fill="rgba(255,59,31,0.12)"
        animate={{ r: [4, 9, 4], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, delay, repeat: Infinity }}
      />
      <circle cx={cx} cy={cy} r={2.5} fill="var(--red)" opacity="0.9" />
    </g>
  )
}

/* ── Scanning line effect ─────────────────────────────────────── */
function ScanLine() {
  return (
    <motion.rect
      x="0" y="0" width="480" height="2" rx="1"
      fill="rgba(255,59,31,0.18)"
      style={{ filter: 'blur(1px)' }}
      animate={{ y: [20, 240, 20] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/* ── Main illustration ───────────────────────────────────────── */
export function BuildSystemIllustration({ parts = {} }) {
  const hasCpu  = !!parts.cpu
  const hasGpu  = !!parts.gpu
  const hasRam  = !!parts.ram
  const hasStor = !!(parts.storage?.length)

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: '16/9', maxHeight: '280px' }}>
      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,59,31,0.07) 0%, transparent 70%)' }} />

      <svg
        viewBox="0 0 480 260"
        width="100%" height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Clip mask for scan line */}
        <defs>
          <clipPath id="board-clip">
            <rect x="0" y="10" width="480" height="245" />
          </clipPath>
          {/* Radial fade for bg grid */}
          <radialGradient id="grid-fade" cx="50%" cy="50%" r="55%">
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="grid-mask">
            <rect width="480" height="260" fill="url(#grid-fade)" />
          </mask>
        </defs>

        {/* Faint background grid */}
        <g mask="url(#grid-mask)" opacity="0.4">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`gx${i}`} x1={i * 53} y1="0" x2={i * 53} y2="260"
              stroke="rgba(255,59,31,0.06)" strokeWidth="1" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`gy${i}`} x1="0" y1={i * 52} x2="480" y2={i * 52}
              stroke="rgba(255,59,31,0.06)" strokeWidth="1" />
          ))}
        </g>

        {/* Scanning line */}
        <g clipPath="url(#board-clip)">
          <ScanLine />
        </g>

        {/* ── Static connection lines ──────────────────────── */}
        {/* CPU → center bus */}
        <line x1="130" y1="72" x2="220" y2="130" stroke="rgba(255,59,31,0.15)" strokeWidth="1" />
        {/* GPU → center bus */}
        <line x1="350" y1="72" x2="260" y2="130" stroke="rgba(255,59,31,0.15)" strokeWidth="1" />
        {/* RAM → center bus */}
        <line x1="60"  y1="180" x2="220" y2="155" stroke="rgba(255,59,31,0.12)" strokeWidth="1" />
        {/* Storage → center bus */}
        <line x1="420" y1="180" x2="260" y2="155" stroke="rgba(255,59,31,0.12)" strokeWidth="1" />

        {/* ── Animated signal lines ────────────────────────── */}
        <motion.path d="M 130,72 L 220,130" stroke="rgba(255,59,31,0.4)" strokeWidth="1"
          strokeDasharray="5 8" fill="none"
          animate={{ strokeDashoffset: [0, -52] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
        <motion.path d="M 350,72 L 260,130" stroke="rgba(255,59,31,0.35)" strokeWidth="1"
          strokeDasharray="5 8" fill="none"
          animate={{ strokeDashoffset: [0, -52] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', delay: 0.5 }} />
        <motion.path d="M 60,180 L 220,155" stroke="rgba(255,59,31,0.3)" strokeWidth="1"
          strokeDasharray="4 8" fill="none"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.8 }} />
        <motion.path d="M 420,180 L 260,155" stroke="rgba(255,59,31,0.3)" strokeWidth="1"
          strokeDasharray="4 8" fill="none"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'linear', delay: 1.1 }} />

        {/* ── Signal packets ───────────────────────────────── */}
        <SignalPacket path="M 130,72 L 240,143" delay={0}   duration={1.8} />
        <SignalPacket path="M 350,72 L 240,143" delay={0.6} duration={2.0} />
        <SignalPacket path="M 60,180 L 240,143" delay={1.2} duration={2.2} color="rgba(255,100,31,0.8)" />
        <SignalPacket path="M 420,180 L 240,143" delay={0.9} duration={1.9} color="rgba(255,100,31,0.8)" />

        {/* ── Hardware blocks ──────────────────────────────── */}
        {/* CPU */}
        <SystemBlock x={70} y={20} width={120} height={52} label="CPU" sublabel={hasCpu ? parts.cpu.brand ?? '' : ''} accent delay={0.1} />

        {/* GPU */}
        <SystemBlock x={290} y={20} width={120} height={52} label="GPU" sublabel={hasGpu ? parts.gpu.brand ?? '' : ''} accent={false} delay={0.2} />

        {/* Center bus */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <rect x={200} y={120} width={80} height={40} rx="5"
            fill="rgba(255,59,31,0.12)" stroke="rgba(255,59,31,0.5)" strokeWidth="1.2" />
          <line x1="210" y1="120" x2="270" y2="120" stroke="rgba(255,59,31,0.7)" strokeWidth="1.5" />
          <text x="240" y="135" textAnchor="middle"
            fill="rgba(255,59,31,0.9)" fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="0.06em">
            SYSTEM BUS
          </text>
          <text x="240" y="147" textAnchor="middle"
            fill="rgba(255,59,31,0.45)" fontSize="5.5" fontFamily="monospace">
            PCIe Gen5
          </text>
          <motion.circle cx="240" cy="140" r="3" fill="var(--red)" opacity="0.9"
            animate={{ opacity: [0.9, 0.3, 0.9] }} transition={{ duration: 1.4, repeat: Infinity }} />
        </motion.g>

        {/* RAM */}
        <SystemBlock x={10} y={165} width={100} height={48} label="RAM" sublabel={hasRam ? parts.ram.name?.split(' ')[0] ?? '' : ''} accent={false} delay={0.3} />

        {/* Storage */}
        <SystemBlock x={370} y={165} width={100} height={48} label="STORAGE" sublabel={hasStor ? 'NVMe' : ''} accent={false} delay={0.35} />

        {/* ── Glow nodes at junctions ─────────────────────── */}
        <GlowNode cx={130} cy={72}  delay={0}   />
        <GlowNode cx={350} cy={72}  delay={0.5} />
        <GlowNode cx={60}  cy={180} delay={1.0} />
        <GlowNode cx={420} cy={180} delay={0.7} />

        {/* Pin indicators on CPU block */}
        {[84,96,108,120,132,144,156,168].map((px, i) => (
          <g key={i}>
            <rect x={px} y={15} width="4" height="5" rx="1" fill="rgba(255,59,31,0.22)" />
            <rect x={px} y={72} width="4" height="5" rx="1" fill="rgba(255,59,31,0.22)" />
          </g>
        ))}
      </svg>
    </div>
  )
}