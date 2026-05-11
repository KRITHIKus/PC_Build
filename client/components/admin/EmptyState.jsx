'use client'

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
      style={{ border: '1px dashed rgba(255,255,255,0.07)' }}
    >
      {Icon && (
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}
        >
          <Icon size={22} strokeWidth={1.5} />
        </span>
      )}
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {title}
      </p>
      {description && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
          {description}
        </p>
      )}
    </div>
  )
}