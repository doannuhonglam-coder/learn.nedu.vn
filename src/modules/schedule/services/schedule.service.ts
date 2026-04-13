import { api } from '../../../shared/config/api-client'
import type { ScheduleEvent } from '../../../shared/types'

export const scheduleService = {
  getEvents: (month?: string) => api.get<ScheduleEvent[]>(`/schedule/events${month ? `?month=${month}` : ''}`),
  getEventDetail: (eventId: string) => api.get<ScheduleEvent>(`/schedule/events/${eventId}`),
}
