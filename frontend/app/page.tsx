import { AmbientCanvas } from '@/components/ambient-canvas'
import { SiteNav } from '@/components/site-nav'
import { HeroSection } from '@/components/hero/hero-section'
import { TransformationsSection } from '@/components/sections/transformations'
import { SecuritySanctumSection } from '@/components/sections/security-sanctum'
import { ToolsSection } from '@/components/tools/tools-section'
import { FinalCTASection } from '@/components/sections/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div id="top" className="relative min-h-screen bg-parchment-100 text-artisan-ink selection:bg-sky-azure selection:text-white paper-grain">
      {/* Background ambient floating particles */}
      <AmbientCanvas />

      {/* Sticky Header Navigation */}
      <SiteNav />

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-12 sm:space-y-16 md:space-y-20 pb-16">
        <HeroSection />
        <TransformationsSection />
        <SecuritySanctumSection />
        <ToolsSection />
        <FinalCTASection />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
