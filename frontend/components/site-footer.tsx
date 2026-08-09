import Link from 'next/link'
import { Logo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-parchment-300 bg-parchment-100/90 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-parchment-800">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-6">
          <Link href="/#workshop" className="hover:text-sky-azure transition-colors">
            Workshop
          </Link>
          <Link href="/#transformations" className="hover:text-sky-azure transition-colors">
            Transformations
          </Link>
          <Link href="/#tools" className="hover:text-sky-azure transition-colors">
            Toolkit
          </Link>
          <Link href="/#security" className="hover:text-sky-azure transition-colors">
            Security
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} PDFYaar Atelier. All rights reserved.</span>
          <a href="#top" className="text-sky-azure hover:underline">
            Back to Top &uarr;
          </a>
        </div>
      </div>
    </footer>
  )
}
