import { useQuery } from '@tanstack/react-query'
import { profileService } from '../services/profile.service'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  })
}

export function useMetaphysical() {
  return useQuery({
    queryKey: ['profile', 'metaphysical'],
    queryFn: profileService.getMetaphysical,
  })
}

export function useStreak() {
  return useQuery({
    queryKey: ['profile', 'streak'],
    queryFn: profileService.getStreak,
  })
}
