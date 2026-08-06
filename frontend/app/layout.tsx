import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const SITE_TITLE = 'PDFForge — Premium PDF tools, forged for everyone'
const SITE_DESCRIPTION =
  'Merge, split, compress, rotate and convert PDFs in seconds — plus AI-powered chat, summaries and redaction. Fast, private, and free.'

export const metadata: Metadata = {
  metadataBase: new URL('https://pdfforge.app'),
  title: {
    default: SITE_TITLE,
    template: '%s · PDFForge',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'PDFForge',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    siteName: 'PDFForge',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
