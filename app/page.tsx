import dynamic from 'next/dynamic'
import Header from '@/components/shared/Header'
import EmailCaptureBanner from '@/components/homepage/EmailCaptureBanner'
import HeroSection from '@/components/homepage/HeroSection'
import ValueProposition from '@/components/homepage/ValueProposition'
import SkipLink from '@/components/shared/SkipLink'

// Lazy load below-fold components for better mobile performance
const CourseOutline = dynamic(() => import('@/components/homepage/CourseOutline'), {
  loading: () => <div className="min-h-[200px]" />,
})

const TeacherBio = dynamic(() => import('@/components/homepage/TeacherBio'), {
  loading: () => <div className="min-h-[400px]" />,
})

const Credentials = dynamic(() => import('@/components/homepage/Credentials'), {
  loading: () => <div className="min-h-[200px]" />,
})

const LogoCloud = dynamic(() => import('@/components/homepage/LogoCloud'), {
  loading: () => <div className="min-h-[100px]" />,
})

const SocialProof = dynamic(() => import('@/components/testimonials/SocialProof'), {
  loading: () => <div className="min-h-[100px]" />,
})

const TestimonialGrid = dynamic(() => import('@/components/testimonials/TestimonialGrid'), {
  loading: () => <div className="min-h-[600px]" />,
})

const SpotlightTestimonial = dynamic(() => import('@/components/testimonials/SpotlightTestimonial'), {
  loading: () => <div className="min-h-[300px]" />,
})

const PricingTable = dynamic(() => import('@/components/pricing/PricingTable'), {
  loading: () => <div className="min-h-[500px]" />,
})

const FAQ = dynamic(() => import('@/components/homepage/FAQ'), {
  loading: () => <div className="min-h-[400px]" />,
})

const ScholarshipSection = dynamic(() => import('@/components/pricing/ScholarshipSection'), {
  loading: () => <div className="min-h-[200px]" />,
})

const FinalCTA = dynamic(() => import('@/components/homepage/FinalCTA'), {
  loading: () => <div className="min-h-[300px]" />,
})

import StickyMobileCTAClient from '@/components/homepage/StickyMobileCTAClient'
const ScrollProgress = dynamic(() => import('@/components/shared/ScrollProgress'))
const BackToTop = dynamic(() => import('@/components/shared/BackToTop'))

export default function Home() {
  return (
    <>
      <Header />
      <EmailCaptureBanner />
      <SkipLink />
      <ScrollProgress />
      <main id="main-content" className="min-h-screen pt-16">
        <HeroSection />
        <ValueProposition />
        <CourseOutline />
        <TeacherBio />
        <Credentials />
        <LogoCloud />
        <SocialProof />
        <TestimonialGrid />
        <SpotlightTestimonial />
        <PricingTable />
        <FAQ />
        <ScholarshipSection />
        <FinalCTA />
        <StickyMobileCTAClient />
      </main>
      <BackToTop />
    </>
  )
}
