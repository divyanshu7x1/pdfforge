import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 group shrink-0', className)}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-deep to-meadow-moss flex items-center justify-center text-white font-display font-bold text-xl sm:text-2xl shadow-craft group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
        <span className="z-10">P</span>
        <div className="absolute inset-0 bg-artisan-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-artisan-ink group-hover:text-sky-azure transition-colors">
          PDFForge
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-meadow-emerald font-bold -mt-1">
          Coastal Sky Atelier
        </span>
      </div>
    </div>
  )
}
