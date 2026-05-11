'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X, Check } from 'lucide-react'
import { useGetComponentsQuery } from '@/services/admin/componentsApi'

const triggerStyle = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  fontFamily: 'var(--font-display)',
}

const searchInputStyle = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text-1)',
  fontFamily: 'var(--font-display)',
}

export default function ComponentSelector({
  value,
  onChange,
  region,
  placeholder = 'Search and select a component…',
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState(null)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const { data: response } = useGetComponentsQuery({ page: 1, limit: 200 })
  const all = response?.data || []

  const filtered = search.trim()
    ? all.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.brand?.toLowerCase().includes(search.toLowerCase()) ||
          c.type?.toLowerCase().includes(search.toLowerCase())
      )
    : all

  const selected = value ?? null

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const handleSelect = (comp) => {
    onChange(comp)
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange(null)
    setSearch('')
  }

  return (
    <div ref={wrapRef} className="relative w-full">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 h-11 px-3 rounded-xl text-left"
        style={triggerStyle}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-1)' }}
            >
              {selected.name}
            </span>
            {selected.brand && (
              <span
                className="text-xs flex-shrink-0"
                style={{ color: 'var(--text-3)' }}
              >
                {selected.brand}
              </span>
            )}
            {selected.type && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-3)',
                }}
              >
                {selected.type}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-3)' }}>
            {placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center w-5 h-5 rounded"
              style={{ color: 'var(--text-3)', cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-3)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
            }}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl shadow-2xl"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-3)' }}
              />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand, type…"
                className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
                style={searchInputStyle}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div
                className="px-4 py-5 text-center text-xs"
                style={{ color: 'var(--text-3)' }}
              >
                No components found
              </div>
            )}

            {filtered.map((comp, i) => {
              const isSelected = selected?._id === comp._id
              const isHovered = hoveredId === comp._id
              const isZeroPrice = !comp.price || Number(comp.price) === 0

              return (
                <div
                  key={comp._id}
                  onClick={() => handleSelect(comp)}
                  onMouseEnter={() => setHoveredId(comp._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer gap-3"
                  style={{
                    background: isSelected
                      ? 'rgba(255,59,31,0.08)'
                      : isHovered
                      ? 'var(--surface-2)'
                      : 'transparent',
                    borderBottom:
                      i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
                  }}
                >
                  {/* Left: name + brand + type */}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-1)' }}
                    >
                      {comp.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {comp.brand && (
                        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                          {comp.brand}
                        </span>
                      )}
                      {comp.type && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: 'var(--surface-2)',
                            color: 'var(--text-3)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {comp.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: no price badge + check */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isZeroPrice && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: 'var(--surface-2)',
                          color: 'var(--text-3)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        No Price Data
                      </span>
                    )}
                    {isSelected && (
                      <Check size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}