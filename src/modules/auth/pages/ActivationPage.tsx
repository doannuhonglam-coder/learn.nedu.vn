import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
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
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-brand-dark">Nedu</h1>
          <p className="text-gray-500 text-sm mt-2">Kích hoạt tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
          />
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Kích hoạt tài khoản
          </Button>
        </form>
      </div>
    </div>
  )
}
