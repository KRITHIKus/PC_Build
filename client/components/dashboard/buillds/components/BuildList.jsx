'use client'

import BuildCard from './BuildCard'

export default function BuildList({ builds }) {
  if (!builds || builds.length === 0) {
    return (
      <div className="text-center py-14 px-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl">
        <p className="text-sm font-medium text-[var(--text-1)]">No builds found</p>
        <p className="text-sm text-[var(--text-2)] mt-1.5">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {builds.map((build) => (
        <BuildCard key={build._id} build={build} />
      ))}
    </div>
  )
}