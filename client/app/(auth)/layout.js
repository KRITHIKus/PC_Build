// Auth pages have their own shell (AuthShell) — no shared navbar or footer
export default function AuthLayout({ children }) {
  return <>{children}</>
}