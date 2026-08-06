'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

/**
 * App-wide client providers.
 * `reducedMotion="user"` makes Framer Motion honor the OS
 * "reduce motion" setting, disabling transform/layout animations
 * (keeping only opacity) for users who ask for it.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
