'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  color: string
  opacity: number
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = [
      '#15803D', // Forest Emerald
      '#22C55E', // Clover Green
      '#14532D', // Deep Woodland
      '#38BDF8', // Sky Azure
      '#D99B26', // Artisan Ochre
      '#C86D51', // Terracotta
      '#86EFAC', // Dappled Meadow
      '#FEF08A', // Sunbeam Yellow
    ]
    const particles: Particle[] = []
    const isDesktop = width >= 768
    const particleCount = isDesktop ? 55 : 25

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4, // 4px to 12px
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#15803D',
        opacity: Math.random() * 0.45 + 0.45, // 0.45 to 0.90
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.speedX + Math.sin(p.y * 0.005) * 0.2
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x > width + 20) p.x = -20
        if (p.x < -20) p.x = width + 20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        // Draw leaf/petal path
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        // Leaf central vein line
        ctx.beginPath()
        ctx.moveTo(-p.size * 0.7, 0)
        ctx.lineTo(p.size * 0.7, 0)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="ambientCanvas"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-90"
      aria-hidden="true"
    />
  )
}
