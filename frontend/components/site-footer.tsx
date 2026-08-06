import Link from 'next/link'
import { Logo } from '@/components/logo'

type FooterLink = {
  label: string
  href: string
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Tools',
    links: [
      { label: 'Merge', href: '/merge' },
      { label: 'Split', href: '/split' },
      { label: 'Compress', href: '/compress' },
      { label: 'Convert', href: '/convert' },
      { label: 'Rotate', href: '/rotate' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'AI Assistant', href: '/#ai' },
      { label: 'Pricing', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'GDPR', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2.5fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium PDF tools and AI, forged into one fast, private workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href === '#' ? (
                        <span
                          title="Coming soon"
                          className="cursor-not-allowed text-sm text-muted-foreground/70"
                        >
                          {link.label}
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PDFForge. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Made for students, professionals &amp; teams.
          </p>
        </div>
      </div>
    </footer>
  )
}
