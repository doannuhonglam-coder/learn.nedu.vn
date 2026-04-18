import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../services/auth.service'
import { signInWithGoogle } from '../services/google-auth'
import { GooglePickerModal } from '../components/GooglePickerModal'

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleOpen, setGoogleOpen] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      const res = await authService.login(email, password)
      setSession(res.access_token, res.user)
      toast(`Chào ${res.user.full_name} 👋`, 'success')
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      if (error.code === 'INVALID_CREDENTIALS' || error.message?.includes('401')) {
        toast('Email hoặc mật khẩu không đúng', 'error')
      } else {
        toast('Không thể đăng nhập, vui lòng thử lại', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGooglePick = async (gmail: string) => {
    setGoogleLoading(true)
    try {
      const res = await signInWithGoogle(gmail)
      setSession(res.access_token, res.user)
      if (res.is_new_account) {
        toast(`Tài khoản mới đã được tạo · Chào ${res.user.full_name} 🎉`, 'success')
      } else {
        toast(`Chào ${res.user.full_name} 👋`, 'success')
      }
      setGoogleOpen(false)
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      toast(error.message || 'Không thể kết nối với Google', 'error')
    } finally {
      setGoogleLoading(false)
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
            Đăng nhập bằng Google · Chưa có tài khoản? Tự tạo ngay
          </p>
        </div>

        {/* Google Sign-In Button (primary) */}
        <button
          onClick={() => setGoogleOpen(true)}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium transition-shadow hover:shadow-md"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(26,24,22,0.12)',
            color: '#1A1816',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Đăng nhập với Google
        </button>

        <div
          className="mt-3 p-3 rounded-xl text-center"
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
            Đăng nhập bằng Gmail — tài khoản sẽ tự tạo nếu chưa có
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(26,24,22,0.10)' }} />
          <span className="text-[11px] text-i3">hoặc</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(26,24,22,0.10)' }} />
        </div>

        {/* Email/password toggle */}
        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full text-center text-[13px] font-medium text-i2"
          >
            Đăng nhập với Email & Mật khẩu
          </button>
        ) : (
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

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="w-full text-center text-[12px] font-medium text-i3 pt-1"
            >
              ← Quay lại
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] text-i3 mt-8">
          Bằng việc đăng nhập, bạn đồng ý với điều khoản của Nedu
        </p>
      </div>

      <GooglePickerModal
        open={googleOpen}
        loading={googleLoading}
        onClose={() => setGoogleOpen(false)}
        onPick={handleGooglePick}
      />
    </div>
  )
}
