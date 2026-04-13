import { api } from '../../../shared/config/api-client'
import type { HomeSummary, ContinueLearning } from '../../../shared/types'

export const homeService = {
  getSummary: () => api.get<HomeSummary>('/home/summary'),
  getContinueLearning: () => api.get<ContinueLearning | null>('/home/continue-learning'),
}
