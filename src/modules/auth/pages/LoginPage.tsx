import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { env } from '../../../shared/config/env'
import { authService } from '../services/auth.service'

// LoginPage — Google OAuth only (Phase 1).
// Onboarding:
//   1. Học viên mua khoá ở nedu.vn → person + auth_identity(email) tạo trong
//      auth-central, KHÔNG có auth_method nào.
//   2. Học viên click "Đăng nhập bằng Google" ở đây → redirect auth-central
//      /auth/oauth/google → Google → callback Path 2 link Google method vào
//      identity sẵn có → tokens → redirect về /auth/callback.
//   3. Email chưa từng mua khoá → auth-central trả error=signup_not_allowed
//      → CallbackPage show toast "Liên hệ tư vấn viên".
//
// Mock mode (VITE_ENABLE_MOCKING=true): button "Mock login" gọi MSW handler
// /auth/mock-login để fake tokens — KHÔNG redirect ra external Google URL
// (browser không cho MSW intercept window.location).
export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  // Đã đăng nhập → redirect /home ngay (tránh user thấy login flash khi đã
  // có session persisted).
  useEffect(() => {
    if (useAuthStore.getState().accessToken) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  const handleGoogleLogin = () => {
    const returnTo = `${window.location.origin}/auth/callback`
    window.location.href = authService.googleLoginUrl(returnTo)
  }

  const handleMockLogin = async () => {
    try {
      const res = await fetch('/auth/mock-login', { method: 'POST' })
      if (!res.ok) throw new Error('mock-login failed')
      const data = (await res.json()) as {
        access_token: string
        refresh_token: string
        user: {
          id: string
          person_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
      }
      setSession(data.access_token, data.refresh_token, data.user)
      toast(`Chào ${data.user.full_name ?? 'bạn'} 👋`, 'success')
      navigate('/home', { replace: true })
    } catch {
      toast('Mock login lỗi — kiểm tra MSW handler', 'error')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#FAFAF8' }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display font-bold text-[32px] text-ink mb-1">
            nedu<span className="text-gold">·learn</span>
          </div>
          <p
            className="font-mono text-[11px] uppercase text-i3"
            style={{ letterSpacing: '0.08em' }}
          >
            Bàn Học Cá Nhân
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="font-display text-[22px] font-semibold text-ink mb-1.5">
            Chào mừng 👋
          </h1>
          <p className="text-[13px] text-i3">
            Đăng nhập bằng tài khoản Google đã mua khoá để vào học
          </p>
        </div>

        {/* Google CTA */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-[14px] font-semibold transition-colors"
          style={{
            background: '#FFFFFF',
            color: '#1A1816',
            border: '1.5px solid rgba(26,24,22,0.16)',
          }}
        >
          <GoogleLogo />
          Đăng nhập bằng Google
        </button>

        {/* Mock-mode fallback (dev only) */}
        {env.IS_MOCK && (
          <button
            onClick={handleMockLogin}
            className="w-full mt-3 py-3.5 rounded-xl text-[13px] font-semibold transition-opacity"
            style={{ background: '#FEF4D6', color: '#8B5A15' }}
          >
            🧪 Mock login (dev)
          </button>
        )}

        {/* Help — học viên mới chỉ tạo từ purchase flow ở nedu.vn */}
        <div
          className="mt-6 p-3 rounded-xl text-center"
          style={{
            background: '#FEF4D6',
            border: '1px solid rgba(245,183,49,0.25)',
          }}
        >
          <div
            className="font-mono text-[10px] font-bold uppercase mb-1"
            style={{ color: '#8B5A15', letterSpacing: '0.05em' }}
          >
            💡 Chưa có tài khoản?
          </div>
          <div className="text-[11px]" style={{ color: '#8B5A15' }}>
            Mua khoá học tại{' '}
            <a
              href="https://nedu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              nedu.vn
            </a>{' '}
            — sau khi đặt hàng bằng email Google, bạn có thể đăng nhập tại đây.
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-i3 mt-8">
          Bằng việc đăng nhập, bạn đồng ý với điều khoản của Nedu
        </p>
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.5 4-5.4 6.9-9.3 6.9-5.7 0-10.3-4.6-10.3-10.5S20.3 13.5 26 13.5c2.6 0 5 1 6.8 2.6l5-5C34.5 8 30.4 6 26 6 14.8 6 5.7 15.1 5.7 26.3S14.8 46.5 26 46.5c10.7 0 19.8-8.6 19.8-20.2 0-1.3-.1-2.5-.3-3.7Z"
      />
      <path
        fill="#FF3D00"
        d="M7.7 14.7l5.8 4.2C15.3 15.3 19.4 13.5 24 13.5c2.6 0 5 1 6.8 2.6l5-5C32.5 8 28.4 6 24 6 17.1 6 11.1 9.5 7.7 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 46.5c4.3 0 8.3-1.6 11.4-4.3l-5.3-4.5c-1.7 1.2-4 2-6.1 2-3.8 0-7.7-2.8-9.2-6.7L9.9 36C13 42.2 18 46.5 24 46.5Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.7 2-2 3.7-3.7 4.9l5.3 4.5c-1.4 1.3 5.9-4.3 5.9-12.4 0-1.3-.1-2.5-.3-3.7Z"
      />
    </svg>
  )
}
