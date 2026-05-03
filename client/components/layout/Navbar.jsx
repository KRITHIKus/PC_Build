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
      <motion.span className="block h-[1.5px] w-full rounded-full origin-center" style={{ background: 'var(--text-1)' }}
        animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} />
      <motion.span className="block h-[1.5px] rounded-full" style={{ background: 'var(--text-1)' }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 0.75 }} transition={{ duration: 0.18 }} />
      <motion.span className="block h-[1.5px] rounded-full origin-center" style={{ background: 'var(--text-1)' }}
        animate={open ? { rotate: -45, y: -5.5, width: '100%' } : { rotate: 0, y: 0, width: '55%' }} transition={{ duration: 0.22 }} />
    </div>
  )
}

/* ── Desktop nav link ────────────────────────────────────────── */
function NavLink({ href, label }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link href={href} className="relative group py-1 outline-none">
      <span className="text-sm font-medium tracking-wide transition-colors duration-200"
        style={{ color: isActive ? 'var(--text-1)' : 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {label}
      </span>
      <motion.span className="absolute bottom-0 left-0 h-[1.5px] rounded-full"
        style={{ background: 'var(--red)', boxShadow: '0 0 6px var(--red-glow)' }}
        initial={{ width: isActive ? '100%' : '0%' }}
        animate={{ width: isActive ? '100%' : '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.2 }} />
    </Link>
  )
}

/* ── Logged-in user dropdown ─────────────────────────────────── */
function UserDropdown({ user, isAdmin }) {
  const dispatch  = useDispatch()
  const router    = useRouter()
  const [open, setOpen] = useState(false)
  const ref       = useRef(null)
  const [logout]  = useLogoutMutation()

  // Close on outside click
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-150 outline-none"
        style={{
          background: open ? 'var(--surface-2)' : 'transparent',
          border:     open ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: 'rgba(255,59,31,0.15)', color: 'var(--red)', fontFamily: 'var(--font-display)' }}
        >
          {user?.username?.[0]?.toUpperCase() || <User size={14} />}
        </div>
        <span className="text-sm font-medium max-w-[100px] truncate hidden sm:block"
          style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
          {user?.username}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-3)' }}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 flex flex-col py-1 rounded-xl overflow-hidden"
            style={{
              background:   'var(--surface-2)',
              border:       '1px solid var(--border)',
              boxShadow:    '0 16px 40px rgba(0,0,0,0.6)',
              minWidth:     '180px',
              zIndex:       100,
            }}
          >
            {/* User info */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
                {user?.username}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-3)' }}>{user?.email}</p>
            </div>

            {/* Links */}
            <Link href="/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>

            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}>
                <ShieldCheck size={14} /> Admin Panel
              </Link>
            )}

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px' }}>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,31,0.07)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}>
                <LogOut size={14} /> Sign Out
              </button>
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
          <motion.div key="mob-back" className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }} onClick={onClose} />

          <motion.nav key="mob-panel" className="fixed top-0 right-0 bottom-0 z-50 flex flex-col lg:hidden"
            style={{ width: 'min(320px,90vw)', background: 'var(--surface-1)', borderLeft: '1px solid var(--border)', boxShadow: '-16px 0 60px rgba(0,0,0,0.7)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <Logo size="sm" />
              <button onClick={onClose} aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ color: 'var(--text-2)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Navigation</p>

              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.06, duration: 0.26 }}>
                    <Link href={link.href} onClick={onClose}
                      className="group flex items-center justify-between px-3 py-3.5 rounded-xl mb-1 transition-all duration-150"
                      style={{
                        background: isActive ? 'rgba(255,59,31,0.09)' : 'transparent',
                        color:      isActive ? 'var(--text-1)' : 'var(--text-2)',
                        borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
                      }}>
                      <span className="font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>
                        {link.label}
                      </span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--red)' }} />
                    </Link>
                  </motion.div>
                )
              })}

              {/* User section if authed */}
              {isAuthenticated && (
                <>
                  <p className="px-3 mt-5 mb-3 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Account</p>
                  <Link href="/dashboard" onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-150"
                    style={{ color: 'var(--text-2)' }}>
                    <LayoutDashboard size={15} />
                    <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-150"
                      style={{ color: 'var(--red)' }}>
                      <ShieldCheck size={15} />
                      <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-display)' }}>Admin Panel</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Footer auth area */}
            <div className="p-4 flex flex-col gap-2.5 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              {isAuthenticated ? (
                <button onClick={handleLogout}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ background: 'rgba(255,59,31,0.1)', border: '1px solid rgba(255,59,31,0.25)', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              ) : (
                <>
                  <Link href="/signin" onClick={onClose}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
                    <LogIn size={15} /> Sign In
                  </Link>
                  <Link href="/signup" onClick={onClose}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{ background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)', color: '#fff', fontFamily: 'var(--font-display)' }}>
                    <UserPlus size={15} /> Sign Up
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
        <div className="transition-all duration-300" style={{
          background:           scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
          borderBottom:         scrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter:       scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow:            scrolled ? '0 1px 40px rgba(0,0,0,0.6)' : 'none',
        }}>
          <div className="container-app">
            <div className="flex items-center h-16 gap-6">

              {/* Logo */}
              <Logo size="md" />

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-6 flex-1 ml-4">
                {NAV_LINKS.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
              </nav>

              {/* Desktop auth area */}
              <div className="hidden lg:flex items-center gap-2 ml-auto">
                {isAuthenticated ? (
                  <UserDropdown user={user} isAdmin={isAdmin} />
                ) : (
                  <>
                    <Link href="/signin"
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-all duration-150"
                      style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.background = 'var(--surface-2)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent' }}>
                      <LogIn size={14} /> Sign In
                    </Link>
                    <Link href="/signup"
                      className="inline-flex items-center gap-2 h-9 px-5 rounded-xl text-sm font-semibold transition-all duration-150"
                      style={{ background: 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)', color: '#fff', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,59,31,0.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}>
                      <UserPlus size={14} /> Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden ml-auto w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={{ background: isOpen ? 'var(--surface-2)' : 'transparent' }}
                onClick={() => dispatch(toggleMobileMenu())}
                aria-label="Toggle menu" aria-expanded={isOpen}>
                <Hamburger open={isOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Glow line on scroll */}
        <motion.div className="h-px w-full pointer-events-none"
          animate={{ opacity: scrolled ? 1 : 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,59,31,0.5) 40%, rgba(255,59,31,0.5) 60%, transparent 100%)', boxShadow: '0 0 8px rgba(255,59,31,0.3)' }} />
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