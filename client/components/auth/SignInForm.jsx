'use client'
import { GoogleLoginButton } from './GoogleLoginButton'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/services/authApi'
import { setCredentials } from '@/store/authSlice'

/* ── Animated input field ────────────────────────────────────── */
function AuthInput({ id, label, type = 'text', placeholder, value, onChange, icon: Icon, rightSlot, error, autoComplete }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
            style={{ color: focused ? 'var(--red)' : 'var(--text-3)' }}
          />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full outline-none transition-all duration-200 text-sm"
          style={{
            height:       '48px',
            paddingLeft:  Icon ? '42px' : '16px',
            paddingRight: rightSlot ? '44px' : '16px',
            borderRadius: '12px',
            background:   'var(--surface-1)',
            border:       `1px solid ${error ? 'rgba(255,59,31,0.5)' : focused ? 'rgba(255,59,31,0.45)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow:    focused ? '0 0 0 3px rgba(255,59,31,0.09)' : 'none',
            color:        'var(--text-1)',
            fontFamily:   'var(--font-body)',
          }}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--red)' }}
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Submit button ───────────────────────────────────────────── */
function SubmitButton({ loading, label }) {
  const shimRef = useRef(null)

  const handleEnter = () => {
    if (!shimRef.current) return
    shimRef.current.style.animation = 'none'
    void shimRef.current.offsetWidth
    shimRef.current.style.animation = 'shimmer 0.65s ease forwards'
  }

  return (
    <motion.button
      type="submit"
      disabled={loading}
      onMouseEnter={handleEnter}
      whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 0 28px rgba(255,59,31,0.5)' }}
      whileTap={loading ? {} : { scale: 0.97 }}
      className="relative w-full overflow-hidden flex items-center justify-center gap-2 font-semibold transition-all duration-200"
      style={{
        height:       '48px',
        borderRadius: '12px',
        background:   loading ? 'rgba(255,59,31,0.5)' : 'linear-gradient(135deg,#ff4d33,#ff3b1f,#e11d2e)',
        color:        '#fff',
        fontFamily:   'var(--font-display)',
        fontSize:     '0.9rem',
        border:       'none',
        cursor:       loading ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        ref={shimRef}
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
          transform:  'translateX(-100%) skewX(-12deg)',
        }}
      />
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Signing in…
        </span>
      ) : (
        <span className="flex items-center gap-2 relative z-10">
          {label}
          <ArrowRight size={16} strokeWidth={2.2} />
        </span>
      )}
    </motion.button>
  )
}

/* ── Sign In Form ────────────────────────────────────────────── */
export function SignInForm() {
  const dispatch  = useDispatch()
  const router    = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    try {
      const res = await login({ email, password }).unwrap()
      if (res?.success && res?.data) {
        dispatch(setCredentials({ user: res.data }))
        router.push('/')
      } else {
        setApiError(res?.message || 'Sign in failed. Please try again.')
      }
    } catch (err) {
      setApiError(err?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* API error banner */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            key="api-err"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(255,59,31,0.08)',
              border:     '1px solid rgba(255,59,31,0.25)',
              color:      'var(--red)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <AlertCircle size={15} />
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthInput
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
        icon={Mail}
        error={errors.email}
        autoComplete="email"
      />

      <AuthInput
        id="password"
        label="Password"
        type={showPwd ? 'text' : 'password'}
        placeholder="Your password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
        icon={Lock}
        error={errors.password}
        autoComplete="current-password"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{ color: 'var(--text-3)', lineHeight: 0 }}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <SubmitButton loading={isLoading} label="Sign In" />

      <div className="pt-2">
        <GoogleLoginButton />
      </div>

      {/* Switch link */}
      <p className="text-center text-sm" style={{ color: 'var(--text-3)' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold transition-colors"
          style={{ color: 'var(--red)', fontFamily: 'var(--font-display)' }}
        >
          Sign Up
        </Link>
      </p>
    </form>
  )
}