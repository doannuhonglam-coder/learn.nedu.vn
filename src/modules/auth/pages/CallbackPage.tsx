import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../services/auth.service'

// /auth/callback — handle URL fragment từ auth-central /auth/oauth/google/callback.
//
// Fragment shape (xem auth-central/src/routes/auth.ts:1113-1118):
//   #access_token=eyJ...&refresh_token=eyJ...&token_type=Bearer
//
// Auth-central có thể kèm `?error=signup_not_allowed|oauth_failed|cancelled`
// trong query (không phải fragment) khi flow lỗi → user thấy toast + back to /login.
//
// Fragment-based delivery (KHÔNG dùng query) là chuẩn OAuth implicit grant:
// tokens không log ở proxy/CDN và không bị server-side framework đọc nhầm.
export default function CallbackPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  // StrictMode + dev fast-refresh sẽ chạy useEffect 2 lần. Token chỉ valid 1
  // lần (refresh_token rotate-and-revoke) → dedupe trong cùng tab.
  const consumedRef = useRef(false)

  useEffect(() => {
    if (consumedRef.current) return
    consumedRef.current = true

    void (async () => {
      // ── Step 1: check query error first ──────────────────────
      const query = new URLSearchParams(window.location.search)
      const error = query.get('error')
      if (error) {
        const message =
          error === 'signup_not_allowed'
            ? 'Email chưa được đăng ký. Liên hệ tư vấn viên Nedu để mua khoá học trước.'
            : error === 'oauth_failed'
              ? 'Đăng nhập Google thất bại, vui lòng thử lại'
              : error === 'cancelled'
                ? 'Bạn đã huỷ đăng nhập Google'
                : 'Có lỗi xảy ra trong quá trình đăng nhập'
        toast(message, 'error')
        navigate('/login', { replace: true })
        return
      }

      // ── Step 2: parse fragment tokens ────────────────────────
      const fragment = new URLSearchParams(window.location.hash.slice(1))
      const accessToken = fragment.get('access_token')
      const refreshToken = fragment.get('refresh_token')

      if (!accessToken || !refreshToken) {
        toast('Đăng nhập không thành công, vui lòng thử lại', 'error')
        navigate('/login', { replace: true })
        return
      }

      // ── Step 3: fetch user info qua /auth/me ────────────────
      // Fragment KHÔNG chứa user info → bắt buộc /me call để có
      // { id, person_id, email, full_name, avatar_url } trước khi setSession.
      try {
        const user = await authService.me(accessToken)
        setSession(accessToken, refreshToken, user)

        // Xoá fragment khỏi URL bar (security: tokens không nên persist trong
        // location.hash sau khi consume).
        window.history.replaceState(null, '', '/home')
        toast(`Chào ${user.full_name ?? 'bạn'} 👋`, 'success')
        navigate('/home', { replace: true })
      } catch {
        toast('Không lấy được thông tin tài khoản, vui lòng thử lại', 'error')
        navigate('/login', { replace: true })
      }
    })()
  }, [navigate, setSession])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#FAFAF8' }}
    >
      <Spinner size="lg" />
      <p className="text-[13px] text-i3 mt-4">Đang hoàn tất đăng nhập…</p>
    </div>
  )
}
