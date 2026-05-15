'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Profile', href: '/dashboard/profile' },
  { label: 'Builds',  href: '/dashboard/builds'  },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display text-[var(--text-1)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-2)]">Your account settings</p>
      </div>

      {/* Tab navigation */}
      <nav className="flex gap-1 border-b border-[var(--border)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150',
                isActive
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]',
              ].join(' ')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Active route content */}
      <div>{children}</div>

    </div>
  )
}