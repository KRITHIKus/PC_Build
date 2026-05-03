'use client'

import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   System Interface Illustration
   Floating hardware cards + connection lines + glowing nodes
───────────────────────────────────────────────────────────── */

function float(yAmt = 8, duration = 4, delay = 0) {
  return {
    animate: { y: [-yAmt / 2, yAmt / 2, -yAmt / 2] },
    transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
  }
}

/* ── Hardware card component ─────────────────────────────────── */
function HardwareCard({ label, sublabel, icon, style, floatDelay = 0, floatAmt = 7 }) {
  const f = float(floatAmt, 4.5, floatDelay)
  return (
    <motion.div
      animate={f.animate}
      transition={f.transition}
      className="absolute flex flex-col gap-1.5 p-3 rounded-xl"
      style={{
        background:     'rgba(20,20,22,0.92)',
        border:         '1px solid rgba(255,59,31,0.22)',
        boxShadow:      '0 0 20px rgba(255,59,31,0.08), 0 8px 24px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        minWidth:       '110px',
        ...style,
      }}
    >
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,59,31,0.55),transparent)' }} />

      <div className="flex items-center gap-2">
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
            {label}
          </p>
          <p style={{ fontSize: '0.55rem', color: 'var(--text-3)', fontFamily: 'monospace' }}>
            {sublabel}
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: 'var(--red)', borderRadius: '2px' }}
          animate={{ width: ['30%', '85%', '55%', '92%', '30%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        />
      </div>
    </motion.div>
  )
}

/* ── Glowing node ────────────────────────────────────────────── */
function GlowNode({ cx, cy, delay = 0, size = 5 }) {
  return (
    <g>
      <motion.circle
        cx={cx} cy={cy} r={size * 1.8}
        fill="rgba(255,59,31,0.1)"
        animate={{ r: [size * 1.4, size * 2.6, size * 1.4], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, delay, repeat: Infinity }}
      />
      <circle cx={cx} cy={cy} r={size} fill="var(--red)" opacity="0.85" />
    </g>
  )
}

/* ── Animated trace line ─────────────────────────────────────── */
function TraceLine({ d, delay = 0, duration = 2 }) {
  return (
    <motion.path
      d={d}
      stroke="rgba(255,59,31,0.45)"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="6 10"
      animate={{ strokeDashoffset: [0, -48] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/* ── Main illustration ───────────────────────────────────────── */
export function AuthIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center select-none" style={{ minHeight: '340px' }}>

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,59,31,0.08) 0%, transparent 70%)',
        }}
      />

      {/* SVG — connection lines and nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 340"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid faint */}
        {[60,120,180,240,300,360].map(x => <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="340" stroke="rgba(255,59,31,0.04)" strokeWidth="1"/>)}
        {[60,120,180,240,300].map(y => <line key={`gy${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,59,31,0.04)" strokeWidth="1"/>)}

        {/* Static connection lines */}
        <line x1="80"  y1="100" x2="200" y2="170" stroke="rgba(255,59,31,0.12)" strokeWidth="1"/>
        <line x1="200" y1="170" x2="310" y2="110" stroke="rgba(255,59,31,0.12)" strokeWidth="1"/>
        <line x1="200" y1="170" x2="140" y2="255" stroke="rgba(255,59,31,0.12)" strokeWidth="1"/>
        <line x1="200" y1="170" x2="290" y2="250" stroke="rgba(255,59,31,0.12)" strokeWidth="1"/>
        <line x1="80"  y1="100" x2="140" y2="255" stroke="rgba(255,59,31,0.07)" strokeWidth="1" strokeDasharray="3 5"/>
        <line x1="310" y1="110" x2="290" y2="250" stroke="rgba(255,59,31,0.07)" strokeWidth="1" strokeDasharray="3 5"/>

        {/* Animated traces */}
        <TraceLine d="M80,100 L200,170"  delay={0}    duration={2.0} />
        <TraceLine d="M200,170 L310,110" delay={0.5}  duration={1.8} />
        <TraceLine d="M200,170 L140,255" delay={1.0}  duration={2.2} />
        <TraceLine d="M200,170 L290,250" delay={0.8}  duration={2.4} />

        {/* Nodes */}
        <GlowNode cx={200} cy={170} delay={0}   size={5} />
        <GlowNode cx={80}  cy={100} delay={0.4} size={3.5} />
        <GlowNode cx={310} cy={110} delay={0.8} size={3.5} />
        <GlowNode cx={140} cy={255} delay={0.6} size={3.5} />
        <GlowNode cx={290} cy={250} delay={1.0} size={3.5} />
      </svg>

      {/* Floating hardware cards */}
      <HardwareCard
        label="Ryzen 7 7800X3D"
        sublabel="CPU · 8C / 16T"
        icon="⚙️"
        style={{ top: '4%', left: '2%' }}
        floatDelay={0}
        floatAmt={9}
      />
      <HardwareCard
        label="RTX 4070 Ti"
        sublabel="GPU · 12GB GDDR6X"
        icon="🎮"
        style={{ top: '4%', right: '2%' }}
        floatDelay={0.8}
        floatAmt={7}
      />
      <HardwareCard
        label="32GB DDR5"
        sublabel="RAM · 6000MHz"
        icon="💾"
        style={{ bottom: '10%', left: '4%' }}
        floatDelay={1.4}
        floatAmt={8}
      />
      <HardwareCard
        label="2TB NVMe"
        sublabel="SSD · Gen4"
        icon="💿"
        style={{ bottom: '10%', right: '4%' }}
        floatDelay={0.5}
        floatAmt={6}
      />

      {/* Central core badge */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 20px rgba(255,59,31,0.2)', '0 0 36px rgba(255,59,31,0.4)', '0 0 20px rgba(255,59,31,0.2)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center justify-center rounded-2xl px-6 py-4 text-center"
        style={{
          background:     'rgba(14,14,16,0.95)',
          border:         '1px solid rgba(255,59,31,0.35)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-2 h-2 rounded-full mb-3"
          style={{ background: 'var(--red)', boxShadow: '0 0 8px rgba(255,59,31,0.8)' }}
        />
        <p
          className="text-xs font-bold uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
        >
          BuildLab
        </p>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontFamily: 'monospace' }}>
          SYSTEM ONLINE
        </p>
      </motion.div>

    </div>
  )
}