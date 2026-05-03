'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

export const BUILD_FILTER_OPTIONS = [
  { label: 'All',     value: 'all'     },
  { label: 'Gaming',  value: 'gaming'  },
  { label: 'Creator', value: 'creator' },
  { label: 'AI / ML', value: 'ai'      },
  { label: 'Office',  value: 'office'  },
  { label: 'Dream',   value: 'dream'   },
]

export function BuildFilters({ active, onChange }) {
  const trackRef = useRef(null)

  return (
    <div className="relative">
      {/* Fade edges on mobile */}
      <div
        className="sm:hidden absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg), transparent)' }}
      />
      <div
        className="sm:hidden absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg), transparent)' }}
      />

      <div
        ref={trackRef}
        className="flex items-center gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {BUILD_FILTER_OPTIONS.map((opt) => {
          const isActive = active === opt.value
          return (
            <motion.button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              whileHover={!isActive ? { scale: 1.04, y: -1 } : {}}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
              style={{
                background:  isActive ? 'rgba(255,59,31,0.15)' : 'rgba(255,255,255,0.04)',
                border:      isActive ? '1px solid rgba(255,59,31,0.45)' : '1px solid rgba(255,255,255,0.08)',
                color:       isActive ? 'var(--red)' : 'var(--text-2)',
                fontFamily:  'var(--font-display)',
                boxShadow:   isActive ? '0 0 16px rgba(255,59,31,0.2)' : 'none',
              }}
            >
              {opt.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}