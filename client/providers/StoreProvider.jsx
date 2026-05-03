'use client'

import { useEffect, useRef }        from 'react'
import { Provider }                  from 'react-redux'
import { PersistGate }               from 'redux-persist/integration/react'
import { store, persistor }          from '@/store'
import { setCredentials, clearCredentials } from '@/store/authSlice'
import { authApi }                   from '@/services/authApi'

/* ── Session restorer — runs once on app mount ─────────────── */
function SessionRestorer() {
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    // Fire /auth/me; httpOnly cookie is sent automatically
    store.dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
      .then((result) => {
        if (result?.data?.success && result.data?.data) {
          store.dispatch(setCredentials({ user: result.data.data }))
        } else {
          store.dispatch(clearCredentials())
        }
      })
      .catch(() => {
        store.dispatch(clearCredentials())
      })
  }, [])

  return null
}

/* ── Store Provider ─────────────────────────────────────────── */
export function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionRestorer />
        {children}
      </PersistGate>
    </Provider>
  )
}