import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/hero/hero-section'
import { Features } from '@/components/sections/features'
import { SiteFooter } from '@/components/site-footer'

const ToolsSection = dynamic(() =>
  import('@/components/tools/tools-section').then((m) => ({
    default: m.ToolsSection,
  })),
)

const AiSection = dynamic(() =>
  import('@/components/sections/ai-section').then((m) => ({
    default: m.AiSection,
  })),
)

const HowItWorks = dynamic(() =>
  import('@/components/sections/how-it-works').then((m) => ({
    default: m.HowItWorks,
  })),
)

const Testimonials = dynamic(() =>
  import('@/components/sections/testimonials').then((m) => ({
    default: m.Testimonials,
  })),
)

const Faq = dynamic(() =>
  import('@/components/sections/faq').then((m) => ({
    default: m.Faq,
  })),
)

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <HeroSection />
      <Features />
      <ToolsSection />
      <AiSection />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <SiteFooter />
    </main>
  )
}
