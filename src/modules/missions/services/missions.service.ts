import { api } from '../../../shared/config/api-client'
import type { Mission } from '../../../shared/types'

export const missionsService = {
  listMissions: () => api.get<Mission[]>('/missions'),
  getMission: (id: string) => api.get<Mission>(`/missions/${id}`),
  submitMission: (
    id: string,
    payload: { content?: string; file_url?: string },
  ) => api.post<Mission>(`/missions/${id}/submit`, payload),
}
