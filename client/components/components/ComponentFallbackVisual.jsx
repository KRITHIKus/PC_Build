'use client'

import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   Type-specific SVG illustrations
   Used when component.imageUrl is absent
───────────────────────────────────────────────────────────── */

function CpuVisual() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Chip body */}
      <rect x="30" y="30" width="60" height="60" rx="4" stroke="rgba(255,59,31,0.45)" strokeWidth="1.5" fill="rgba(255,59,31,0.06)" />
      {/* Inner die */}
      <rect x="40" y="40" width="40" height="40" rx="2" stroke="rgba(255,59,31,0.25)" strokeWidth="1" fill="rgba(255,59,31,0.04)" />
      {/* Inner grid */}
      {[47,54,61,68,75].map(x => <line key={`cx${x}`} x1={x} y1="40" x2={x} y2="80" stroke="rgba(255,59,31,0.1)" strokeWidth="0.5"/>)}
      {[47,54,61,68,75].map(y => <line key={`cy${y}`} x1="40" y1={y} x2="80" y2={y} stroke="rgba(255,59,31,0.1)" strokeWidth="0.5"/>)}
      {/* Top/bottom pins */}
      {[38,46,54,62,70,78].map(x => (
        <g key={`tp${x}`}>
          <line x1={x} y1="22" x2={x} y2="30" stroke="rgba(255,59,31,0.3)" strokeWidth="1.2"/>
          <line x1={x} y1="90" x2={x} y2="98" stroke="rgba(255,59,31,0.3)" strokeWidth="1.2"/>
        </g>
      ))}
      {/* Left/right pins */}
      {[38,46,54,62,70,78].map(y => (
        <g key={`lp${y}`}>
          <line x1="22" y1={y} x2="30" y2={y} stroke="rgba(255,59,31,0.3)" strokeWidth="1.2"/>
          <line x1="90" y1={y} x2="98" y2={y} stroke="rgba(255,59,31,0.3)" strokeWidth="1.2"/>
        </g>
      ))}
      {/* Pulsing center */}
      <motion.circle cx="60" cy="60" r="6" fill="rgba(255,59,31,0.15)"
        animate={{ r: [5, 9, 5], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <circle cx="60" cy="60" r="3" fill="var(--red)" opacity="0.8"/>
      <text x="60" y="19" textAnchor="middle" fill="rgba(255,59,31,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">CPU</text>
    </svg>
  )
}

function GpuVisual() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Card PCB */}
      <rect x="10" y="25" width="140" height="55" rx="4" stroke="rgba(255,59,31,0.4)" strokeWidth="1.5" fill="rgba(255,59,31,0.05)" />
      {/* Heatsink fins */}
      {[18,26,34,42,50,58].map(x => (
        <rect key={x} x={x} y="30" width="5" height="20" rx="1" fill="rgba(255,59,31,0.1)" stroke="rgba(255,59,31,0.2)" strokeWidth="0.5"/>
      ))}
      {/* Fan circle */}
      <circle cx="38" cy="52" r="16" stroke="rgba(255,59,31,0.25)" strokeWidth="1" fill="rgba(255,59,31,0.04)"/>
      <motion.g style={{ transformOrigin: '38px 52px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {[0,60,120,180,240,300].map(deg => {
          const r = deg * Math.PI / 180
          return <path key={deg} d={`M38,52 L${38+12*Math.cos(r)},${52+12*Math.sin(r)}`}
            stroke="rgba(255,59,31,0.35)" strokeWidth="2.5" strokeLinecap="round"/>
        })}
      </motion.g>
      <circle cx="38" cy="52" r="3" fill="rgba(255,59,31,0.5)"/>
      {/* GPU chip */}
      <rect x="78" y="38" width="28" height="24" rx="2" stroke="rgba(255,59,31,0.4)" strokeWidth="1" fill="rgba(255,59,31,0.08)"/>
      {/* PCIe connector */}
      <rect x="18" y="73" width="124" height="5" rx="1" fill="rgba(255,59,31,0.08)" stroke="rgba(255,59,31,0.2)" strokeWidth="0.5"/>
      {[24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120,126,132].map(x=>(
        <rect key={x} x={x} y="74" width="2" height="3" rx="0.5" fill="rgba(255,59,31,0.2)"/>
      ))}
      <text x="80" y="22" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">GPU</text>
    </svg>
  )
}

function RamVisual() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* PCB stick */}
      <rect x="10" y="20" width="100" height="40" rx="2" stroke="rgba(255,59,31,0.4)" strokeWidth="1.5" fill="rgba(255,59,31,0.05)"/>
      {/* Notch */}
      <rect x="52" y="55" width="6" height="5" rx="0.5" fill="var(--surface-1)"/>
      {/* Chips row */}
      {[15,27,39,51,63,75,87,99].map(x=>(
        <rect key={x} x={x} y="24" width="9" height="14" rx="1" fill="rgba(255,59,31,0.08)" stroke="rgba(255,59,31,0.22)" strokeWidth="0.8"/>
      ))}
      {/* Bottom edge connector pins */}
      {Array.from({length:18}, (_,i)=>(
        <rect key={i} x={12+i*5} y="56" width="2.5" height="3" rx="0.5" fill="rgba(255,59,31,0.25)"/>
      ))}
      {/* Animated data flow */}
      <motion.rect x="10" y="20" width="4" height="40" rx="1"
        fill="rgba(255,59,31,0.18)"
        animate={{ x: [10, 106, 10] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <text x="60" y="15" textAnchor="middle" fill="rgba(255,59,31,0.45)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">RAM</text>
    </svg>
  )
}

