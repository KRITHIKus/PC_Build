'use client'

import React from 'react'
import { auth, provider } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import { useGoogleLoginMutation } from '@/services/authApi'
import { FcGoogle } from 'react-icons/fc'

export const GoogleLoginButton = () => {
  const dispatch   = useDispatch()
  const router     = useRouter()
  const [googleLogin] = useGoogleLoginMutation()

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider)

    const idToken = await result.user.getIdToken()

    const res = await googleLogin(idToken).unwrap()

    if (res?.user) {
      dispatch(setCredentials({ user: res.user }))
      router.push('/')
    } else {
      alert(res?.message || 'Google login failed')
    }
  } catch (error) {
    console.error(error)
    alert('Google login failed')
  }
}

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="relative flex items-center justify-center gap-2.5 w-full h-11 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] outline-none"
      style={{
        background:  'var(--surface-2)',
        border:      '1px solid var(--border)',
        color:       'var(--text-2)',
        fontFamily:  'var(--font-display)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background   = 'var(--surface-3)'
        e.currentTarget.style.borderColor  = 'var(--border-strong)'
        e.currentTarget.style.color        = 'var(--text-1)'
        e.currentTarget.style.boxShadow    = '0 4px 20px rgba(0,0,0,0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background   = 'var(--surface-2)'
        e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.color        = 'var(--text-2)'
        e.currentTarget.style.boxShadow    = 'none'
      }}
    >
      <FcGoogle size={17} />
      Continue with Google
    </button>
  )
}