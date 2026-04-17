import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'
import { NotifBadge } from '../../../modules/notifications/components/NotifBadge'

interface TopbarProps {
  onNotifClick: () => void
}

export function Topbar({ onNotifClick }: TopbarProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const initials = user?.full_name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(250,250,248,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(26,24,22,0.10)',
      }}
    >
      <div className="flex items-center justify-between h-[60px] px-[18px] max-w-[420px] mx-auto">
        <div className="font-display font-bold text-[18px] text-obs">
          nedu<span className="text-gold">·learn</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNotifClick}
            className="relative w-9 h-9 bg-surface border border-border rounded-full flex items-center justify-center"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 11C18 8.1 16.2 5.6 13.5 4.7V4C13.5 3.2 12.8 2.5 12 2.5C11.2 2.5 10.5 3.2 10.5 4V4.7C7.8 5.6 6 8.1 6 11V16L4 18H20L18 16V11Z"
                stroke="#1A1816"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20"
                stroke="#1A1816"
                strokeWidth="1.75"
                fill="none"
              />
            </svg>
            <NotifBadge />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 border-white"
            style={{
              background: 'linear-gradient(135deg,#F5B731,#D4920A)',
              color: '#1A1816',
              boxShadow: '0 2px 8px rgba(245,183,49,0.35)',
            }}
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
