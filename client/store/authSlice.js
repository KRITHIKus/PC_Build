import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:            null,
  isAuthenticated: false,
  isLoading:       false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, { payload }) {
      state.user            = payload.user ?? payload
      state.isAuthenticated = true
    },
    clearCredentials(state) {
      state.user            = null
      state.isAuthenticated = false
    },
    setAuthLoading(state, { payload }) {
      state.isLoading = payload
    },
    updateUser(state, { payload }) {
      if (state.user) {
        state.user = { ...state.user, ...payload }
      }
    },
  },
})

export const {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  updateUser,
} = authSlice.actions

export default authSlice.reducer

// ── Selectors ────────────────────────────────────────────────
export const selectCurrentUser     = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading     = (state) => state.auth.isLoading
export const selectIsAdmin         = (state) => state.auth.user?.role === 'admin'