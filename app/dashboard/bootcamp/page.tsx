'use client'

import PronunciationBootcamp from '@/components/learning/PronunciationBootcamp'
import { motion } from 'framer-motion'

export default function BootcampPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <PronunciationBootcamp />
        </motion.div>
      </div>
    </div>
  )
}

