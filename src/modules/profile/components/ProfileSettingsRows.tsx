import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { authService } from '../../auth/services/auth.service'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { SUPPORT } from '../../../shared/constants/support.constants'

interface ProfileSettingsRowsProps {
  email: string
}

// Squircle icon components matching HTML template
function SquircleIcon({ type }: { type: 'invoice' | 'bell' | 'email' | 'globe' | 'lock' | 'chat' }) {
  const gradients = {
    invoice: { from: '#94A3B8', to: '#475569' },
    bell: { from: '#F5B731', to: '#D4920A' },
    email: { from: '#60A5FA', to: '#1D4ED8' },
    globe: { from: '#2DD4BF', to: '#0D9488' },
    lock: { from: '#94A3B8', to: '#475569' },
    chat: { from: '#2C2A26', to: '#1A1816' },
  }
  const g = gradients[type]
  const uid = `sq-${type}`

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
        <linearGradient id={`${uid}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="9" fill={`url(#${uid}-g)`} />
      <rect width="36" height="19" rx="9" fill={`url(#${uid}-h)`} />

      {type === 'invoice' && (
        <>
          <rect x="8" y="7" width="20" height="24" rx="2.5" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="12" y1="18" x2="24" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="12" y1="22" x2="19" y2="22" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {type === 'bell' && (
        <>
          <path d="M26 16C26 12.5 24 9.5 21 8.5V8C21 7.2 20.3 6.5 19.5 6.5C18.7 6.5 18 7.2 18 8V8.5C15 9.5 13 12.5 13 16V21L11 23H28L26 21V16Z" fill="white" opacity="0.92" />
          <path d="M16.5 23C16.5 24.4 17.8 25.5 19.5 25.5C21.2 25.5 22.5 24.4 22.5 23" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {type === 'email' && (
        <>
          <rect x="5" y="11" width="26" height="16" rx="2.5" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="1.5" />
          <path d="M5 13.5L18 22L31 13.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {type === 'globe' && (
        <>
          <circle cx="18" cy="18" r="10" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
          <ellipse cx="18" cy="18" rx="5" ry="10" stroke="white" strokeWidth="1.5" fill="none" />
          <line x1="8" y1="18" x2="28" y2="18" stroke="white" strokeWidth="1.5" />
        </>
      )}
      {type === 'lock' && (
        <>
          <rect x="9" y="18" width="18" height="13" rx="3" fill="rgba(255,255,255,0.9)" />
          <path d="M13 18V14C13 9.6 23 9.6 23 14V18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="15" y="22" width="6" height="5" rx="2" fill="rgba(71,85,105,0.55)" />
        </>
      )}
      {type === 'chat' && (
        <>
          <path d="M7 9C7 7.9 7.9 7 9 7H27C28.1 7 29 7.9 29 9V22C29 23.1 28.1 24 27 24H13L7 29V9Z" fill="rgba(255,255,255,0.92)" />
          <line x1="12" y1="13" x2="24" y2="13" stroke="rgba(31,107,72,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="17" x2="20" y2="17" stroke="rgba(31,107,72,0.45)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className="relative rounded-[12px] flex-shrink-0 transition-colors"
      style={{
        width: 42,
        height: 24,
        background: on ? '#F5B731' : 'rgba(26,24,22,0.10)',
      }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform"
        style={{
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  )
}

export function ProfileSettingsRows({ email }: ProfileSettingsRowsProps) {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)
  const [supportOpen, setSupportOpen] = useState(false)
  const [notifOn, setNotifOn] = useState(true)
  const [emailOn, setEmailOn] = useState(true)

  const handleChangePassword = async () => {
    try {
      await authService.forgotPassword(email)
      toast('🔒 Đổi mật khẩu - check email', 'success')
    } catch {
      toast('Có lỗi xảy ra', 'error')
    }
  }

  const handleLogout = () => {
    if (confirm('Đăng xuất?')) {
      clearSession()
      toast('👋 Đã đăng xuất · Hẹn gặp lại!', 'info')
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="px-4 mt-3">
      <div
        className="bg-surface rounded-[14px] px-4 py-1"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        <Row icon={<SquircleIcon type="invoice" />} title="Thanh Toán & Hóa Đơn"
          subtitle="Lịch sử · Chờ TT · Tải hóa đơn" onClick={() => navigate('/payments')}
          trailing={<span className="text-[14px] text-i3">›</span>}
        />
        <Row icon={<SquircleIcon type="bell" />} title="Thông báo"
          subtitle="Lịch học · Deadline · Học phí"
          trailing={<Toggle on={notifOn} onChange={() => setNotifOn(!notifOn)} />}
        />
        <Row icon={<SquircleIcon type="email" />} title="Email nhắc nhở"
          subtitle="Trước deadline 48h"
          trailing={<Toggle on={emailOn} onChange={() => setEmailOn(!emailOn)} />}
        />
        <Row icon={<SquircleIcon type="globe" />} title="Ngôn ngữ"
          subtitle="Tiếng Việt" onClick={() => toast('🌐 Ngôn ngữ: Tiếng Việt', 'info')}
          trailing={<span className="text-[14px] text-i3">›</span>}
        />
        <Row icon={<SquircleIcon type="lock" />} title="Đổi mật khẩu"
          subtitle="Gửi link qua email" onClick={handleChangePassword}
          trailing={<span className="text-[14px] text-i3">›</span>}
        />
        <Row icon={<SquircleIcon type="chat" />} title="Liên hệ hỗ trợ"
          subtitle="Zalo · Email · Hotline" onClick={() => setSupportOpen(true)}
          trailing={<span className="text-[14px] text-i3">›</span>}
          isLast
        />
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-lg font-semibold text-[14px] mt-4 mb-5"
        style={{ background: '#FDECEA', color: '#C0392B' }}
      >
        Đăng Xuất
      </button>

      <BottomSheet open={supportOpen} onClose={() => setSupportOpen(false)} title="Liên Hệ Hỗ Trợ">
        <div className="space-y-3 pb-4">
          <a href={SUPPORT.zalo} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-s2 rounded-xl">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-sm font-semibold text-ink">Zalo</p>
              <p className="text-xs text-i3">Chat trực tuyến</p>
            </div>
          </a>
          <a href={`mailto:${SUPPORT.email}`}
            className="flex items-center gap-3 p-4 bg-s2 rounded-xl">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-sm font-semibold text-ink">Email</p>
              <p className="text-xs text-i3">{SUPPORT.email}</p>
            </div>
          </a>
          <a href={`tel:${SUPPORT.hotline.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-4 bg-s2 rounded-xl">
            <span className="text-xl">📞</span>
            <div>
              <p className="text-sm font-semibold text-ink">Hotline</p>
              <p className="text-xs text-i3">{SUPPORT.hotline}</p>
            </div>
          </a>
          <p className="text-xs text-i3 text-center pt-2">{SUPPORT.hours}</p>
        </div>
      </BottomSheet>
    </div>
  )
}

function Row({
  icon,
  title,
  subtitle,
  onClick,
  trailing,
  isLast,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick?: () => void
  trailing: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-[13px] ${onClick ? 'cursor-pointer' : ''}`}
      style={isLast ? {} : { borderBottom: '1px solid rgba(26,24,22,0.10)' }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-[14px] font-medium text-ink">{title}</div>
          <div className="text-[11px] text-i3 mt-px">{subtitle}</div>
        </div>
      </div>
      {trailing}
    </div>
  )
}
