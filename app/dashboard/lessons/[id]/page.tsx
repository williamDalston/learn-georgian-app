'use client'

import { useParams, useRouter } from 'next/navigation'
import LessonPlayer from '@/components/dashboard/LessonPlayer'
import Container from '@/components/shared/Container'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import { getLessonById, getAllLessons, courseStructure } from '@/lib/data/courseStructure'
import { useLessons } from '@/lib/hooks/useLessons'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.id as string
  const { getLessonById: getLessonFromHook, markLessonComplete: markComplete } = useLessons()
  
  // Try to get lesson from hook first (includes completion status), fallback to structure
  let lesson = getLessonFromHook(lessonId)
  if (!lesson) {
    lesson = getLessonById(lessonId)
  }
  
  // Fallback to first lesson if lesson not found
  if (!lesson) {
    const allLessons = getAllLessons()
    lesson = allLessons[0]
  }

  const handleComplete = async (id: string) => {
    // Mark lesson as complete
    await markComplete(id)
    // Redirect to dashboard after completion
    router.push('/dashboard')
  }

  const handleNext = () => {
    // Get all lessons to find next one
    const allLessons = getAllLessons()
    const currentIndex = allLessons.findIndex(l => l.id === lesson?.id)
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1]
      router.push(`/dashboard/lessons/${nextLesson.id}`)
    } else {
      // No more lessons, go to dashboard
      router.push('/dashboard')
    }
  }

  const handlePrevious = () => {
    // Get all lessons to find previous one
    const allLessons = getAllLessons()
    const currentIndex = allLessons.findIndex(l => l.id === lesson?.id)
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1]
      router.push(`/dashboard/lessons/${prevLesson.id}`)
    } else {
      // First lesson, go to dashboard
      router.push('/dashboard')
    }
  }

  // Build breadcrumbs
  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Lessons', href: '/dashboard/courses' },
    ]

    if (lesson) {
      // Find which level/module this lesson belongs to
      for (const level of courseStructure) {
        const foundLesson = level.lessons.find(l => l.id === lesson.id)
        if (foundLesson) {
          crumbs.push({ label: `${level.code}: ${level.name}`, href: `/dashboard/courses?level=${level.code}` })
          crumbs.push({ label: lesson.title || 'Lesson' })
          break
        }
      }
    } else {
      crumbs.push({ label: 'Lesson' })
    }

    return crumbs
  }

  return (
    <Container maxWidth="4xl" className="py-8">
      <Breadcrumbs items={getBreadcrumbs()} className="mb-6" />
      <LessonPlayer
        lesson={lesson}
        onComplete={handleComplete}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Container>
  )
}

