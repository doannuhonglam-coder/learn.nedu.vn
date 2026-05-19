import { useQuery } from '@tanstack/react-query'
import { coachingService } from '../services/coaching.service'

export function useCoachingSessions() {
  return useQuery({
    queryKey: ['coaching', 'sessions'],
    queryFn: coachingService.listSessions,
  })
}

export function useCoachingSession(id: string | null) {
  return useQuery({
    queryKey: ['coaching', 'sessions', id],
    queryFn: () => coachingService.getSession(id!),
    enabled: !!id,
  })
}
