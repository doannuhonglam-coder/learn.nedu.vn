import { api } from '../../../shared/config/api-client'
import type { AssignmentDetail, SubmissionDetail } from '../../../shared/types'

// BE accept { content?, file_url? } — at least 1 required. FE form validate
// "1-of-2" trước khi submit (xem SubmitModal).
export interface SubmitAssignmentPayload {
  content?: string
  file_url?: string
}

export const assignmentsService = {
  getAssignments: () => api.get<AssignmentDetail[]>('/assignments'),
  getAssignmentDetail: (assignmentId: string) => api.get<AssignmentDetail>(`/assignments/${assignmentId}`),
  submitAssignment: (assignmentId: string, data: SubmitAssignmentPayload) =>
    api.post<SubmissionDetail>(`/assignments/${assignmentId}/submit`, data),
}
