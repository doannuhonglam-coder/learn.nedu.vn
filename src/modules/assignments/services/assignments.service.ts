import { api } from '../../../shared/config/api-client'
import type { AssignmentDetail, SubmissionDetail } from '../../../shared/types'

export const assignmentsService = {
  getAssignments: () => api.get<AssignmentDetail[]>('/assignments'),
  getAssignmentDetail: (assignmentId: string) => api.get<AssignmentDetail>(`/assignments/${assignmentId}`),
  submitAssignment: (assignmentId: string, data: { content: string; file_url?: string }) =>
    api.post<SubmissionDetail>(`/assignments/${assignmentId}/submit`, data),
}
