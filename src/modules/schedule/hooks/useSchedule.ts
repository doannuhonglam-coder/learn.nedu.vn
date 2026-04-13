import { useQuery } from '@tanstack/react-query'
import { scheduleService } from '../services/schedule.service'

export function useScheduleEvents(month: string) {
  return useQuery({
    queryKey: ['schedule', 'events', month],
    queryFn: () => scheduleService.getEvents(month),
  })
}
