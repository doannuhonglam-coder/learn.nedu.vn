import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { env } from '../../../shared/config/env'
import { authService } from '../services/auth.service'

// LoginPage — email + password only (US-40).
// Học viên có tài khoản đã được provision tự động khi ops chốt enrollment
// → email kích hoạt gửi từ auth-central → click → set password → auto-login.
// KHÔNG có self-signup, KHÔNG có Google OAuth Phase 1.
//
// Mock mode (VITE_ENABLE_MOCKING=true): pre-fill credentials khớp với mock
// auth handler — dev chỉ cần bấm "Đăng nhập" để vào ngay, không gõ tay.
// Credentials accepted bởi mocks/handlers/auth.handlers.ts:
//   - minhanh@example.com / password123  (default mock user)
//   - test@nedu.vn / password123
const MOCK_DEFAULT_EMAIL = 'minhanh@example.com'
const MOCK_DEFAULT_PASSWORD = 'password123'

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState(env.IS_MOCK ? MOCK_DEFAULT_EMAIL : '')
  const [password, setPassword] = useState(env.IS_MOCK ? MOCK_DEFAULT_PASSWORD : '')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      const res = await authService.login(email, password)
      setSession(res.access_token, res.refresh_token, res.user)
      toast(`Chào ${res.user.full_name ?? 'bạn'} 👋`, 'success')
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const error = err as { status?: number; error?: string }
      if (error.status === 401) {
        toast('Email hoặc mật khẩu không đúng', 'error')
      } else if (error.status === 423) {
        toast('Tài khoản tạm khóa do nhập sai nhiều lần. Thử lại sau 15 phút.', 'error')
      } else {
        toast('Không thể đăng nhập, vui lòng thử lại', 'error')
      }
    } finally {
      setLoading(false)
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
            Đăng nhập bằng email + mật khẩu để vào học
          </p>
        </div>

        {/* Email/password form (primary) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
              style={{ letterSpacing: '0.06em' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nedu.vn"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-[14px] text-ink focus:outline-none transition-colors"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(26,24,22,0.10)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D4920A')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,22,0.10)')}
            />
          </div>

          <div>
            <label
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
              style={{ letterSpacing: '0.06em' }}
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-14 rounded-xl text-[14px] text-ink focus:outline-none transition-colors"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(26,24,22,0.10)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4920A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,22,0.10)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-i2"
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <div className="text-right pt-1">
            <Link to="/forgot-password" className="text-[12px] font-medium text-gold-d">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-60 mt-2"
            style={{ background: '#1A1816', color: '#F5B731' }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Help — học viên mới được tạo từ ops, không tự signup */}
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
            Liên hệ tư vấn viên Nedu — khi enroll khoá, hệ thống sẽ gửi email kích hoạt cho bạn
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
