import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  {
    path: '/home',
    label: 'Trang chủ',
    icon: (
      <path
        d="M3 12L12 3L21 12V20C21 20.6 20.6 21 20 21H15V16H9V21H4C3.4 21 3 20.6 3 20V12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    path: '/courses',
    label: 'Khoá học',
    icon: (
      <>
        <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M6.5 2H20V22H6.5C5.1 22 4 20.9 4 19.5V4.5C4 3.1 5.1 2 6.5 2Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    path: '/schedule',
    label: 'Lịch học',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8" />
        <line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="14" r="1.2" fill="currentColor" />
        <circle cx="12" cy="14" r="1.2" fill="currentColor" />
        <circle cx="16" cy="14" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    path: '/profile',
    label: 'Hồ sơ',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <path d="M4 20C4 17 7.6 15 12 15C16.4 15 20 17 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </>
    ),
  },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 flex border-t"
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(26,24,22,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center pt-2.5 pb-2 transition-colors"
            style={{ color: isActive ? '#D4920A' : '#8A8480' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{
                strokeWidth: isActive ? 2.2 : 1.8,
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform .15s',
                marginBottom: '3px',
              }}
            >
              {tab.icon}
            </svg>
            <span
              className="text-[9px] font-semibold uppercase"
              style={{ letterSpacing: '0.03em' }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
