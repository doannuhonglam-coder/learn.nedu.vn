import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { authService } from '../services/auth.service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch {
      // ignore — always show success for security
    }
    toast('Nếu email tồn tại, bạn sẽ nhận được link đổi mật khẩu', 'info')
    setSent(true)
    setLoading(false)
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
            Quên mật khẩu?
          </h1>
          <p className="text-[13px] text-i3">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {sent ? (
          <div
            className="rounded-xl p-5 text-center"
            style={{
              background: '#FEF4D6',
              border: '1px solid rgba(245,183,49,0.25)',
            }}
          >
            <div className="text-[32px] mb-2">📧</div>
            <p className="font-display text-[15px] font-semibold text-ink mb-1">
              Đã gửi email
            </p>
            <p className="text-[12px]" style={{ color: '#8B5A15' }}>
              Kiểm tra hộp thư {email}
            </p>
          </div>
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
                className="w-full px-4 py-3 rounded-xl text-[14px] text-ink focus:outline-none transition-colors"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(26,24,22,0.10)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4920A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,22,0.10)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-60 mt-2"
              style={{ background: '#1A1816', color: '#F5B731' }}
            >
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-[12px] font-medium text-gold-d">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
