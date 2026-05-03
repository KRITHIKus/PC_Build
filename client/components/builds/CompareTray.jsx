'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X } from 'lucide-react'

export function CompareTray({ selected = [], onClear }) {
  const count   = selected.length
  const canComp = count >= 2
  const visible = count > 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="compare-tray"
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        >
          {/* Blur background */}
          <div
            style={{
              background:     'rgba(10,10,12,0.88)',
              borderTop:      '1px solid rgba(255,59,31,0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow:      '0 -4px 40px rgba(255,59,31,0.1), 0 -1px 0 rgba(255,59,31,0.2)',
            }}
          >
            <div className="container-app py-4 flex  flex-col sm:flex-row sm:items-center gap-4">

              {/* Count badge + label */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,59,31,0.15)', border: '1px solid rgba(255,59,31,0.3)' }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
                  >
                    {count}
                  </span>
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
                  >
                    {count === 1 ? '1 build selected' : `${count} builds selected`}
                  </p>
                  {!canComp && (
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                      Select at least 2 builds to compare
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                {/* Clear */}
                <button
                  type="button"
                  onClick={onClear}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border:     '1px solid rgba(255,255,255,0.1)',
                    color:      'var(--text-2)',
                  }}
                  aria-label="Clear selection"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,59,31,0.3)'; e.currentTarget.style.color = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <X size={16} />
                </button>

                {/* Compare CTA */}
                <motion.button
                  type="button"
                  disabled={!canComp}
                  whileHover={canComp ? { scale: 1.03, boxShadow: '0 0 24px rgba(255,59,31,0.5)' } : {}}
                  whileTap={canComp ? { scale: 0.97 } : {}}
className="flex items-center justify-center gap-2 px-5 h-10 w-full sm:w-auto rounded-xl text-sm font-semibold transition-all duration-150"                  style={{
                    background: canComp
                      ? 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)'
                      : 'rgba(255,59,31,0.2)',
                    color:      canComp ? '#fff' : 'rgba(255,59,31,0.4)',
                    fontFamily: 'var(--font-display)',
                    cursor:     canComp ? 'pointer' : 'not-allowed',
                    border:     'none',
                  }}
                >
                  <GitCompare size={15} strokeWidth={2.2} />
                  Compare Builds
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}