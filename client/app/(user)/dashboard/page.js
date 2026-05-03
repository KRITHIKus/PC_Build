// Placeholder — replaced in Phase 7

export default function DashboardPage() {
  return (
    <div>
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-space)', color: 'var(--text-1)' }}
      >
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-2)' }}>
        Your builds and account — Phase 7.
      </p>

      <div
        className="flex items-center justify-center h-48 rounded-2xl text-sm"
        style={{
          background: 'var(--surface-1)',
          border:     '1px dashed var(--border)',
          color:      'var(--text-3)',
        }}
      >
        User dashboard content — Phase 7
      </div>
    </div>
  )
}