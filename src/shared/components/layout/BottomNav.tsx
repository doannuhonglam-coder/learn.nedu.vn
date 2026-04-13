import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/home', label: 'Trang Chủ', icon: '🏠' },
  { path: '/courses', label: 'Khoá Học', icon: '📚' },
  { path: '/schedule', label: 'Lịch Học', icon: '📅' },
  { path: '/profile', label: 'Hồ Sơ', icon: '👤' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors
                ${isActive ? 'text-brand-gold' : 'text-gray-400'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
