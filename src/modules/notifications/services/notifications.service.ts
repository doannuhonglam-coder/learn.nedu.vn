import { api } from '../../../shared/config/api-client'
import type { NotificationsListResponse, NotificationPreferences } from '../../../shared/types'

// BE returns { items, unread_count } — NOT array. Caller phải đọc data.items.
export const notificationsService = {
  getNotifications: () => api.get<NotificationsListResponse>('/notifications'),
  markRead: (ids?: string[]) => api.post<{ count: number }>('/notifications/mark-read', { ids }),
  getPreferences: () => api.get<NotificationPreferences>('/notifications/preferences'),
  updatePreferences: (data: Partial<NotificationPreferences>) =>
    api.patch<NotificationPreferences>('/notifications/preferences', data),
}
