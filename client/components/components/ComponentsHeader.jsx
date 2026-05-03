'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

/* ── Components page header with search ──────────────────────── */
export function ComponentsHeader({ search, onSearch, totalCount }) {
  const inputRef  = useRef(null)
  const timerRef  = useRef(null)

  // Track raw input length locally to show helper text without touching parent state
  const [rawLength, setRawLength] = useState(search?.length ?? 0)
  const showHelper = rawLength > 0 && rawLength < 3

  const handleChange = (e) => {
    const val = e.target.value
    setRawLength(val.length)

    clearTimeout(timerRef.current)

    // Only fire search when empty OR at least 3 chars — never on 1–2
    if (val.length === 0) {
      // Clear immediately — no debounce needed
      onSearch('')
      return
    }

    if (val.length < 3) {
      // Do not call onSearch at all — just show helper text
      return
    }

    // 3+ chars: debounce 380ms
    timerRef.current = setTimeout(() => onSearch(val), 380)
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    setRawLength(0)
    clearTimeout(timerRef.current)
    onSearch('')
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="mb-8 sm:mb-10">
      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6"
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
        >
          Component Catalog
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Explore Components
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--text-2)' }}>
          Browse real-time priced PC parts — filtered by type, brand, and compatibility.
          {totalCount != null && (
            <span style={{ color: 'var(--text-3)' }}>
              {' '}({totalCount.toLocaleString()} results)
            </span>
          )}
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-3)' }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name, brand, or spec…"
            onChange={handleChange}
            defaultValue={search}
            className="w-full h-12 pl-11 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: 'var(--surface-2)',
              border:     '1px solid var(--border)',
              color:      'var(--text-1)',
              fontFamily: 'var(--font-display)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,59,31,0.4)'
              e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(255,59,31,0.08)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          />
          {rawLength > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-3)' }}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Helper text — only when 1 or 2 chars typed */}
        <AnimatePresence>
          {showHelper && (
            <motion.p
              key="search-helper"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)', paddingLeft: '2px' }}
            >
              Type at least 3 characters to search.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}