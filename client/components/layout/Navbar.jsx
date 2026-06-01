'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import {
  LogIn, UserPlus, X, ChevronRight, ChevronDown,
  LayoutDashboard, LogOut, ShieldCheck, User,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMobileMenu, closeMobileMenu, selectMobileMenuOpen } from '@/store/uiSlice'
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, clearCredentials } from '@/store/authSlice'
import { useLogoutMutation } from '@/services/authApi'
import { NAV_LINKS } from '@/lib/constants'
import { Logo } from '@/components/ui/Logo'

/* ── Hamburger ───────────────────────────────────────────────── */
function Hamburger({ open }) {
  return (
    <div className="w-5 h-3.5 flex flex-col justify-between">
      <motion.span
        className="block h-[1.5px] w-full rounded-full origin-center"
        style={{ background: 'var(--text-1)' }}
        animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
      />
      <motion.span
        className="block h-[1.5px] rounded-full"
        style={{ background: 'var(--text-1)' }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 0.75 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className="block h-[1.5px] rounded-full origin-center"
        style={{ background: 'var(--text-1)' }}
        animate={open ? { rotate: -45, y: -5.5, width: '100%' } : { rotate: 0, y: 0, width: '55%' }}
        transition={{ duration: 0.22 }}
      />
    </div>
  )
}

/* ── Desktop nav link ────────────────────────────────────────── */
// Uses Framer Motion's layoutId so the active background pill
// smoothly slides between items on navigation — no underline flicker.
function NavLink({ href, label }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      className="relative inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium outline-none"
      style={{
        color: isActive || hovered ? 'var(--text-1)' : 'var(--text-2)',
        fontFamily: 'var(--font-display)',
        transition: 'color 150ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Shared-layout active pill — slides between nav items */}
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'rgba(255,59,31,0.08)',
            border: '1px solid rgba(255,59,31,0.18)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        />
      )}

      {/* Hover bg (only on inactive items) */}
      <AnimatePresence>
        {hovered && !isActive && (
          <motion.span
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">{label}</span>
    </Link>
  )
}

/* ── Dropdown item ────────────────────────────────────────────── */
// Extracted to remove the 6× repeated onMouseEnter/Leave blocks.
function DropdownItem({ href, icon: Icon, children, onClick, accent = false }) {
  const [hovered, setHovered] = useState(false)

  const style = {
    color: accent ? 'var(--red)' : hovered ? 'var(--text-1)' : 'var(--text-2)',
    background: hovered ? (accent ? 'rgba(255,59,31,0.08)' : 'rgba(255,255,255,0.04)') : 'transparent',
    fontFamily: 'var(--font-display)',
    transition: 'background 120ms ease, color 120ms ease',
  }

  const shared = {
    className: 'w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px]',
    style,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
  }

  return href
    ? <Link href={href} {...shared}><Icon size={13} strokeWidth={1.75} />{children}</Link>
    : <button {...shared}><Icon size={13} strokeWidth={1.75} />{children}</button>
}

/* ── Logged-in user dropdown ─────────────────────────────────── */
function UserDropdown({ user, isAdmin }) {
  const dispatch  = useDispatch()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const ref       = useRef(null)
  const [logout]  = useLogoutMutation()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try { await logout().unwrap() } catch {}
    dispatch(clearCredentials())
    setOpen(false)
    router.push('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-9 pl-2 pr-2.5 rounded-xl transition-all duration-150 outline-none"
        style={{
          background:   open ? 'var(--surface-3)' : 'transparent',
          border:       '1px solid',
          borderColor:  open ? 'var(--border)' : 'transparent',
        }}
      >
        {/* Avatar — kept compact (w-7) so it doesn't dominate the nav */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
            style={{
              border:     '1px solid rgba(255,59,31,0.35)',
              boxShadow:  '0 0 8px rgba(255,59,31,0.15)',
            }}
          />
        ) : (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{
              background:  'rgba(255,59,31,0.12)',
              color:       'var(--red)',
              border:      '1px solid rgba(255,59,31,0.3)',
              fontFamily:  'var(--font-display)',
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </div>
        )}

        <span
          className="text-sm font-medium max-w-[90px] truncate hidden sm:block"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}
        >
          {user?.username}
        </span>

        {/* Animated chevron via motion — no class toggle needed */}
        <motion.span
          className="flex items-center"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ChevronDown size={12} strokeWidth={2.5} style={{ color: 'var(--text-3)' }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 flex flex-col overflow-hidden rounded-xl"
            style={{
              background:  'var(--surface-2)',
              border:      '1px solid var(--border)',
              // Inset highlight gives depth without a heavy shadow
              boxShadow:   '0 20px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)',
              minWidth:    '192px',
              zIndex:      100,
            }}
          >
            {/* User info */}
            <div className="px-3.5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-[13px] font-semibold leading-tight"
                style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
                {user?.username}
              </p>
              <p className="text-[11px] mt-0.5 truncate leading-tight"
                style={{ color: 'var(--text-3)' }}>
                {user?.email}
              </p>
            </div>

            <div className="py-1">
              <DropdownItem href="/dashboard" icon={LayoutDashboard} onClick={() => setOpen(false)}>
                Dashboard
              </DropdownItem>
              {isAdmin && (
                <DropdownItem href="/admin" icon={ShieldCheck} onClick={() => setOpen(false)} accent>
                  Admin Panel
                </DropdownItem>
              )}
            </div>

            <div className="py-1" style={{ borderTop: '1px solid var(--border)' }}>
              <DropdownItem icon={LogOut} onClick={handleLogout} accent>
                Sign Out
              </DropdownItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Mobile drawer ───────────────────────────────────────────── */
function MobileDrawer({ isOpen, onClose, isAuthenticated, user, isAdmin }) {
  const pathname  = usePathname()
  const dispatch  = useDispatch()
  const router    = useRouter()
  const [logout]  = useLogoutMutation()

  const handleLogout = async () => {
    try { await logout().unwrap() } catch {}
    dispatch(clearCredentials())
    onClose()
    router.push('/')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mob-back"
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.nav
            key="mob-panel"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col lg:hidden"
            style={{
              width:       'min(300px, 90vw)',
              background:  'var(--surface-1)',
              borderLeft:  '1px solid var(--border)',
              boxShadow:   '-24px 0 64px rgba(0,0,0,0.7)',
            }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <Logo size="sm" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent';       e.currentTarget.style.color = 'var(--text-2)' }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Navigation
              </p>

              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    transition={{ delay: i * 0.04 + 0.05, duration: 0.22 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between px-3 py-3 rounded-xl mb-0.5 transition-all duration-150"
                      style={{
                        background:  isActive ? 'rgba(255,59,31,0.08)' : 'transparent',
                        color:       isActive ? 'var(--text-1)' : 'var(--text-2)',
                        borderLeft:  isActive ? '2px solid var(--red)' : '2px solid transparent',
                      }}
                    >
                      <span className="font-medium"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                        {link.label}
                      </span>
                      <ChevronRight
                        size={13}
                        className="opacity-0 group-hover:opacity-60 transition-opacity duration-150"
                        style={{ color: 'var(--red)' }}
                      />
                    </Link>
                  </motion.div>
                )
              })}

              {/* Account section (authenticated only) */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                >
                  <p className="px-3 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    Account
                  </p>
                  <Link href="/dashboard" onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all duration-150"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent';             e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    <LayoutDashboard size={14} strokeWidth={1.75} />
                    <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all duration-150"
                      style={{ color: 'var(--red)' }}
                    >
                      <ShieldCheck size={14} strokeWidth={1.75} />
                      <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-display)' }}>Admin Panel</span>
                    </Link>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer auth area */}
            <div className="p-4 flex flex-col gap-2 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border)' }}>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{
                    background:  'rgba(255,59,31,0.08)',
                    border:      '1px solid rgba(255,59,31,0.22)',
                    color:       'var(--red)',
                    fontFamily:  'var(--font-display)',
                  }}
                >
                  <LogOut size={14} strokeWidth={2} /> Sign Out
                </button>
              ) : (
                <>
                  <Link href="/signin" onClick={onClose}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{
                      background:  'var(--surface-2)',
                      border:      '1px solid var(--border)',
                      color:       'var(--text-1)',
                      fontFamily:  'var(--font-display)',
                    }}
                  >
                    <LogIn size={14} strokeWidth={2} /> Sign In
                  </Link>
                  <Link href="/signup" onClick={onClose}
                    className="relative w-full h-10 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold overflow-hidden"
                    style={{
                      background:  'linear-gradient(135deg, #ff4d33, #ff3b1f, #e11d2e)',
                      color:       '#fff',
                      fontFamily:  'var(--font-display)',
                    }}
                  >
                    <UserPlus size={14} strokeWidth={2} className="relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Navbar ───────────────────────────────────────────────────── */
export function Navbar() {
  const dispatch        = useDispatch()
  const isOpen          = useSelector(selectMobileMenuOpen)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user            = useSelector(selectCurrentUser)
  const isAdmin         = useSelector(selectIsAdmin)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY }     = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20))

  const close = () => dispatch(closeMobileMenu())

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
      >
        <div
          className="transition-all duration-300"
          style={{
            background:           scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
            borderBottom:         scrolled ? '1px solid var(--border)' : '1px solid transparent',
            // saturate(180%) gives macOS-style glass richness instead of plain fog
            backdropFilter:       scrolled ? 'blur(20px) saturate(180%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
            boxShadow:            scrolled ? '0 1px 48px rgba(0,0,0,0.55)' : 'none',
          }}
        >
          <div className="container-app">
            <div className="flex items-center h-16 gap-4">

              {/* Logo */}
              <Logo size="md" />

              {/* Vertical rule — creates intentional layout zones */}
              <span
                className="hidden lg:block w-px h-5 flex-shrink-0"
                style={{ background: "#e11d2e" }}
              />

              {/* Desktop nav — gap-0.5 since NavLink has its own px-3 padding */}
              <nav className="hidden lg:flex items-center gap-0.5 flex-1">
                {NAV_LINKS.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
              </nav>

              {/* Desktop auth */}
              <div className="hidden lg:flex items-center gap-1.5 ml-auto">
                {isAuthenticated ? (
                  <UserDropdown user={user} isAdmin={isAdmin} />
                ) : (
                  <>
                    {/* Sign In — ghost, text only. Cleaner at desktop scale. */}
                    <Link
                      href="/signin"
                      className="inline-flex items-center h-8 px-4 rounded-lg text-sm font-medium transition-all duration-150"
                      style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      Sign In
                    </Link>

                    {/* Sign Up — gradient + shimmer sweep + glow */}
                    <Link
                      href="/signup"
                      className="group relative inline-flex items-center gap-1.5 h-8 px-5 rounded-lg text-sm font-semibold overflow-hidden transition-all duration-200"
                      style={{
                        background:  'linear-gradient(135deg, #ff4d33, #ff3b1f, #e11d2e)',
                        color:       '#fff',
                        fontFamily:  'var(--font-display)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 22px rgba(255,59,31,0.45), 0 4px 12px rgba(255,59,31,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
                    >
                      {/* Shimmer — translates across on hover via group-hover */}
                      <span
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] skew-x-[-15deg] transition-transform duration-500 ease-out pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)', width: '50%' }}
                      />
                      <UserPlus size={13} strokeWidth={2} className="relative z-10" />
                      <span className="relative z-10">Sign Up</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden ml-auto w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 outline-none"
                style={{ background: isOpen ? 'var(--surface-2)' : 'transparent' }}
                onClick={() => dispatch(toggleMobileMenu())}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <Hamburger open={isOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Red glow line — appears on scroll */}
        <motion.div
          className="h-px w-full pointer-events-none"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background:  'linear-gradient(90deg, transparent 0%, rgba(255,59,31,0.4) 30%, rgba(255,59,31,0.4) 70%, transparent 100%)',
            boxShadow:   '0 0 10px rgba(255,59,31,0.22)',
          }}
        />
      </motion.header>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={close}
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
      />
    </>
  )
}