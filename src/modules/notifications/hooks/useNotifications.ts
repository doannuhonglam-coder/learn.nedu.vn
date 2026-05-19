import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '../services/notifications.service'
import type { NotificationPreferences } from '../../../shared/types'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getNotifications,
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: notificationsService.getPreferences,
  })
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<NotificationPreferences>) =>
      notificationsService.updatePreferences(patch),
    // Optimistic update — toggle phản hồi tức thì, không đợi network.
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: ['notifications', 'preferences'] })
      const previous = qc.getQueryData<NotificationPreferences>([
        'notifications',
        'preferences',
      ])
      if (previous) {
        qc.setQueryData<NotificationPreferences>(
          ['notifications', 'preferences'],
          { ...previous, ...patch },
        )
      }
      return { previous }
    },
    onError: (_err, _patch, context) => {
      if (context?.previous) {
        qc.setQueryData(['notifications', 'preferences'], context.previous)
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['notifications', 'preferences'] })
    },
  })
}
