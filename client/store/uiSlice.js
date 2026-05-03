import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  sidebarOpen:    false,
  compareDrawer:  false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileMenu(state)  { state.mobileMenuOpen = true  },
    closeMobileMenu(state) { state.mobileMenuOpen = false },
    toggleMobileMenu(state){ state.mobileMenuOpen = !state.mobileMenuOpen },

    openSidebar(state)     { state.sidebarOpen = true  },
    closeSidebar(state)    { state.sidebarOpen = false },
    toggleSidebar(state)   { state.sidebarOpen = !state.sidebarOpen },

    openCompareDrawer(state)  { state.compareDrawer = true  },
    closeCompareDrawer(state) { state.compareDrawer = false },
  },
})

export const {
  openMobileMenu, closeMobileMenu, toggleMobileMenu,
  openSidebar, closeSidebar, toggleSidebar,
  openCompareDrawer, closeCompareDrawer,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectSidebarOpen    = (state) => state.ui.sidebarOpen
export const selectCompareDrawer  = (state) => state.ui.compareDrawer
