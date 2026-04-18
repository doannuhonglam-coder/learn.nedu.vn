import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../services/auth.service'

export default function ActivationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const setSession = useAuthStore((s) => s.setSession)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await authService.activate(token, password)
      setSession(res.access_token, res.user)
      toast('Chào mừng đến với Nedu! 🎉', 'success')
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const apiErr = err as { code?: string }
      if (apiErr.code === 'TOKEN_EXPIRED') {
        setError('Link đã hết hạn · Liên hệ Nedu để được gửi lại')
      } else {
        setError('Link không hợp lệ')
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

        <div className="text-center mb-8">
          <h1 className="font-display text-[22px] font-semibold text-ink mb-1.5">
            Kích hoạt tài khoản 🎉
          </h1>
          <p className="text-[13px] text-i3">
            Tạo mật khẩu để hoàn tất
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
              style={{ letterSpacing: '0.06em' }}
            >
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 8 ký tự"
              required
              minLength={8}
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
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              className="w-full px-4 py-3 rounded-xl text-[14px] text-ink focus:outline-none transition-colors"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(26,24,22,0.10)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D4920A')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,22,0.10)')}
            />
          </div>

          {error && (
            <div
              className="rounded-lg p-3 text-[12px]"
              style={{
                background: '#FDECEA',
                color: '#C0392B',
                border: '1px solid rgba(185,79,46,0.2)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-60 mt-2"
            style={{ background: '#1A1816', color: '#F5B731' }}
          >
            {loading ? 'Đang kích hoạt...' : 'Kích hoạt tài khoản'}
          </button>
        </form>
      </div>
    </div>
  )
}
