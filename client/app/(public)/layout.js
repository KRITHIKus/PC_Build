import { Navbar }        from '@/components/layout/Navbar'
import { Footer }        from '@/components/layout/Footer'
import { LenisProvider } from '@/providers/LenisProvider'

export default function PublicLayout({ children }) {
  return (
    <LenisProvider>

      <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </LenisProvider>
  )
}