'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Youtube } from 'lucide-react'

const COLS = [
  {
    heading: 'Product',
    links: [
      { href: '/components',  label: 'Browse Components'  },
      { href: '/build-lab',   label: 'Build Lab'          },
      { href: '/recommended', label: 'Recommended Builds' },
      { href: '/compare',     label: 'Compare Builds'     },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/learn',   label: 'Learn Hardware' },
      { href: '/history', label: 'PC History'     },
      { href: '/guides',  label: 'Build Guides'   },
      { href: '/blog',    label: 'Blog'           },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about',   label: 'About'          },
      { href: '/contact', label: 'Contact'        },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms',   label: 'Terms'          },
    ],
  },
]

const SOCIALS = [
  { href: 'https://github.com',  icon: Github,  label: 'GitHub'  },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none outline-none self-start">
      <svg width="25" height="25" viewBox="0 0 28 28" fill="none">
        <path d="M14 2 L24.39 8 L24.39 20 L14 26 L3.61 20 L3.61 8 Z"
          stroke="#ff3b1f" strokeWidth="1.5" fill="rgba(255,59,31,0.08)" />
        <path d="M9 14 L12 11 L16 15 L19 12"
          stroke="#ff3b1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9"  cy="14" r="1.5" fill="#ff3b1f" />
        <circle cx="19" cy="12" r="1.5" fill="#ff3b1f" />
      </svg>
      <span style={{
        fontFamily:    'var(--font-display)',
        fontWeight:    700,
        fontSize:      '1rem',
        letterSpacing: '-0.01em',
        color:         'var(--text-1)',
      }}>
        Build<span style={{ color: 'var(--red)' }}>Lab</span>
      </span>
    </Link>
  )
}

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ borderTop: '1px solid var(--border)', background: 'rgba(6,6,8,0.96)' }}
    >
      {/* Top red accent line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,59,31,0.5), transparent)' }} />

      {/* Subtle radial bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 50% at 50% 100%, rgba(255,59,31,0.04) 0%, transparent 70%)',
      }} />

      <div className="container-app relative">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-12 sm:py-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <FooterLogo />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '210px' }}>
              The modern platform for PC builders — components, builds, and knowledge in one place.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border:     '1px solid rgba(255,255,255,0.08)',
                    color:      'var(--text-3)',
                  }}
                  whileHover={{ scale: 1.08, borderColor: 'rgba(255,59,31,0.4)' }}
                  whileTap={{ scale: 0.92 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ff3b1f' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-3)' }}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs text-center sm:text-left"
            style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
          >
            © {new Date().getFullYear()} BuildLab. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-xs transition-colors"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}