function MotherboardVisual() {
  return (
    <svg viewBox="0 0 130 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="8" width="114" height="104" rx="3" stroke="rgba(255,59,31,0.35)" strokeWidth="1.5" fill="rgba(255,59,31,0.03)"/>
      {/* PCIe slots */}
      {[30,45,60,75].map(y=>(
        <rect key={y} x="20" y={y} width="50" height="7" rx="1" fill="rgba(255,59,31,0.07)" stroke="rgba(255,59,31,0.2)" strokeWidth="0.8"/>
      ))}
      {/* CPU socket */}
      <rect x="80" y="20" width="34" height="34" rx="2" stroke="rgba(255,59,31,0.4)" strokeWidth="1.2" fill="rgba(255,59,31,0.06)"/>
      <rect x="86" y="26" width="22" height="22" rx="1" stroke="rgba(255,59,31,0.2)" strokeWidth="0.8" fill="none"/>
      {/* RAM slots */}
      {[20,28,36,44].map(x=>(
        <rect key={x} x={x+70} y="64" width="5" height="30" rx="1" fill="rgba(255,59,31,0.07)" stroke="rgba(255,59,31,0.18)" strokeWidth="0.7"/>
      ))}
      {/* Traces */}
      <motion.path d="M70,37 L80,37" stroke="rgba(255,59,31,0.6)" strokeWidth="1" fill="none"
        strokeDasharray="4 4" animate={{ strokeDashoffset: [0,-16] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path d="M70,55 L80,55" stroke="rgba(255,59,31,0.5)" strokeWidth="1" fill="none"
        strokeDasharray="4 4" animate={{ strokeDashoffset: [0,-16] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: 0.3 }}
      />
      <text x="97" y="37" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5" fontFamily="monospace" fontWeight="bold">CPU</text>
      <text x="65" y="6" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">MOBO</text>
    </svg>
  )
}

function StorageVisual() {
  return (
    <svg viewBox="0 0 130 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* SSD body */}
      <rect x="10" y="15" width="110" height="50" rx="4" stroke="rgba(255,59,31,0.4)" strokeWidth="1.5" fill="rgba(255,59,31,0.05)"/>
      {/* NAND chips */}
      {[20,44,68].map(x=>(
        <rect key={x} x={x} y="22" width="20" height="16" rx="2" fill="rgba(255,59,31,0.09)" stroke="rgba(255,59,31,0.22)" strokeWidth="0.8"/>
      ))}
      {/* Controller */}
      <rect x="95" y="20" width="16" height="20" rx="2" fill="rgba(255,59,31,0.12)" stroke="rgba(255,59,31,0.35)" strokeWidth="1"/>
      {/* M.2 connector teeth */}
      {Array.from({length:14},(_,i)=>(
        <rect key={i} x={16+i*6} y="57" width="3" height="5" rx="0.5" fill="rgba(255,59,31,0.22)"/>
      ))}
      {/* Activity LED pulse */}
      <motion.circle cx="108" cy="53" r="3" fill="var(--red)" opacity="0.7"
        animate={{ opacity: [0.7, 0.15, 0.7] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <text x="65" y="13" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">NVMe SSD</text>
    </svg>
  )
}

function PsuVisual() {
  return (
    <svg viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* PSU body */}
      <rect x="10" y="10" width="90" height="80" rx="4" stroke="rgba(255,59,31,0.4)" strokeWidth="1.5" fill="rgba(255,59,31,0.05)"/>
      {/* Fan grille circle */}
      <circle cx="55" cy="50" r="28" stroke="rgba(255,59,31,0.2)" strokeWidth="1" fill="none"/>
      <circle cx="55" cy="50" r="18" stroke="rgba(255,59,31,0.15)" strokeWidth="0.8" fill="none"/>
      {/* Grille lines */}
      {[0,30,60,90,120,150].map(deg=>{
        const r=deg*Math.PI/180
        const x1=55+28*Math.cos(r), y1=50+28*Math.sin(r)
        const x2=55-28*Math.cos(r), y2=50-28*Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,59,31,0.1)" strokeWidth="0.7"/>
      })}
      {/* Rotating fan */}
      <motion.g style={{transformOrigin:'55px 50px'}}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {[0,90,180,270].map(deg=>{
          const r=deg*Math.PI/180
          return <path key={deg}
            d={`M55,50 Q${55+14*Math.cos(r-0.4)},${50+14*Math.sin(r-0.4)} ${55+18*Math.cos(r)},${50+18*Math.sin(r)}`}
            stroke="rgba(255,59,31,0.45)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        })}
      </motion.g>
      <circle cx="55" cy="50" r="4" fill="rgba(255,59,31,0.25)" stroke="rgba(255,59,31,0.5)" strokeWidth="1"/>
      {/* Connectors right side */}
      {[20,32,44,56,68].map(y=>(
        <rect key={y} x="96" y={y} width="4" height="6" rx="1" fill="rgba(255,59,31,0.18)"/>
      ))}
      <text x="55" y="8" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">PSU</text>
    </svg>
  )
}

function CaseVisual() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Tower body */}
      <rect x="15" y="8" width="50" height="104" rx="4" stroke="rgba(255,59,31,0.4)" strokeWidth="1.5" fill="rgba(255,59,31,0.05)"/>
      {/* Front panel */}
      <rect x="20" y="15" width="40" height="90" rx="2" stroke="rgba(255,59,31,0.15)" strokeWidth="0.8" fill="rgba(255,59,31,0.03)"/>
      {/* Power button */}
      <circle cx="40" cy="22" r="4" stroke="rgba(255,59,31,0.5)" strokeWidth="1.2" fill="none"/>
      <motion.circle cx="40" cy="22" r="2" fill="var(--red)" opacity="0.8"
        animate={{ opacity: [0.8, 0.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Drive bays */}
      {[35,45,55].map(y=>(
        <rect key={y} x="25" y={y} width="30" height="6" rx="1" fill="rgba(255,59,31,0.07)" stroke="rgba(255,59,31,0.15)" strokeWidth="0.7"/>
      ))}
      {/* Mesh/vent area */}
      {[70,75,80,85,90].map(y=>(
        <line key={y} x1="25" y1={y} x2="55" y2={y} stroke="rgba(255,59,31,0.12)" strokeWidth="1"/>
      ))}
      {/* Feet */}
      <rect x="18" y="108" width="8" height="4" rx="2" fill="rgba(255,59,31,0.2)"/>
      <rect x="54" y="108" width="8" height="4" rx="2" fill="rgba(255,59,31,0.2)"/>
      <text x="40" y="6" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">CASE</text>
    </svg>
  )
}

function CoolingVisual() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Heatsink base */}
      <rect x="25" y="70" width="60" height="10" rx="2" fill="rgba(255,59,31,0.1)" stroke="rgba(255,59,31,0.3)" strokeWidth="1.2"/>
      {/* Fins */}
      {[28,35,42,49,56,63,70,77].map(x=>(
        <rect key={x} x={x} y="35" width="4" height="35" rx="1" fill="rgba(255,59,31,0.08)" stroke="rgba(255,59,31,0.2)" strokeWidth="0.7"/>
      ))}
      {/* Fan frame */}
      <rect x="18" y="8" width="74" height="68" rx="6" stroke="rgba(255,59,31,0.3)" strokeWidth="1.2" fill="rgba(255,59,31,0.04)"/>
      {/* Fan circle */}
      <circle cx="55" cy="42" r="26" stroke="rgba(255,59,31,0.2)" strokeWidth="1" fill="none"/>
      {/* Spinning blades */}
      <motion.g style={{transformOrigin:'55px 42px'}}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      >
        {[0,51.4,102.8,154.2,205.7,257.1,308.5].map(deg=>{
          const r=deg*Math.PI/180
          return <path key={deg}
            d={`M55,42 Q${55+16*Math.cos(r-0.3)},${42+16*Math.sin(r-0.3)} ${55+22*Math.cos(r)},${42+22*Math.sin(r)}`}
            stroke="rgba(255,59,31,0.4)" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
        })}
      </motion.g>
      <circle cx="55" cy="42" r="5" fill="rgba(255,59,31,0.2)" stroke="rgba(255,59,31,0.45)" strokeWidth="1"/>
      {/* Corner screws */}
      {[[24,14],[86,14],[24,66],[86,66]].map(([x,y])=>(
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" stroke="rgba(255,59,31,0.2)" strokeWidth="0.8" fill="rgba(255,59,31,0.05)"/>
      ))}
      <text x="55" y="103" textAnchor="middle" fill="rgba(255,59,31,0.4)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">COOLING</text>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Type → Visual map
───────────────────────────────────────────────────────────── */
const VISUAL_MAP = {
  'CPU':          CpuVisual,
  'GPU':          GpuVisual,
  'RAM':          RamVisual,
  'Motherboard':  MotherboardVisual,
  'Storage':      StorageVisual,
  'PSU':          PsuVisual,
  'Case':         CaseVisual,
  'Cabinet':      CaseVisual,
  'Cooling':      CoolingVisual,
}

/**
 * ComponentFallbackVisual
 * Props:
 *   type      — component type string
 *   className — optional wrapper class
 *   size      — 'sm' | 'md' | 'lg'  (controls wrapper size)
 */
export function ComponentFallbackVisual({ type = '', className = '', size = 'md' }) {
  const Visual = VISUAL_MAP[type] || CpuVisual

  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-full h-full',
  }[size] || 'w-24 h-24'

  return (
    <div
      className={`flex items-center justify-center ${sizeClass} ${className}`}
      aria-label={`${type} component illustration`}
    >
      <Visual />
    </div>
  )
}