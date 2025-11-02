'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/shared/Container'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { fadeInUp, getAnimationVariants } from '@/lib/utils/animations'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How is this different from other language learning apps like Duolingo or Babbel?',
    answer: 'While those apps are great for vocabulary, our program focuses on comprehensive Georgian language mastery. We cover the unique Georgian alphabet, complex grammar, real conversation skills, and cultural context that other apps miss. Our structured approach takes you from absolute beginner to conversational fluency with native speaker instruction.',
  },
  {
    question: 'I\'m a complete beginner. Will this be too advanced for me?',
    answer: 'Not at all! The program is designed specifically for absolute beginners. We start with the Georgian alphabet and basic greetings, then gradually build your skills. Our step-by-step approach makes even complex Georgian grammar accessible, and our teachers guide you with patience and clarity. Many of our most successful students started with zero knowledge of Georgian.',
  },
  {
    question: 'How long does it take to become conversational?',
    answer: 'The program is self-paced, so progress depends on your dedication and practice time. Most students who study 3-5 hours per week reach conversational level within 4-6 months. The structured content covers 5 comprehensive levels (A1-C1) with 33+ lessons total. Since the course is completely free, you have lifetime access and can learn at your own pace, revisiting lessons whenever needed.',
  },
  {
    question: 'Is the course really free?',
    answer: 'Yes! The entire course from beginner (A1) to conversational (C1) is 100% free forever. No credit card required, no hidden fees, no subscriptions. Just create a free account to track your progress and start learning immediately.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'Yes, creating a free account allows you to track your progress through the 33+ lessons, save your completion status, and access your personalized dashboard. It only takes a minute to sign up with just your email and a password - no payment information needed.',
  },
  {
    question: 'What if I have questions or need help?',
    answer: 'We\'re here to help! Contact our support team at support@learntogeorgian.com with any questions about the course content, technical issues, or learning strategies. We aim to respond to all inquiries within 24 hours.',
  },
  {
    question: 'What format is the content in?',
    answer: 'The program includes high-quality video lessons with native speakers, audio pronunciation guides, interactive exercises and quizzes, downloadable worksheets, and written grammar explanations. Everything is available in your member dashboard and works on any device—phone, tablet, or computer.',
  },
  {
    question: 'How much time do I need to commit each week?',
    answer: 'We recommend dedicating about 3-5 hours per week to make steady progress toward conversational fluency. This includes watching lessons, completing exercises, and practicing speaking. However, since it\'s self-paced, you can adjust this to fit your schedule. Even 1-2 hours per week will help you make progress, though it may take longer to reach your goals.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-gradient-to-b from-white to-neutral-50" id="faq">
      <Container>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="up">
            <div className="text-center mb-12 px-4 sm:px-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg font-sans text-gray-700">
                Everything you need to know before starting your journey
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm hover:border-accent/40 hover:shadow-lg transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={getAnimationVariants({
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.4,
                    }
                  }
                })}
                whileHover={{ 
                  y: -2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset transition-colors group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  whileHover={{ backgroundColor: 'rgba(255, 125, 50, 0.05)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="font-sans font-semibold text-lg text-primary-900 pr-8 group-hover:text-accent transition-colors">
                    {faq.question}
                  </span>
                  <motion.svg
                    className="w-6 h-6 flex-shrink-0 text-accent group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </motion.button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 bg-gradient-to-br from-neutral-50 to-white border-t border-gray-200">
                        <motion.p 
                          className="font-sans text-base text-gray-700 leading-relaxed"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center px-4 sm:px-0">
            <p className="text-base font-sans text-gray-700 mb-4">
              Still have questions? We're here to help.
            </p>
            <a
              href="mailto:support@learntogeorgian.com"
              className="inline-block text-accent hover:text-accent-dark font-sans font-semibold underline transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

