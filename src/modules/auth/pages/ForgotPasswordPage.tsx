import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import { authService } from '../services/auth.service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch {
      // ignore — always show success
    }
    toast('Nếu email tồn tại, bạn sẽ nhận được link đổi mật khẩu', 'info')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-brand-dark">Nedu</h1>
          <p className="text-gray-500 text-sm mt-2">Đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Gửi link đặt lại mật khẩu
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-brand-gold hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
