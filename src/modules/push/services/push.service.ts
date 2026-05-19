import { api } from '../../../shared/config/api-client'
import type {
  PushSubscribePayload,
  PushSubscribeResponse,
  PushSubscriptionInfo,
  PushUnsubscribePayload,
  PushUnsubscribeResponse,
} from '../../../shared/types'

export const pushService = {
  subscribe: (payload: PushSubscribePayload) =>
    api.post<PushSubscribeResponse>('/push/subscribe', payload),
  unsubscribe: (payload: PushUnsubscribePayload) =>
    api.delete<PushUnsubscribeResponse>('/push/unsubscribe', payload),
  listSubscriptions: () =>
    api.get<PushSubscriptionInfo[]>('/push/subscriptions'),
}
