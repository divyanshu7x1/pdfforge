export type NavLink = { label: string; href: string }

/** Anchor links for the landing page (same-route hash navigation). */
export const LANDING_NAV_LINKS: NavLink[] = [
  { label: 'Tools', href: '#tools' },
  { label: 'Features', href: '#features' },
  { label: 'AI', href: '#ai' },
  { label: 'FAQ', href: '#faq' },
]

/** Primary nav links that work from interior routes like /merge. */
export const SITE_NAV_LINKS: NavLink[] = [
  { label: 'Tools', href: '/#tools' },
  { label: 'Features', href: '/#features' },
  { label: 'AI', href: '/#ai' },
  { label: 'FAQ', href: '/#faq' },
]

/** Shared motion easing curve used across sections and tool pages. */
export const SECTION_EASE = [0.16, 1, 0.3, 1] as const

/** Maximum upload size per file (100 MB). */
export const MAX_FILE_SIZE = 100 * 1024 * 1024

export const MAX_FILE_SIZE_LABEL = '100MB'
