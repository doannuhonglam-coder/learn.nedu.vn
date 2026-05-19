// Apple-style squircle icons (3D-style with gradient + gloss highlight)

type IconKind =
  | 'leaf'      // BaZi / nature
  | 'medal'     // Certificates
  | 'flame'     // Streak
  | 'gear'      // Settings
  | 'chat'      // Support

const GRADIENTS: Record<IconKind, { from: string; to: string }> = {
  leaf: { from: '#34D399', to: '#059669' },
  medal: { from: '#FDE68A', to: '#B45309' },
  flame: { from: '#FB923C', to: '#C2410C' },
  gear: { from: '#A78BFA', to: '#6D28D9' },
  chat: { from: '#34D399', to: '#0D9488' },
}

interface SquircleIconProps {
  kind: IconKind
  size?: number
}

export function SquircleIcon({ kind, size = 36 }: SquircleIconProps) {
  const g = GRADIENTS[kind]
  const uid = `sq-${kind}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.from} />
          <stop offset="100%" stopColor={g.to} />
        </linearGradient>
        <linearGradient id={`${uid}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id={`${uid}-sh`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect width="36" height="36" rx="9" fill={`url(#${uid}-g)`} filter={`url(#${uid}-sh)`} />
      <rect width="36" height="19" rx="9" fill={`url(#${uid}-h)`} />

      {kind === 'leaf' && (
        <>
          <path
            d="M18 27C18 27 10 22 10 16C10 12 13 9 18 9C23 9 26 12 26 16C26 22 18 27 18 27Z"
            fill="white"
            opacity="0.95"
          />
          <line x1="18" y1="27" x2="18" y2="15" stroke="rgba(31,107,72,0.45)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="18" y1="19" x2="15" y2="16" stroke="rgba(31,107,72,0.3)" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      {kind === 'medal' && (
        <>
          <path d="M14 7H22L23.5 12H12.5L14 7Z" fill="rgba(255,255,255,0.45)" stroke="white" strokeWidth="1.2" />
          <circle cx="18" cy="22" r="8" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" />
          <circle cx="18" cy="22" r="5" fill="rgba(255,255,255,0.3)" />
          <text x="18" y="25" textAnchor="middle" fontSize="7" fontWeight="800" fill="rgba(180,83,9,0.85)" fontFamily="serif">
            1st
          </text>
        </>
      )}

      {kind === 'flame' && (
        <>
          <path
            d="M18 28C13 28 10 24.5 10 21C10 18 11.5 16 14 14.5C13.5 16.5 14 18 15 18.5C15 16 16.5 13 18 11C19 13 21 14.5 22 16C24 17 26 19 26 22C26 25.5 23 28 18 28Z"
            fill="white"
            opacity="0.95"
          />
          <path
            d="M18 26C16 26 15 24.5 15 23C15 21.5 16 20.5 17 19.5C17 21 17.5 21.5 18 22C18.5 21 19 20 19.5 19C20.5 20 21 21.5 21 22.5C21 24.5 20 26 18 26Z"
            fill="rgba(251,146,60,0.7)"
          />
        </>
      )}

      {kind === 'gear' && (
        <>
          <circle cx="18" cy="18" r="5.5" fill="white" opacity="0.95" />
          <circle cx="18" cy="18" r="2.5" fill={`url(#${uid}-g)`} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x1 = 18 + Math.cos(rad) * 6.5
            const y1 = 18 + Math.sin(rad) * 6.5
            const x2 = 18 + Math.cos(rad) * 10
            const y2 = 18 + Math.sin(rad) * 10
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
              />
            )
          })}
        </>
      )}

      {kind === 'chat' && (
        <>
          <path
            d="M7 11C7 9.3 8.3 8 10 8H26C27.7 8 29 9.3 29 11V22C29 23.7 27.7 25 26 25H15L9 29V11Z"
            fill="white"
            opacity="0.95"
          />
          <line x1="12" y1="14" x2="24" y2="14" stroke="rgba(13,148,136,0.6)" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="12" y1="18" x2="20" y2="18" stroke="rgba(13,148,136,0.45)" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
