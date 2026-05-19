import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pushService } from '../services/push.service'
import type {
  PushSubscribePayload,
  PushUnsubscribePayload,
} from '../../../shared/types'

export function usePushSubscriptions() {
  return useQuery({
    queryKey: ['push', 'subscriptions'],
    queryFn: pushService.listSubscriptions,
  })
}

export function useSubscribePush() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PushSubscribePayload) => pushService.subscribe(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['push', 'subscriptions'] })
    },
  })
}

export function useUnsubscribePush() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PushUnsubscribePayload) =>
      pushService.unsubscribe(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['push', 'subscriptions'] })
    },
  })
}
