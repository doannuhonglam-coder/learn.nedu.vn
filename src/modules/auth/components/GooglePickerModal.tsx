import { useState } from 'react'

interface GooglePickerModalProps {
  open: boolean
  onClose: () => void
  onPick: (email: string) => void
  loading: boolean
}

// Preset "Google accounts" users can pick from (demo only).
// In production this would be the real Google OAuth screen.
const SAMPLE_ACCOUNTS = [
  { email: 'minhanh@example.com', name: 'Nguyễn Minh Anh', note: 'Học viên hiện tại' },
]

export function GooglePickerModal({ open, onClose, onPick, loading }: GooglePickerModalProps) {
  const [customEmail, setCustomEmail] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  if (!open) return null

  const handlePickCustom = () => {
    if (!customEmail.trim()) return
    onPick(customEmail.trim().toLowerCase())
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(26,24,22,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={loading ? undefined : onClose}
      />

      <div
        className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'fadeUp 0.25s ease' }}
      >
        {/* Google header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="text-[13px] font-medium" style={{ color: '#202124' }}>
              Đăng nhập bằng Google
            </span>
          </div>
          <h3 className="text-[18px] font-normal" style={{ color: '#202124', fontFamily: 'arial, sans-serif' }}>
            Chọn tài khoản
          </h3>
          <p className="text-[13px] text-i3 mt-1">
            để tiếp tục đến <strong className="text-ink">nedu·learn</strong>
          </p>
        </div>

        {/* Account list */}
        <div className="max-h-[320px] overflow-y-auto">
          {SAMPLE_ACCOUNTS.map((acc) => {
            const initials = acc.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
            return (
              <button
                key={acc.email}
                onClick={() => onPick(acc.email)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-60"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #F5B731, #D4920A)' }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-ink font-medium">{acc.name}</div>
                  <div className="text-[12px] text-i3 truncate">{acc.email}</div>
                </div>
              </button>
            )
          })}

          {showCustom ? (
            <div className="px-6 py-3 space-y-2">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="email@gmail.com"
                className="w-full px-3 py-2 rounded-lg text-[13px] focus:outline-none"
                style={{ border: '1.5px solid rgba(0,0,0,0.12)' }}
                autoFocus
              />
              <p className="text-[11px] text-i3">
                💡 Tài khoản mới sẽ được tự tạo từ Gmail của bạn
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handlePickCustom}
                  disabled={loading || !customEmail.includes('@gmail.com')}
                  className="flex-1 py-2 rounded-lg text-[13px] font-medium disabled:opacity-50"
                  style={{ background: '#1A1816', color: '#F5B731' }}
                >
                  {loading ? 'Đang kết nối...' : 'Tiếp tục'}
                </button>
                <button
                  onClick={() => { setShowCustom(false); setCustomEmail('') }}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-i2"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              disabled={loading}
              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-60"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#F5F3EF' }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4A4540">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="text-[14px] text-ink font-medium">Sử dụng tài khoản khác</div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 text-[11px] text-i3 text-center border-t"
          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
        >
          Demo · Mô phỏng Google OAuth
        </div>
      </div>
    </div>
  )
}
