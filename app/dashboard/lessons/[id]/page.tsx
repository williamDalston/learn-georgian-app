'use client'

import { useParams, useRouter } from 'next/navigation'
import LessonPlayer from '@/components/dashboard/LessonPlayer'
import Container from '@/components/shared/Container'

// Mock lesson data - in production, this would come from an API or database
const mockLessons: Record<string, any> = {
  'lesson-1': {
    id: 'lesson-1',
    title: 'Introduction: Understanding Your Inner Landscape',
    description:
      'Begin your journey by exploring the foundational concepts of inner freedom and self-awareness. This lesson introduces you to the key principles that will guide your transformation. We will explore how to recognize patterns in your thoughts and emotions, and begin building the foundation for lasting change.',
    duration: 18,
    videoUrl: '', // Add video URL here when available
    exerciseMaterials: [
      {
        name: 'Reflection Worksheet',
        url: '/materials/reflection-worksheet.pdf',
      },
      {
        name: 'Practice Guide',
        url: '/materials/practice-guide.pdf',
      },
    ],
    isCompleted: false,
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.id as string
  const lesson = mockLessons[lessonId] || mockLessons['lesson-1']

  const handleComplete = (id: string) => {
    // In production, this would update the lesson completion status in the database
    console.log('Lesson completed:', id)
    // Update UI or redirect
  }

  const handleNext = () => {
    // Navigate to next lesson (logic would depend on course structure)
    router.push('/dashboard')
  }

  const handlePrevious = () => {
    // Navigate to previous lesson
    router.push('/dashboard')
  }

  return (
    <Container maxWidth="4xl" className="py-8">
      <LessonPlayer
        lesson={lesson}
        onComplete={handleComplete}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Container>
  )
}

