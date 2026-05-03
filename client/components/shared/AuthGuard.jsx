'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsAdmin, selectAuthLoading } from '@/store/authSlice'

/* ── Spinner ─────────────────────────────────────────────────── */
function AuthLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'rgba(255,59,31,0.2)', borderTopColor: 'var(--red)' }}
        />
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
        >
          Verifying session…
        </p>
      </div>
    </div>
  )
}

/* ── User Guard — requires isAuthenticated ──────────────────── */
export function UserGuard({ children }) {
  const router          = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading       = useSelector(selectAuthLoading)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading)       return <AuthLoading />
  if (!isAuthenticated) return null   // redirect in-flight

  return <>{children}</>
}

/* ── Admin Guard — requires role === 'admin' ────────────────── */
export function AdminGuard({ children }) {
  const router          = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin         = useSelector(selectIsAdmin)
  const isLoading       = useSelector(selectAuthLoading)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/signin')
      } else if (!isAdmin) {
        router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  if (isLoading)                      return <AuthLoading />
  if (!isAuthenticated || !isAdmin)   return null

  return <>{children}</>
}