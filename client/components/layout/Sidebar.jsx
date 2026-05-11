"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  BookmarkCheck,
  ArrowLeftRight,
  BarChart2,
  DollarSign,
  BookOpen,
  Clock,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Home } from "lucide-react";

/* ── Nav definitions ─────────────────────────────────────────── */
const USER_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Builds", href: "/dashboard/builds", icon: Cpu },
  { label: "Compare", href: "/compare", icon: ArrowLeftRight },
  { label: "Saved", href: "/dashboard/saved", icon: BookmarkCheck },
  { label: "Home", href: "/", icon: Home },
];

const ADMIN_LINKS = [
  { label: 'Overview',   href: '/admin',            icon: BarChart2  },
  { label: 'Components', href: '/admin/components', icon: Cpu        },
  { label: 'Builds',     href: '/admin/builds',     icon: LayoutDashboard }, // ✅ ADD THIS
  { label: 'Pricing',    href: '/admin/pricing',    icon: DollarSign },
  { label: 'Learn',      href: '/admin/learn',      icon: BookOpen   },
  { label: 'History',    href: '/admin/history',    icon: Clock      },
  { label: 'Home',       href: '/',                 icon: Home       },
]

/* ── Single nav item ─────────────────────────────────────────── */
function SidebarLink({ href, label, icon: Icon, onNavigate }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 outline-none"
      style={{
        background: isActive ? "rgba(255,59,31,0.08)" : "transparent",
        border: isActive
          ? "1px solid rgba(255,59,31,0.18)"
          : "1px solid transparent",
        color: isActive ? "var(--text-1)" : "var(--text-2)",
      }}
    >
      {/* Active left indicator bar */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="bar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
            style={{
              height: "55%",
              background: "var(--red)",
              boxShadow: "0 0 8px var(--red-glow)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Hover bg */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
          }}
        />
      )}

      {/* Icon */}
      <span
        className="relative z-10 flex-shrink-0 transition-colors duration-150"
        style={{ color: isActive ? "var(--red)" : "var(--text-3)" }}
      >
        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
      </span>

      {/* Label */}
      <span
        className="relative z-10 text-sm font-medium flex-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>

      {/* Arrow hint */}
      <ChevronRight
        size={13}
        className="relative z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-150 flex-shrink-0"
      />
    </Link>
  );
}

/* ── Sidebar inner content ───────────────────────────────────── */
function SidebarContent({ variant, onNavigate }) {
  const links = variant === "admin" ? ADMIN_LINKS : USER_LINKS;
  const section = variant === "admin" ? "Management" : "My Account";

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="px-4 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Logo size="sm" href={variant === "admin" ? "/admin" : "/dashboard"} />
        {variant === "admin" && (
          <span
            className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: "rgba(255,59,31,0.12)",
              color: "var(--red)",
              border: "1px solid rgba(255,59,31,0.25)",
            }}
          >
            Admin Console
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
        <p
          className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-3)", fontFamily: "var(--font-display)" }}
        >
          {section}
        </p>

        {links.map((link) => (
          <SidebarLink key={link.href} {...link} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Sign out */}
      <div
        className="px-2 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
          style={{ color: "var(--text-2)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,59,31,0.07)";
            e.currentTarget.style.color = "var(--red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-2)";
          }}
        >
          <LogOut size={16} className="flex-shrink-0" strokeWidth={1.8} />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function Sidebar({ variant = "user", mobileOpen = false, onClose }) {
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar — always visible ─────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          background: "var(--surface-1)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <SidebarContent variant={variant} onNavigate={undefined} />
      </aside>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onClose}
              aria-hidden
            />

            {/* Drawer panel */}
            <motion.div
              key="sidebar-drawer"
              className="fixed top-0 left-0 bottom-0 z-50 w-[min(280px,85vw)] lg:hidden flex flex-col"
              style={{
                background: "var(--surface-1)",
                borderRight: "1px solid var(--border)",
                boxShadow: "8px 0 40px rgba(0,0,0,0.7)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-lg transition-colors z-10"
                style={{ color: "var(--text-2)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-2)";
                }}
              >
                <X size={18} />
              </button>

              <SidebarContent variant={variant} onNavigate={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
