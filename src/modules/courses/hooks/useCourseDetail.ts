import { useQuery } from '@tanstack/react-query'
import { coursesService } from '../services/courses.service'

export function useCourseDetail(runId: string | null) {
  return useQuery({
    queryKey: ['course', runId],
    queryFn: () => coursesService.getCourseDetail(runId!),
    enabled: !!runId,
  })
}

export function useCourseLessons(runId: string | null) {
  return useQuery({
    queryKey: ['course', runId, 'lessons'],
    queryFn: () => coursesService.getCourseLessons(runId!),
    enabled: !!runId,
  })
}

export function useLessonDetail(lessonId: string | null) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => coursesService.getLessonDetail(lessonId!),
    enabled: !!lessonId,
  })
}
