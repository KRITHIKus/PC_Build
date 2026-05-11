'use client'

import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   SystemLoader — PC assembly style loading indicator
   Shows CPU → GPU → RAM → Storage blocks with signal animation
───────────────────────────────────────────────────────────── */

const BLOCKS = [
  { label: 'CPU',  x: 40,  delay: 0    },
  { label: 'GPU',  x: 120, delay: 0.25 },
  { label: 'RAM',  x: 200, delay: 0.5  },
  { label: 'SSD',  x: 280, delay: 0.75 },
]

function Block({ label, x, delay }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <rect
        x={x} y={18} width={56} height={32} rx="4"
        fill="rgba(255,59,31,0.07)"
        stroke="rgba(255,59,31,0.35)"
        strokeWidth="1"
      />
      {/* Top accent */}
      <line x1={x + 10} y1={18} x2={x + 46} y2={18}
        stroke="rgba(255,59,31,0.55)" strokeWidth="1.5" />
      {/* Inner lines */}
      <line x1={x + 8} y1={28} x2={x + 48} y2={28}
        stroke="rgba(255,59,31,0.1)" strokeWidth="0.7" />
      <line x1={x + 8} y1={35} x2={x + 48} y2={35}
        stroke="rgba(255,59,31,0.1)" strokeWidth="0.7" />
      <text
        x={x + 28} y={32}
        textAnchor="middle"
        fill="rgba(255,59,31,0.8)"
        fontSize="8"
        fontWeight="700"
        fontFamily="monospace"
        letterSpacing="0.06em"
      >
        {label}
      </text>
      {/* Pulsing dot */}
      <motion.circle
        cx={x + 48} cy={20} r={2}
        fill="var(--red)"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, delay, repeat: Infinity }}
      />
    </motion.g>
  )
}

export function SystemLoader({
  title    = 'Comparing builds…',
  subtitle = 'Checking price, parts, and compatibility',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">

      {/* SVG diagram */}
      <div className="mb-8" style={{ width: '360px', maxWidth: '90vw' }}>
        <svg viewBox="0 0 360 70" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* Connecting baseline */}
          <line x1="68" y1="52" x2="292" y2="52"
            stroke="rgba(255,59,31,0.15)" strokeWidth="1" />

          {/* Animated signal line */}
          <motion.line
            x1="68" y1="52" x2="68" y2="52"
            stroke="rgba(255,59,31,0.55)"
            strokeWidth="1.5"
            animate={{ x2: [68, 292] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
          />

          {/* Signal packet */}
          <motion.circle r="3" fill="var(--red)"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,59,31,0.9))' }}
          >
            <animateMotion
              path="M 68,52 L 292,52"
              dur="1.6s"
              begin="0s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </motion.circle>

          {/* Connector pins */}
          {[68, 148, 228, 292].map((cx, i) => (
            <g key={i}>
              <line x1={cx} y1={50} x2={cx} y2={52}
                stroke="rgba(255,59,31,0.3)" strokeWidth="1" />
              <motion.circle
                cx={cx} cy={52} r={3}
                fill="var(--red)" opacity={0.7}
                animate={{ opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
              />
            </g>
          ))}

          {/* Hardware blocks */}
          {BLOCKS.map(b => <Block key={b.label} {...b} />)}

        </svg>
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="text-lg font-bold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
      >
        {title}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="text-sm"
        style={{ color: 'var(--text-3)' }}
      >
        {subtitle}
      </motion.p>

    </div>
  )
}