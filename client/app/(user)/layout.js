'use client'

import { useState } from 'react'
import { Menu, Cpu } from 'lucide-react'
import { Sidebar }    from '@/components/layout/Sidebar'
import { UserGuard }  from '@/components/shared/AuthGuard'

export default function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <UserGuard>
      <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
        <Sidebar
          variant="user"
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header
            className="lg:hidden flex items-center gap-3 h-14 px-4 flex-shrink-0"
            style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 20 }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
              style={{ color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,59,31,0.12)', color: 'var(--red)' }}>
                <Cpu size={13} />
              </span>
              <span className="text-sm font-semibold truncate"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
                Dashboard
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserGuard>
  )
}