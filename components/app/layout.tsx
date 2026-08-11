import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'MelanoScan – AI-Based Early Melanoma Detection System',
  description:
    'MelanoScan is an AI-assisted screening tool that analyzes dermoscopic skin lesion images to help identify suspicious melanoma patterns. For educational and research use only — not a medical diagnosis.',
  generator: 'v0.app',
  keywords: [
    'melanoma',
    'skin cancer screening',
    'dermoscopy',
    'AI screening',
    'deep learning',
    'EfficientNet',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0e7490',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <div className="flex min-h-dvh flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
