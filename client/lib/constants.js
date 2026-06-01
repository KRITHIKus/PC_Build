// ── Brand ───────────────────────────────────────────────────────
export const APP_NAME    = 'BuildLab'
export const APP_TAGLINE = 'Build Your Dream Machine'
export const API_BASE    = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ── Public nav ──────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',     href: '/',   },
  { label: 'Components',  href: '/components'  },
  { label: 'Build Lab',   href: '/build-lab'   },
  { label: 'Recommended', href: '/recommended' },
  { label: 'Compare',     href: '/comparebuilds'     },
  { label: 'Learn',       href: '/learn'       },
  { label: 'History',     href: '/history'     },
  
]

// ── Auth ────────────────────────────────────────────────────────
export const AUTH_LINKS = [
  { label: 'Sign In', href: '/signin' },
  { label: 'Sign Up', href: '/signup' },
]

// ── User sidebar nav ────────────────────────────────────────────
export const USER_NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard',        icon: 'LayoutDashboard' },
  { label: 'My Builds', href: '/dashboard/builds', icon: 'Cpu'             },
  { label: 'Compare',   href: '/comparebuilds',          icon: 'ArrowLeftRight'  },
 
]

// ── Admin sidebar nav ───────────────────────────────────────────
export const ADMIN_NAV_LINKS = [
  { label: 'Overview',   href: '/admin',             icon: 'BarChart2'  },
  { label: 'Components', href: '/admin/components',  icon: 'Cpu'        },
  { label: 'Pricing',    href: '/admin/pricing',     icon: 'DollarSign' },
  { label: 'Learn',      href: '/admin/learn',       icon: 'BookOpen'   },
  { label: 'History',    href: '/admin/history',     icon: 'Clock'      },
]

// ── Component categories ────────────────────────────────────────
export const COMPONENT_CATEGORIES = [
  'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Cabinet', 'Cooling',
]

// ── Sort options ────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc'  },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First',       value: 'newest'     },
  { label: 'Most Popular',       value: 'popular'    },
]

// ── Build use cases ─────────────────────────────────────────────
export const BUILD_USE_CASES = [
  'Gaming', 'Content Creation', 'Workstation', 'Budget', 'Mini-ITX', 'Streaming',
]

// ── Currency ────────────────────────────────────────────────────
export const DEFAULT_CURRENCY = 'INR'
export const DEFAULT_LOCALE   = 'en-IN'