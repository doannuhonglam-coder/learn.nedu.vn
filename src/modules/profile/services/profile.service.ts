import { api } from '../../../shared/config/api-client'
import type { StudentProfile, MetaphysicalProfile, StreakStats } from '../../../shared/types'

export const profileService = {
  getProfile: () => api.get<StudentProfile>('/profile'),
  getMetaphysical: () => api.get<MetaphysicalProfile | null>('/profile/metaphysical'),
  getStreak: () => api.get<StreakStats>('/profile/streak'),
  downloadMetaphysicalPdf: () => api.get<Blob>('/profile/metaphysical/pdf'),
}
