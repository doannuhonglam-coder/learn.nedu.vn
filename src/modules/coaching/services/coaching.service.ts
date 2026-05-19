import { api } from '../../../shared/config/api-client'
import type {
  CoachingSession,
  CoachingSessionDetail,
} from '../../../shared/types'

export const coachingService = {
  listSessions: () => api.get<CoachingSession[]>('/coaching/sessions'),
  getSession: (id: string) =>
    api.get<CoachingSessionDetail>(`/coaching/sessions/${id}`),
}
