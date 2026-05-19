import { useQuery } from '@tanstack/react-query'
import { api } from '../config/api-client'
import type { LearnMeResponse } from '../types'

// GET /api/learn/me — hydrate learner state (streak, consultant_name, noi_status)
// trên top of AuthUser từ JWT verify. Source-of-truth cho learn-specific fields;
// useAuthStore.user là snapshot từ auth-central /auth/login response (subset).
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<LearnMeResponse>('/me'),
  })
}
