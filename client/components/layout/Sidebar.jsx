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
  Home,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/* ── Nav definitions ─────────────────────────────────────────── */
const USER_LINKS = [
  { label: "Dashboard", href: "/dashboard",        icon: LayoutDashboard },
  { label: "My Builds", href: "/dashboard/builds", icon: Cpu             },
  { label: "Compare",   href: "/comparebuilds",          icon: ArrowLeftRight  }, 
  { label: "Home",      href: "/",                 icon: Home, exact: true },
];

const ADMIN_LINKS = [
  { label: "Overview",   href: "/admin",            icon: BarChart2,       exact: true },
  { label: "Components", href: "/admin/components", icon: Cpu             },
  { label: "Builds",     href: "/admin/builds",     icon: LayoutDashboard },
  { label: "Pricing",    href: "/admin/pricing",    icon: DollarSign      },
  { label: "Learn",      href: "/admin/learn",      icon: BookOpen        },
  { label: "History",    href: "/admin/history",    icon: Clock           },
  { label: "Home",       href: "/",                 icon: Home, exact: true },
];

/* ── Single nav item ─────────────────────────────────────────── */
function SidebarLink({ href, label, icon: Icon, onNavigate, exact }) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 outline-none"
      style={{
        background: isActive ? "rgba(255,59,31,0.09)" : "transparent",
        border: isActive
          ? "1px solid rgba(255,59,31,0.2)"
          : "1px solid transparent",
      }}
    >
      {/* Active left bar */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="bar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
            style={{
              height: "50%",
              background: "var(--red)",
              boxShadow: "0 0 6px var(--red)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* Hover surface */}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
      )}

      {/* Icon container */}
      <span
        className="relative z-10 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
        style={{
          background: isActive
            ? "rgba(255,59,31,0.15)"
            : "rgba(255,255,255,0.04)",
          color: isActive ? "var(--red)" : "var(--text-3)",
        }}
      >
        <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
      </span>

      {/* Label */}
      <span
        className="relative z-10 text-sm flex-1 transition-colors duration-150"
        style={{
          color: isActive ? "var(--text-1)" : "var(--text-2)",
          fontFamily: "var(--font-display)",
          fontWeight: isActive ? 600 : 450,
        }}
      >
        {label}
      </span>
    </Link>
  );
}

/* ── Sidebar inner content ───────────────────────────────────── */
function SidebarContent({ variant, onNavigate, onClose }) {
  const links = variant === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Brand header */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex flex-col gap-1.5 min-w-0">
          <Logo size="sm" href={variant === "admin" ? "/admin" : "/dashboard"} />
          {variant === "admin" && (
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md w-fit"
              style={{
                background: "rgba(255,59,31,0.12)",
                color: "var(--red)",
                border: "1px solid rgba(255,59,31,0.22)",
              }}
            >
              Admin Console
            </span>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
            style={{
              color: "var(--text-3)",
              background: "transparent",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.border = "1px solid var(--border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-3)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = "1px solid transparent";
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
        <p
          className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            color: "var(--text-3)",
            fontFamily: "var(--font-display)",
            opacity: 0.6,
          }}
        >
          {variant === "admin" ? "Management" : "My Account"}
        </p>

        {links.map((link) => (
          <SidebarLink key={link.href} {...link} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Sign out */}
      <div
        className="px-2 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
          style={{
            color: "var(--text-3)",
            background: "transparent",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,59,31,0.08)";
            e.currentTarget.style.color = "var(--red)";
            e.currentTarget.style.border = "1px solid rgba(255,59,31,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-3)";
            e.currentTarget.style.border = "1px solid transparent";
          }}
        >
          <span
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <LogOut size={14} strokeWidth={1.8} />
          </span>
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-display)", fontWeight: 450 }}
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

  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[232px] flex-shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          background: "var(--surface-1)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <SidebarContent variant={variant} onNavigate={undefined} onClose={undefined} />
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              aria-hidden
            />

            <motion.div
              key="sidebar-drawer"
              className="fixed top-0 left-0 bottom-0 z-50 w-[min(272px,85vw)] lg:hidden flex flex-col overflow-hidden"
              style={{
                background: "var(--surface-1)",
                borderRight: "1px solid var(--border)",
                boxShadow: "12px 0 48px rgba(0,0,0,0.6)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <SidebarContent variant={variant} onNavigate={onClose} onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}