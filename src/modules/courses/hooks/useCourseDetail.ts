import { useQuery } from '@tanstack/react-query'
import { coursesService } from '../services/courses.service'

export function useCourseDetail(courseId: string | null) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesService.getCourseDetail(courseId!),
    enabled: !!courseId,
  })
}

export function useCourseLessons(courseId: string | null) {
  return useQuery({
    queryKey: ['course', courseId, 'lessons'],
    queryFn: () => coursesService.getCourseLessons(courseId!),
    enabled: !!courseId,
  })
}

export function useLessonDetail(lessonId: string | null) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => coursesService.getLessonDetail(lessonId!),
    enabled: !!lessonId,
  })
}
