'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, LogIn, UserPlus } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { useDispatch } from 'react-redux'
import { closeMobileMenu } from '@/store/uiSlice'

const drawerVariants = {
  hidden:  { x: '100%', opacity: 0.6 },
  visible: {
    x: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 32 },
  },
  exit: {
    x: '100%', opacity: 0,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
}

const itemVariants = {
  hidden:   { opacity: 0, x: 16 },
  visible:  (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05 + 0.08, duration: 0.26, ease: 'easeOut' },
  }),
}

export function MobileMenu({ isOpen }) {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const close    = () => dispatch(closeMobileMenu())

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => { close() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mob-backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            aria-hidden
          />

          {/* Drawer */}
          <motion.nav
            key="mob-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-[min(320px,90vw)] flex flex-col"
            style={{
              background:  'var(--surface-1)',
              borderLeft:  '1px solid var(--border)',
              boxShadow:   '-16px 0 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <Logo size="sm" />
              <button
                onClick={close}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-2)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <p
                className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                Navigation
              </p>

              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <motion.div key={link.href} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between px-3 py-3.5 rounded-xl mb-1 transition-all duration-150"
                      style={{
                        background: isActive ? 'rgba(255,59,31,0.09)' : 'transparent',
                        color:      isActive ? 'var(--text-1)' : 'var(--text-2)',
                        borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
                      }}
                    >
                      <span
                        className="font-medium text-[15px]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {link.label}
                      </span>
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--red)' }}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Auth CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.28 } }}
              className="p-5 flex flex-col gap-2.5 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <Button
                variant="secondary"
                size="md"
                icon={<LogIn size={15} />}
                iconPosition="left"
                className="w-full justify-center"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<UserPlus size={15} />}
                iconPosition="left"
                className="w-full justify-center"
              >
                Sign Up
              </Button>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}