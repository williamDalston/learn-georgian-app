'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How is this different from other meditation apps like Calm or Headspace?',
    answer: 'While those apps focus on quick relaxation and sleep, our program goes deeper. We combine practical tools with science-backed frameworks to help you understand your mind and fundamentally change how you relate to your thoughts and emotions. This isn\'t just about feeling calm—it\'s about achieving lasting inner freedom.',
  },
  {
    question: 'I\'m a beginner. Will this be too advanced for me?',
    answer: 'Not at all! The program is designed for everyone, whether you\'re new to mindfulness or have years of experience. Our step-by-step approach makes complex concepts accessible, and the teacher guides you with warmth and clarity. Many of our most successful students started as complete beginners.',
  },
  {
    question: 'How long does the program take to complete?',
    answer: 'The program is self-paced, so you can move through it at your own rhythm. The structured content covers 6 core modules, and most students spend 2-3 months going through the material thoroughly. However, you have lifetime access (as long as you maintain your subscription), so you can revisit lessons whenever you need them.',
  },
  {
    question: 'What if I\'m not satisfied?',
    answer: 'We offer a 30-day money-back guarantee with no questions asked. If you\'re not completely satisfied with the program, simply contact us within 30 days of your purchase for a full refund. We\'re confident in the value we provide, but we want you to feel completely secure in your decision.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, absolutely. You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period, and there are no cancellation fees or penalties.',
  },
  {
    question: 'What happens if I can\'t afford the subscription?',
    answer: 'We believe everyone deserves access to these transformative tools. If you genuinely cannot afford a subscription, we offer a scholarship program. Simply visit our scholarship page and tell us about your situation. We review all requests with compassion and aim to support anyone committed to their journey.',
  },
  {
    question: 'What format is the content in?',
    answer: 'The program includes high-quality video lessons, audio meditations and guided practices, downloadable exercise materials, and written content. Everything is available in your member dashboard and works on any device—phone, tablet, or computer.',
  },
  {
    question: 'How much time do I need to commit each week?',
    answer: 'We recommend dedicating about 2-3 hours per week to get the most out of the program. This includes watching lessons, doing exercises, and practicing the techniques. However, since it\'s self-paced, you can adjust this to fit your schedule. Even 30 minutes a week can create meaningful change.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-white" id="faq">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg font-sans text-gray-700">
              Everything you need to know before starting your journey
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-sans font-semibold text-lg text-primary-900 pr-8">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 text-accent transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <p className="font-sans text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center px-4 sm:px-0">
            <p className="text-base font-sans text-gray-700 mb-4">
              Still have questions? We're here to help.
            </p>
            <a
              href="mailto:support@innerfreedomprogram.com"
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

