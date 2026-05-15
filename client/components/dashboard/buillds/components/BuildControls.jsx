'use client'

const JOURNEY_OPTIONS = [
  { value: '',            label: 'All Statuses' },
  { value: 'planning',    label: 'Planning'     },
  { value: 'in_progress', label: 'In Progress'  },
  { value: 'completed',   label: 'Completed'    },
  { value: 'archived',    label: 'Archived'     },
]

export default function BuildControls({
  search, onSearch,
  showFavorites, onToggleFavorites,
  journeyFilter, onJourneyFilter,
}) {
  return (
    <div className="flex flex-wrap gap-2.5 items-center">

      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none flex items-center">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search builds..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full py-2.5 pl-9 pr-4 border border-[var(--border)] rounded-xl text-sm text-[var(--text-1)] bg-[var(--surface-2)] outline-none transition-colors duration-150 placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
        />
      </div>

      {/* Favorites toggle */}
      <button
        onClick={onToggleFavorites}
        className={[
          'inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm cursor-pointer transition-all duration-150 whitespace-nowrap',
          showFavorites
            ? 'border-blue-500/30 bg-blue-600/10 text-[var(--accent)] font-semibold'
            : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] font-normal hover:text-[var(--text-1)]',
        ].join(' ')}
      >
        <span className={showFavorites ? 'text-amber-400' : 'text-[var(--text-3)]'}>
          <StarIcon />
        </span>
        Favorites
      </button>

      {/* Journey status filter */}
      <div className="relative">
        <select
          value={journeyFilter}
          onChange={(e) => onJourneyFilter(e.target.value)}
          className={[
            'appearance-none py-2.5 pl-3 pr-8 border rounded-xl text-sm outline-none cursor-pointer transition-all duration-150 font-[inherit]',
            journeyFilter
              ? 'border-blue-500/30 bg-blue-600/10 text-[var(--accent)]'
              : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]',
          ].join(' ')}
        >
          {JOURNEY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
          <ChevronIcon />
        </span>
      </div>

    </div>
  )
}

/* ─── Icons ─── */

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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