'use client'

import BuildCard from './BuildCard'

export default function FeaturedBuilds({ builds }) {
  if (!builds || builds.length === 0) return null

  return (
    <section className="space-y-4">

      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <h2 className="text-xl font-display text-[var(--text-1)]">Featured Builds</h2>
        <span className="text-xs font-medium text-[var(--accent)] bg-blue-600/10 border border-blue-500/20 rounded-full px-2.5 py-0.5">
          {builds.length}
        </span>
      </div>

      {/* Horizontal scroll track */}
      <div className="overflow-x-auto pb-1.5 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4">
          {builds.map((build) => (
            <div key={build._id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
              <BuildCard build={build} featured />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}