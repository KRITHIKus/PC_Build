import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import createNoopStorage from './createNoopStorage'

import authReducer from './authSlice'
import uiReducer from './uiSlice'
import { baseApi } from '@/services/baseApi'

const storageEngine =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const authPersistConfig = {
  key: 'auth',
  storage: storageEngine,
  whitelist: ['user', 'token', 'isAuthenticated'],
}

const uiPersistConfig = {
  key: 'ui',
  storage: storageEngine,
  whitelist: ['sidebarOpen'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  [baseApi.reducerPath]: baseApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)