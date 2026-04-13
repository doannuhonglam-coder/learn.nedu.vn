import { useQuery } from '@tanstack/react-query'
import { homeService } from '../services/home.service'

export function useHomeSummary() {
  return useQuery({
    queryKey: ['home', 'summary'],
    queryFn: homeService.getSummary,
  })
}

export function useContinueLearning() {
  return useQuery({
    queryKey: ['home', 'continue-learning'],
    queryFn: homeService.getContinueLearning,
  })
}
