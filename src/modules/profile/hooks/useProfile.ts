import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

// useProfile + useStreak removed — both fields are sourced from useMe()
// (shared/hooks/useMe). Only metaphysical facets still has dedicated endpoint
// because vault cache logic is separate.
export function useMetaphysical() {
  return useQuery({
    queryKey: ['profile', 'metaphysical'],
    queryFn: profileService.getMetaphysical,
  })
}
