import { api } from '../../../shared/config/api-client'
import type { MetaphysicalProfile } from '../../../shared/types'

// /profile (full StudentProfile) đã merge vào /me (xem shared/hooks/useMe).
// /profile/streak đã merge vào /me.learner_state.streak_*. /profile/metaphysical/pdf
// defer Phase 2 (P2 spec NL-LEARN-API-PLAN-001).
export const profileService = {
  getMetaphysical: () => api.get<MetaphysicalProfile | null>('/profile/metaphysical'),
}
