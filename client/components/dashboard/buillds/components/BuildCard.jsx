'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBuildActions } from '../hooks/useBuildActions'
import Link from 'next/link'

const JOURNEY_STATUSES = ['planning', 'in_progress', 'completed', 'archived']

const journeyLabel = (status) => ({
  planning:    'Planning',
  in_progress: 'In Progress',
  completed:   'Completed',
  archived:    'Archived',
}[status] || status)

// Returns Tailwind class strings — no inline style objects
const journeyClasses = (status) => ({
  planning:    { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     dot: 'bg-blue-400'    },
  in_progress: { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', dot: 'bg-orange-400' },
  completed:   { badge: 'bg-green-500/10 text-green-400 border-green-500/20',   dot: 'bg-green-400'   },
  archived:    { badge: 'bg-[var(--surface-3)] text-[var(--text-2)] border-[var(--border)]', dot: 'bg-[var(--text-3)]' },
}[status] || { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' })

export default function BuildCard({ build, featured = false }) {
  const router = useRouter()
  const {
    handleRename,
    handleFavorite,
    handleJourneyChange,
    handleDuplicate,
    handleDelete,
    handleToggleFeatured,
  } = useBuildActions()

  // All state logic unchanged
  const [isFavorite,       setIsFavorite]       = useState(build.isFavorite ?? false)
  const [journeyStatus,    setJourneyStatus]    = useState(build.journeyStatus ?? 'planning')
  const [title,            setTitle]            = useState(build.title ?? 'Untitled Build')
  const [isRenaming,       setIsRenaming]       = useState(false)
  const [renameValue,      setRenameValue]      = useState(title)
  const [showDropdown,     setShowDropdown]     = useState(false)
  const [showJourneyMenu,  setShowJourneyMenu]  = useState(false)
  const [showDeleteConfirm,setShowDeleteConfirm]= useState(false)

  const dropdownRef    = useRef(null)
  const journeyRef     = useRef(null)
  const renameInputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
      if (journeyRef.current  && !journeyRef.current.contains(e.target))  setShowJourneyMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [isRenaming])

  // All handlers unchanged
  const onFavoriteClick = async () => {
    const newFav = !isFavorite
    setIsFavorite(newFav)
    await handleFavorite(build, newFav)
  }

  const onJourneySelect = async (status) => {
    setJourneyStatus(status)
    setShowJourneyMenu(false)
    await handleJourneyChange(build._id, status)
  }

  const onRenameSubmit = async () => {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== title) {
      setTitle(trimmed)
      await handleRename(build._id, trimmed)
    }
    setIsRenaming(false)
  }

  const onRenameKeyDown = (e) => {
    if (e.key === 'Enter')  onRenameSubmit()
    if (e.key === 'Escape') { setRenameValue(title); setIsRenaming(false) }
  }

  const onDeleteConfirm = async () => {
    setShowDeleteConfirm(false)
    await handleDelete(build._id)
  }

  const jc = journeyClasses(journeyStatus)

  return (
    <div className={[
      'bg-[var(--surface-2)] rounded-[14px] p-5 flex flex-col gap-3.5 relative transition-shadow duration-200',
      featured
        ? 'border-2 border-[var(--accent)] shadow-[0_4px_20px_rgba(37,99,235,0.12)]'
        : 'border border-[var(--border)] shadow-sm',
    ].join(' ')}>

      {/* Featured badge */}
      {featured && (
        <span className="absolute top-3 left-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[var(--accent)] bg-blue-600/10 border border-blue-500/20 rounded-md px-2 py-0.5">
          Featured
        </span>
      )}

      {/* Header row */}
      <div className={`flex items-start justify-between ${featured ? 'mt-5' : ''}`}>
        <div className="flex-1 min-w-0 pr-2">
          {isRenaming ? (
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={onRenameSubmit}
              onKeyDown={onRenameKeyDown}
              className="text-[15px] font-semibold text-[var(--text-1)] bg-[var(--surface-3)] border border-[var(--accent)] rounded-md px-2 py-[3px] w-full outline-none"
            />
          ) : (
            <h3 className="text-[15px] font-semibold text-[var(--text-1)] truncate">{title}</h3>
          )}
          {build.description && (
            <p className="text-sm text-[var(--text-2)] mt-0.5 line-clamp-2">{build.description}</p>
          )}
        </div>

        {/* Actions: favorite + 3-dot */}
        <div className="flex gap-1 items-center flex-shrink-0">
          <button
            onClick={onFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg border-none cursor-pointer transition-colors duration-150 flex items-center ${isFavorite ? 'text-amber-400' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'}`}
          >
            <StarIcon filled={isFavorite} />
          </button>

          {/* 3-dot dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown((p) => !p)}
              title="More actions"
              className={`p-1.5 rounded-lg border-none cursor-pointer flex items-center text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-150 ${showDropdown ? 'bg-[var(--surface-3)]' : ''}`}
            >
              <DotsIcon />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-[110%] bg-[var(--surface-1)] border border-[var(--border)] rounded-xl shadow-xl z-[100] min-w-[170px] overflow-hidden">
                <DropdownItem onClick={() => { setIsRenaming(true); setRenameValue(title); setShowDropdown(false) }}>
                  Rename
                </DropdownItem>
                <DropdownItem onClick={async () => { setShowDropdown(false); await handleDuplicate(build._id) }}>
                  Duplicate
                </DropdownItem>
                <DropdownItem onClick={async () => { setShowDropdown(false); await handleToggleFeatured(build) }}>
                  {build.isFeatured ? 'Unfeature' : 'Feature'}
                </DropdownItem>
                <div className="h-px bg-[var(--border)] my-1" />
                <DropdownItem danger onClick={() => { setShowDropdown(false); setShowDeleteConfirm(true) }}>
                  Delete
                </DropdownItem>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journey status */}
      <div ref={journeyRef} className="relative inline-block">
        <button
          onClick={() => setShowJourneyMenu((p) => !p)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer ${jc.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${jc.dot}`} />
          {journeyLabel(journeyStatus)}
          <ChevronIcon />
        </button>

        {showJourneyMenu && (
          <div className="absolute left-0 top-[110%] bg-[var(--surface-1)] border border-[var(--border)] rounded-xl shadow-xl z-[100] min-w-[150px] overflow-hidden">
            {JOURNEY_STATUSES.map((s) => {
              const c = journeyClasses(s)
              return (
                <button
                  key={s}
                  onClick={() => onJourneySelect(s)}
                  className={`flex items-center gap-2 w-full px-3.5 py-2.5 text-sm text-[var(--text-1)] text-left cursor-pointer transition-colors duration-150 ${s === journeyStatus ? 'bg-[var(--surface-3)]' : 'hover:bg-[var(--surface-3)]'}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                  {journeyLabel(s)}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* View Build button */}
      <Link href={`/dashboard/builds/${build._id}`} passHref>
        <button className="mt-auto py-2.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-3)] text-[var(--accent)] text-sm font-semibold cursor-pointer transition-colors duration-150 hover:bg-blue-600/10 hover:border-blue-500/30">
          View Build
        </button>
      </Link>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-[14px] px-7 py-7 max-w-sm w-full shadow-2xl">
            <h4 className="text-base font-semibold text-[var(--text-1)] mb-2">Delete Build</h4>
            <p className="text-sm text-[var(--text-2)] mb-5 leading-relaxed">
              Are you sure you want to delete <strong className="text-[var(--text-1)]">{title}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-2)] text-sm font-medium cursor-pointer hover:text-[var(--text-1)] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold cursor-pointer hover:bg-red-700 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function DropdownItem({ children, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={[
        'block w-full px-3.5 py-2.5 text-sm text-left cursor-pointer transition-colors duration-150',
        danger
          ? 'text-red-400 font-medium hover:bg-red-500/10'
          : 'text-[var(--text-1)] font-normal hover:bg-[var(--surface-3)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function StarIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5"  r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}