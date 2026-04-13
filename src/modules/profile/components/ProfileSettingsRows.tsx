import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../../auth/services/auth.service'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { SUPPORT } from '../../../shared/constants/support.constants'

interface ProfileSettingsRowsProps {
  email: string
}

export function ProfileSettingsRows({ email }: ProfileSettingsRowsProps) {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)
  const [supportOpen, setSupportOpen] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({
    push_enabled: true,
    email_enabled: true,
    push_schedule: true,
    push_assignment: true,
    push_payment: true,
  })

  const handleChangePassword = async () => {
    try {
      await authService.forgotPassword(email)
      toast('Email đổi mật khẩu đã được gửi', 'success')
    } catch {
      toast('Có lỗi xảy ra', 'error')
    }
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  const togglePref = (key: keyof typeof notifPrefs) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
    toast('Đã cập nhật', 'success')
  }

  const rows = [
    { label: 'Thanh Toán & Hóa Đơn', icon: '💳', onClick: () => navigate('/payments') },
    { label: 'Thông báo', icon: '🔔', onClick: () => setNotifOpen(true) },
    { label: 'Ngôn ngữ', icon: '🌐', onClick: () => toast('Hiện tại chỉ hỗ trợ Tiếng Việt', 'info'), suffix: 'Tiếng Việt' },
    { label: 'Đổi mật khẩu', icon: '🔑', onClick: handleChangePassword },
    { label: 'Liên hệ hỗ trợ', icon: '💬', onClick: () => setSupportOpen(true) },
    { label: 'Đăng Xuất', icon: '🚪', onClick: () => setLogoutConfirm(true), destructive: true },
  ]

  return (
    <div className="mx-4 mt-4 mb-6">
      <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
        {rows.map((row) => (
          <button
            key={row.label}
            onClick={row.onClick}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors
              ${row.destructive ? 'text-brand-red' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span>{row.icon}</span>
              <span className={`text-sm font-medium ${row.destructive ? 'text-brand-red' : 'text-brand-dark'}`}>
                {row.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {'suffix' in row && <span className="text-xs text-gray-400">{row.suffix}</span>}
              <span className="text-gray-300">›</span>
            </div>
          </button>
        ))}
      </div>

      {/* Notification Preferences Modal */}
      <BottomSheet open={notifOpen} onClose={() => setNotifOpen(false)} title="Cài đặt thông báo">
        <div className="space-y-1">
          {[
            { key: 'push_enabled' as const, label: 'Push notification', icon: '📱' },
            { key: 'email_enabled' as const, label: 'Email thông báo', icon: '📧' },
            { key: 'push_schedule' as const, label: 'Lịch học', icon: '📅' },
            { key: 'push_assignment' as const, label: 'Bài tập', icon: '📝' },
            { key: 'push_payment' as const, label: 'Thanh toán', icon: '💳' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => togglePref(item.key)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-sm text-brand-dark">{item.label}</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${notifPrefs[item.key] ? 'bg-brand-gold justify-end' : 'bg-gray-300 justify-start'}`}>
                <div className="w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Support Modal */}
      <BottomSheet open={supportOpen} onClose={() => setSupportOpen(false)} title="Liên hệ hỗ trợ">
        <div className="space-y-3">
          <a href={SUPPORT.zalo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-sm font-medium text-brand-dark">Zalo</p>
              <p className="text-xs text-gray-500">Chat trực tuyến</p>
            </div>
          </a>
          <a href={`mailto:${SUPPORT.email}`}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-sm font-medium text-brand-dark">Email</p>
              <p className="text-xs text-gray-500">{SUPPORT.email}</p>
            </div>
          </a>
          <a href={`tel:${SUPPORT.hotline.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="text-xl">📞</span>
            <div>
              <p className="text-sm font-medium text-brand-dark">Hotline</p>
              <p className="text-xs text-gray-500">{SUPPORT.hotline}</p>
            </div>
          </a>
          <p className="text-xs text-gray-400 text-center pt-2">{SUPPORT.hours}</p>
        </div>
      </BottomSheet>

      {/* Logout Confirm */}
      <BottomSheet open={logoutConfirm} onClose={() => setLogoutConfirm(false)} title="Đăng xuất">
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-6">Bạn có chắc muốn đăng xuất?</p>
          <div className="space-y-2">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Đăng Xuất
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setLogoutConfirm(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
