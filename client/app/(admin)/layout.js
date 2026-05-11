'use client'

import { useState } from 'react'
import { Menu, ShieldCheck } from 'lucide-react'
import { Sidebar }    from '@/components/layout/Sidebar'
import { AdminGuard } from '@/components/shared/AuthGuard'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminGuard>
      <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
        <Sidebar
          variant="admin"
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Mobile top bar ─────────────────────────────── */}
          <header
            className="lg:hidden flex items-center gap-3 h-14 px-4 flex-shrink-0"
            style={{
              background:   'var(--surface-1)',
              borderBottom: '1px solid var(--border)',
              position:     'sticky',
              top:          0,
              zIndex:       20,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
              style={{ color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,59,31,0.12)', color: 'var(--red)' }}
              >
                <ShieldCheck size={13} />
              </span>
              <span
                className="text-sm font-semibold truncate"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
              >
                Admin Console
              </span>
            </div>

            <span
              className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{
                background: 'rgba(255,59,31,0.12)',
                color:      'var(--red)',
                border:     '1px solid rgba(255,59,31,0.25)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Admin
            </span>
          </header>

          {/* ── Desktop top bar ────────────────────────────── */}
          <header
            className="hidden lg:flex items-center justify-between h-14 px-8 flex-shrink-0"
            style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={15} style={{ color: 'var(--red)' }} strokeWidth={2} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
              >
                Admin Console
              </span>
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md"
              style={{
                background: 'rgba(255,59,31,0.1)',
                color:      'var(--red)',
                border:     '1px solid rgba(255,59,31,0.22)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Admin
            </span>
          </header>

          {/* ── Page content ───────────────────────────────── */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-6xl">
              {children}
            </div>
          </main>

        </div>
      </div>
    </AdminGuard>
  )
}