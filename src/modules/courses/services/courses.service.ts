import { api } from '../../../shared/config/api-client'
import type { EnrollmentSummary, CourseDetail, LessonSummary, LessonDetail, LessonProgressResponse, CourseMaterial } from '../../../shared/types'

export const coursesService = {
  getEnrollments: () => api.get<EnrollmentSummary[]>('/enrollments'),
  getCourseDetail: (courseId: string) => api.get<CourseDetail>(`/courses/${courseId}`),
  getCourseLessons: (courseId: string) => api.get<LessonSummary[]>(`/courses/${courseId}/lessons`),
  getCourseMaterials: (courseId: string) => api.get<CourseMaterial[]>(`/courses/${courseId}/materials`),
  getLessonDetail: (lessonId: string) => api.get<LessonDetail>(`/lessons/${lessonId}`),
  postLessonProgress: (lessonId: string, watchPercent: number) =>
    api.post<LessonProgressResponse>(`/lessons/${lessonId}/progress`, { watch_percent: watchPercent }),
  getLessonNotes: (lessonId: string) => api.get<{ content: string }>(`/lessons/${lessonId}/notes`),
  saveLessonNotes: (lessonId: string, content: string) =>
    api.put<{ content: string }>(`/lessons/${lessonId}/notes`, { content }),
}
