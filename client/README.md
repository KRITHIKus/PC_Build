# PCBuilder Frontend

Premium PC building platform — Phase 0 scaffold.

## Stack

- **Next.js 14** App Router
- **Tailwind CSS** with custom dark theme tokens
- **Redux Toolkit** + Redux Persist (auth + ui only)
- **RTK Query** (base API — extended per phase)
- **Framer Motion** (animations — Phase 1+)
- **Lenis** (smooth scroll — Phase 1+)
- **lucide-react** (icons — Phase 1+)

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Set env vars (already pre-filled for local dev)
# Edit .env.local and point NEXT_PUBLIC_API_URL to your backend

# 3. Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the black Phase 0 placeholder screen.

## Env variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | `PCBuilder` | App display name |

## Phase plan

| Phase | Status | Description |
|---|---|---|
| 0 | ✅ Done | Project setup & config |
| 1 | ⏳ Next | App shell — Navbar, Footer, mobile drawer, Lenis |
| 2 | — | Home page — cinematic hero, animated sections |
| 3 | — | Components catalog + detail |
| 4 | — | Recommended builds + compare |
| 5 | — | Build Lab |
| 6 | — | Learn + History |
| 7 | — | Auth + User dashboard |
| 8 | — | Admin dashboard |
| 9 | — | Media + final polish |
