import { api } from '../../../shared/config/api-client'
import type { CourseSummary, CourseDetail, LessonSummary, LessonDetail, LessonProgressResponse, CourseMaterial } from '../../../shared/types'

// `runId` = course_runs.id (sellable instance K13 vs K14). FE thường gọi
// param này là `courseId` ở route URL — semantic BE là run_id.
export const coursesService = {
  listCourses: () => api.get<CourseSummary[]>('/courses'),
  getCourseDetail: (runId: string) => api.get<CourseDetail>(`/courses/${runId}`),
  getCourseLessons: (runId: string) => api.get<LessonSummary[]>(`/courses/${runId}/lessons`),
  getCourseMaterials: (runId: string) => api.get<CourseMaterial[]>(`/courses/${runId}/materials`),
  getLessonDetail: (lessonId: string) => api.get<LessonDetail>(`/lessons/${lessonId}`),
  postLessonProgress: (lessonId: string, watchPercent: number) =>
    api.post<LessonProgressResponse>(`/lessons/${lessonId}/progress`, { watch_percent: watchPercent }),
  getLessonNotes: (lessonId: string) => api.get<{ content: string }>(`/lessons/${lessonId}/notes`),
  saveLessonNotes: (lessonId: string, content: string) =>
    api.put<{ content: string }>(`/lessons/${lessonId}/notes`, { content }),
}
