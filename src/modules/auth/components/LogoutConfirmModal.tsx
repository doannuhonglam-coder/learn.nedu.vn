import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../services/auth.service'

interface LogoutConfirmModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Apple-style logout confirmation sheet.
 *
 * Pattern iOS: 2 hành động — destructive (red) trên, cancel (gray) dưới.
 * Không dùng `window.confirm` (browser native dialog UX thấp, không match
 * brand). Backed bởi `BottomSheet` shared component.
 *
 * Flow:
 *   1. User click → modal open
 *   2. Click "Đăng xuất" → BE call /auth/logout với refresh_token để revoke
 *      family chain → clear local store → navigate /login.
 *   3. Nếu BE fail (vault unreachable / token already revoked) → vẫn force
 *      clear local store + navigate. User-facing: luôn thoát thành công.
 */
export function LogoutConfirmModal({ open, onClose }: LogoutConfirmModalProps) {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    setSubmitting(true)
    const access = useAuthStore.getState().accessToken
    const refresh = useAuthStore.getState().refreshToken
    try {
      if (access && refresh) {
        await authService.logout(access, { refresh_token: refresh })
      }
    } catch {
      // Silent — local clear vẫn chạy. BE-side revocation thất bại không
      // được block UX logout (vault/auth-central down ko làm user kẹt).
    } finally {
      clearSession()
      setSubmitting(false)
      onClose()
      toast('Đã đăng xuất', 'success')
      navigate('/login', { replace: true })
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Đăng xuất?">
      <div className="space-y-4">
        <p className="text-[13px] text-i2 leading-relaxed text-center">
          Bạn sẽ phải đăng nhập lại lần tới. Lịch học, hồ sơ và tiến trình
          vẫn được lưu trong tài khoản.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {/* Destructive action (red) — Apple convention */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-3.5 rounded-[14px] text-[14px] font-semibold transition-colors disabled:opacity-60"
            style={{
              background: '#DC2626',
              color: '#FFFFFF',
            }}
          >
            {submitting ? 'Đang đăng xuất…' : 'Đăng xuất'}
          </button>

          {/* Cancel — secondary neutral */}
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full py-3.5 rounded-[14px] text-[14px] font-semibold transition-colors disabled:opacity-60"
            style={{
              background: '#F5F3EF',
              color: '#1A1816',
              border: '1.5px solid rgba(26,24,22,0.10)',
            }}
          >
            Huỷ
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
