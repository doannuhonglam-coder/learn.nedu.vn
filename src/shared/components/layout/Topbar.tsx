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
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-[420px] mx-auto">
        <span className="font-display font-bold text-lg text-brand-dark">Nedu</span>
        <div className="flex items-center gap-3">
          <button onClick={onNotifClick} className="relative p-1">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <NotifBadge />
          </button>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-brand-gold text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
