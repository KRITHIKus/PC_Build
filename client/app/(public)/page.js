import { HeroSection }         from '@/components/home/HeroSection'
import { FeatureCards }        from '@/components/home/FeatureCards'
import { RecommendedPreview }  from '@/components/home/RecommendedPreview'
import { HowItWorks }          from '@/components/home/HowItWorks'
import { HomeCTA }             from '@/components/home/HomeCTA'

export const metadata = {
  title:       'BuildLab — Build Your Dream Machine',
  description: 'Configure your perfect PC with real-time pricing, compatibility checks, and expert-curated builds.',
}

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <HeroSection />
      <FeatureCards />
      <RecommendedPreview />
      <HowItWorks />
      <HomeCTA />
    </div>
  )
}