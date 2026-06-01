import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '@/providers/StoreProvider'

const figtree = Figtree({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
  weight:   ['400', '500', '600'],
})

const bricolage = Bricolage_Grotesque({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
  weight:   ['400', '500', '600', '700', '800'],
})

export const metadata = {
  title: {
    default:  'BuildLab — Build Your Dream Machine',
    template: '%s | BuildLab',
  },
  description:
    'Premium PC building platform. Browse components, compare builds, and configure your perfect setup.',
  keywords: ['PC builder', 'custom PC', 'gaming PC', 'build PC', 'PC components'],
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable}`}>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}