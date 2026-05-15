'use client'

import Link from 'next/link'
import { Package, Layers, ArrowRight , DollarSign, BookOpen,History,Home} from 'lucide-react'

const CARDS = [
  {
    href: "/admin/components",
    icon: Package,
    label: "Components",
    desc: "Manage inventory, pricing, and stock levels.",
    stat: "Inventory",
  },
  {
    href: "/admin/builds",
    icon: Layers,
    label: "Builds",
    desc: "Manage user builds and featured presets.",
    stat: "Builds",
  },
  {
    href: "/admin/pricing",
    icon: DollarSign,
    label: "Pricing",
    desc: "Control global pricing rules and margins.",
    stat: "Pricing",
  },
  {
    href: "/admin/learn",
    icon: BookOpen,
    label: "Learn",
    desc: "Manage guides, tutorials, and content.",
    stat: "Content",
  },
  {
    href: "/admin/history",
    icon: History,
    label: "History",
    desc: "Track admin actions and system logs.",
    stat: "Logs",
  },
  {
    href: "/",
    icon: Home,
    label: "Home",
    desc: "Back to main website.",
    stat: "Exit",
  },
];

export default function AdminPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          Admin Overview
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Control panel for managing the BuildLab platform.
        </p>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-150"
            style={{
              background:  'var(--surface-1)',
              border:      '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,59,31,0.35)'
              e.currentTarget.style.background  = 'var(--surface-2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background  = 'var(--surface-1)'
            }}
          >
            <div className="flex items-start justify-between">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,59,31,0.1)', color: 'var(--red)' }}
              >
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <ArrowRight
                size={15}
                style={{ color: 'var(--text-3)', marginTop: '2px' }}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </div>

            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
              >
                {label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                {desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}