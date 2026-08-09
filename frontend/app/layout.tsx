import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const SITE_TITLE = 'PDFYaar — PDF & Document Tools'
const SITE_DESCRIPTION =
  'A modern coastal document studio where Word, Excel, PowerPoint, images, and PDFs are converted, organized, compressed, and protected cleanly.'

export const metadata: Metadata = {
  metadataBase: new URL('https://pdfyaar.app'),
  title: {
    default: SITE_TITLE,
    template: '%s · PDFYaar',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'PDFYaar',
  openGraph: {
    type: 'website',
    siteName: 'PDFYaar',
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
  colorScheme: 'light',
  themeColor: '#FDFBF7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} scroll-smooth bg-parchment-100 text-artisan-ink`}
    >
      <body className="font-sans antialiased selection:bg-sky-azure selection:text-white paper-grain min-h-screen relative overflow-x-hidden">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
