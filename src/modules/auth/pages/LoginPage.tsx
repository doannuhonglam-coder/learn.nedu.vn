import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../services/auth.service'

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      const res = await authService.login(email, password)
      setSession(res.access_token, res.user)
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      if (error.code === 'INVALID_CREDENTIALS' || error.message?.includes('401')) {
        toast('Email hoặc mật khẩu không đúng', 'error')
      } else {
        toast('Tài khoản đã bị vô hiệu hóa. Liên hệ Nedu để được hỗ trợ.', 'error')
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
          <p className="text-gray-500 text-sm mt-1">Student Learner Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Đăng nhập
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-brand-gold hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  )
}
