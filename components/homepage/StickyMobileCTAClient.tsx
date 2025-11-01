'use client'

import dynamic from 'next/dynamic'

const StickyMobileCTA = dynamic(() => import('@/components/homepage/StickyMobileCTA'), {
  ssr: false,
})

export default function StickyMobileCTAClient() {
  return <StickyMobileCTA />
}

