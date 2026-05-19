import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { toast } from '../../../shared/components/ui/Toast'
import { useNotifications } from '../hooks/useNotifications'
import { notificationsService } from '../services/notifications.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { useNavigate } from 'react-router-dom'
import type { NotificationSummary } from '../../../shared/types'

/**
 * Format created_at thành relative time gần với cảm nhận người Việt:
 *   < 1 phút → "Vừa xong"
 *   < 60 phút → "N phút trước"
 *   < 24 giờ → "N giờ trước"
 *   < 7 ngày → "N ngày trước"
 *   else → DD/MM/YYYY
 *
 * Apple Simplicity: 1 dòng dễ scan, không show timestamp đầy đủ trừ khi xa hơn 7 ngày.
 */
function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffSec = Math.floor((now - then) / 1000)
  if (diffSec < 60) return 'Vừa xong'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} phút trước`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} giờ trước`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN')
}

interface NotifModalProps {
  open: boolean
  onClose: () => void
}

// Map notification types to routes when action_url is null
function getNotifRoute(notif: NotificationSummary): string {
  if (notif.action_url) return notif.action_url
  switch (notif.type) {
    // 'payment' type vẫn fire cho non-installment events (refund / purchase
    // confirmation) — không có /payments portal nữa, route về /profile để
    // học viên xem account info.
    case 'payment': return '/profile'
    case 'assignment': return '/courses'
    case 'schedule': return '/schedule'
    case 'certificate': return '/profile'
    case 'system': return '/home'
    default: return '/home'
  }
}

export function NotifModal({ open, onClose }: NotifModalProps) {
  const { data, isLoading } = useNotifications()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setNotifCount = useAuthStore((s) => s.setNotifCount)

  // BE shape `{items, unread_count}` — handle khi query fail (data = undefined).
  const items = data?.items ?? []
  const unreadCount = data?.unread_count ?? 0

  const markAllMutation = useMutation({
    mutationFn: () => notificationsService.markRead(),
    onSuccess: () => {
      setNotifCount(0)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast('Đã đánh dấu tất cả đã đọc', 'success')
    },
  })

  // Mark single notification as read trước khi navigate.
  // Optimistic: update cache liền + decrement notifCount để badge fade ngay.
  const markOneMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markRead([id]),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      const previous = queryClient.getQueryData<typeof data>(['notifications'])
      if (previous) {
        const wasUnread = previous.items.find((i) => i.id === id)?.is_read === false
        queryClient.setQueryData(['notifications'], {
          ...previous,
          items: previous.items.map((i) =>
            i.id === id ? { ...i, is_read: true } : i,
          ),
          unread_count: wasUnread
            ? Math.max(previous.unread_count - 1, 0)
            : previous.unread_count,
        })
        if (wasUnread) {
          setNotifCount(Math.max((unreadCount as number) - 1, 0))
        }
      }
      return { previous }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['notifications'], ctx.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleItemClick = (notif: NotificationSummary) => {
    if (!notif.is_read) {
      markOneMutation.mutate(notif.id)
    }
    const route = getNotifRoute(notif)
    navigate(route)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Thông báo">
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm">
          Không có thông báo mới
        </div>
      ) : (
        <div>
          {unreadCount > 0 && (
            <div className="flex justify-end mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllMutation.mutate()}
                loading={markAllMutation.isPending}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {items.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors
                  ${!notif.is_read ? 'bg-amber-50 hover:bg-amber-100' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className="text-lg flex-shrink-0">{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.is_read ? 'font-semibold text-brand-dark' : 'font-medium text-gray-700'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatRelativeTime(notif.created_at)}
                  </p>
                </div>
                {!notif.is_read && (
                  <span className="w-2 h-2 rounded-full bg-brand-gold flex-shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
