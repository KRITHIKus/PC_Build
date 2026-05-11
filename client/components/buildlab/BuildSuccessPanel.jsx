'use client'

import Link from 'next/link'
import { CheckCircle2, GitCompare, Eye, Plus } from 'lucide-react'

export function BuildSuccessPanel({ createdBuildId, onStartNew }) {
const compareHref = createdBuildId
  ? `/recommended?base=${createdBuildId}`
  : '/recommended'

  const viewHref = createdBuildId
    ? `/dashboard/builds/${createdBuildId}`
    : '/dashboard/builds'

  return (
    <div className="flex flex-col items-center text-center gap-6 py-6">

      {/* Success icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(34,197,94,0.12)',
          border:     '2px solid rgba(34,197,94,0.35)',
          boxShadow:  '0 0 24px rgba(34,197,94,0.15)',
        }}
      >
        <CheckCircle2 size={32} style={{ color: '#22c55e' }} strokeWidth={2} />
      </div>

      {/* Text */}
      <div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
        >
          Build Created
        </h3>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-2)' }}>
          Your build has been saved successfully. You can now view it in your dashboard or compare it with other builds.
        </p>
      </div>

      {/* Build ID reference */}
      {createdBuildId && (
        <div
          className="px-4 py-2 rounded-xl text-xs font-mono"
          style={{
            background: 'var(--surface-2)',
            border:     '1px solid var(--border)',
            color:      'var(--text-3)',
            wordBreak:  'break-all',
          }}
        >
          ID: {createdBuildId}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <Link
          href={viewHref}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
            color:      '#fff',
            fontFamily: 'var(--font-display)',
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,59,31,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
        >
          <Eye size={15} strokeWidth={2.2} />
          View Build
        </Link>

        <Link
          href={compareHref}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border:     '1px solid rgba(255,255,255,0.1)',
            color:      'var(--text-1)',
            fontFamily: 'var(--font-display)',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.background  = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.background  = 'rgba(255,255,255,0.05)'
          }}
        >
          <GitCompare size={15} strokeWidth={2.2} />
          Compare with Other Builds
        </Link>

        <button
          type="button"
          onClick={onStartNew}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-all duration-150"
          style={{
            background: 'transparent',
            border:     '1px solid rgba(255,255,255,0.07)',
            color:      'var(--text-3)',
            fontFamily: 'var(--font-display)',
            cursor:     'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color       = 'var(--text-2)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color       = 'var(--text-3)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          }}
        >
          <Plus size={14} />
          Start Another Build
        </button>
      </div>
    </div>
  )
}