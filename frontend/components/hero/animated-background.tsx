'use client'

import { motion } from 'motion/react'

export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top spotlight */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(60% 80% at 50% -10%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)',
        }}
      />

      {/* Grid texture */}
      <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute -left-24 top-[-10%] size-[38rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0], opacity: [0.4, 0.55, 0.45, 0.4] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-12%] top-[8%] size-[34rem] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }}
        animate={{ x: [0, -50, 20, 0], y: [0, 50, -20, 0], opacity: [0.3, 0.45, 0.35, 0.3] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-1/3 size-[30rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, var(--chart-3), transparent 70%)' }}
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0], opacity: [0.25, 0.4, 0.3, 0.25] }}
        transition={{ duration: 26, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      {/* Drifting particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-foreground/40"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -26, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Bottom fade for depth */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

const PARTICLES = [
  { left: '12%', top: '30%', duration: 5, delay: 0 },
  { left: '24%', top: '68%', duration: 6.5, delay: 1.2 },
  { left: '42%', top: '22%', duration: 5.8, delay: 0.6 },
  { left: '58%', top: '74%', duration: 7, delay: 1.8 },
  { left: '71%', top: '34%', duration: 6, delay: 0.4 },
  { left: '84%', top: '60%', duration: 5.5, delay: 1.4 },
  { left: '92%', top: '26%', duration: 7.2, delay: 0.9 },
  { left: '6%', top: '52%', duration: 6.2, delay: 2 },
]
