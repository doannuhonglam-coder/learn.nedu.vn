import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { toast } from '../../../shared/components/ui/Toast'
import { useNotifications } from '../hooks/useNotifications'
import { notificationsService } from '../services/notifications.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { useNavigate } from 'react-router-dom'

interface NotifModalProps {
  open: boolean
  onClose: () => void
}

export function NotifModal({ open, onClose }: NotifModalProps) {
  const { data: notifications, isLoading } = useNotifications()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setNotifCount = useAuthStore((s) => s.setNotifCount)

  const markAllMutation = useMutation({
    mutationFn: () => notificationsService.markRead(),
    onSuccess: () => {
      setNotifCount(0)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast('Đã đánh dấu tất cả đã đọc', 'success')
    },
  })

  const handleItemClick = (actionUrl: string | null) => {
    if (actionUrl) {
      navigate(actionUrl)
      onClose()
    }
  }

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return (
    <BottomSheet open={open} onClose={onClose} title="Thông báo">
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : !notifications || notifications.length === 0 ? (
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
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleItemClick(notif.action_url)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors
                  ${!notif.is_read ? 'bg-amber-50' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className="text-lg flex-shrink-0">{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.is_read ? 'font-semibold text-brand-dark' : 'font-medium text-gray-700'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleDateString('vi-VN')}
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
