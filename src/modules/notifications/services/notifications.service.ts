import { api } from '../../../shared/config/api-client'
import type { NotificationSummary, NotificationPreferences } from '../../../shared/types'

export const notificationsService = {
  getNotifications: () => api.get<NotificationSummary[]>('/notifications'),
  markRead: (ids?: string[]) => api.post<{ count: number }>('/notifications/mark-read', { ids }),
  getPreferences: () => api.get<NotificationPreferences>('/notifications/preferences'),
  updatePreferences: (data: Partial<NotificationPreferences>) =>
    api.patch<NotificationPreferences>('/notifications/preferences', data),
}
