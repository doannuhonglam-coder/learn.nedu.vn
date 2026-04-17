import { useQuery } from '@tanstack/react-query'
import { toast } from '../../../shared/components/ui/Toast'
import { certificatesService } from '../../certificates/services/certificates.service'
import type { CertificateSummary } from '../../../shared/types'

interface CertificatesListProps {
  onViewAll: () => void
}

// 3D Apple-style squircle icon for certificate types
function CertIcon({ type, id }: { type: 'medal' | 'sprout' | 'grad'; id: string }) {
  const gradients = {
    medal: { from: '#FDE68A', to: '#B45309' },
    sprout: { from: '#2C2A26', to: '#1A1816' },
    grad: { from: '#818CF8', to: '#4338CA' },
  }
  const g = gradients[type]
  const uid = `cert-${id}`

  return (
    <svg width="42" height="42" viewBox="0 0 48 48">
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
      <rect width="48" height="48" rx="12" fill={`url(#${uid}-g)`} />
      <rect width="48" height="26" rx="12" fill={`url(#${uid}-h)`} />

      {type === 'medal' && (
        <>
          <path d="M18 10H30L32 18H16L18 10Z" fill="rgba(255,255,255,0.45)" stroke="white" strokeWidth="1.5" />
          <circle cx="24" cy="30" r="11" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="2" />
          <circle cx="24" cy="30" r="7" fill="rgba(255,255,255,0.3)" />
          <text x="24" y="34.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="rgba(180,83,9,0.8)" fontFamily="serif">1st</text>
        </>
      )}
      {type === 'sprout' && (
        <>
          <line x1="24" y1="38" x2="24" y2="18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 22C24 22 14 20 13 11C17 11 24 15 24 22Z" fill="white" opacity="0.9" />
          <path d="M24 26C24 26 34 23 35 14C31 14 24 18 24 26Z" fill="white" opacity="0.75" />
        </>
      )}
      {type === 'grad' && (
        <>
          <polygon points="24,13 40,22 24,31 8,22" fill="white" opacity="0.95" />
          <path d="M16,26 L16,34 C16,34 19.5,38 24,38 C28.5,38 32,34 32,34 L32,26" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
          <line x1="40" y1="22" x2="40" y2="31" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
        </>
      )}
    </svg>
  )
}

function LockIcon({ id }: { id: string }) {
  const uid = `lock-${id}`
  return (
    <svg width="40" height="40" viewBox="0 0 48 48">
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id={`${uid}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${uid}-g)`} />
      <rect width="48" height="26" rx="12" fill={`url(#${uid}-h)`} />
      <rect x="13" y="23" width="22" height="16" rx="3.5" fill="rgba(255,255,255,0.9)" />
      <path d="M17 23V18C17 12.5 31 12.5 31 18V23" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="21" y="29" width="6" height="5" rx="2" fill="rgba(71,85,105,0.6)" />
    </svg>
  )
}

const iconTypes: Array<'medal' | 'sprout' | 'grad'> = ['medal', 'sprout', 'grad']

export function CertificatesList({ onViewAll }: CertificatesListProps) {
  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificatesService.getCertificates,
  })

  const handleCertClick = (cert: CertificateSummary) => {
    if (cert.is_locked) {
      toast(cert.unlock_condition || 'Chứng chỉ chưa được mở khóa', 'info')
      return
    }
    onViewAll()
  }

  const unlocked = (certificates || []).filter((c) => !c.is_locked)
  const locked = (certificates || []).filter((c) => c.is_locked)

  if (!certificates || certificates.length === 0) return null

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">
          Chứng Chỉ & Thành Tích
        </h2>
        <button onClick={onViewAll} className="text-[12px] font-medium text-gold-d">
          Xem tất cả →
        </button>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {unlocked.map((cert, i) => {
          const iconType = iconTypes[i % iconTypes.length]
          const issuedDate = cert.issued_at ? new Date(cert.issued_at) : null
          const dateStr = issuedDate
            ? `${String(issuedDate.getMonth() + 1).padStart(2, '0')} · ${issuedDate.getFullYear()}`
            : ''

          return (
            <button
              key={cert.id}
              onClick={() => handleCertClick(cert)}
              className="flex-shrink-0 w-[140px] rounded-[14px] px-3 py-[14px] text-center relative overflow-hidden transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1A1816, #2C2A26)',
              }}
            >
              <div
                className="absolute -top-[20px] -right-[20px] w-20 h-20 rounded-full pointer-events-none"
                style={{ background: 'rgba(245,183,49,0.08)' }}
              />
              <div className="relative z-[1] flex justify-center mb-2">
                <CertIcon type={iconType} id={cert.id} />
              </div>
              <div
                className="relative z-[1] text-[11px] font-semibold text-white leading-[1.35] mb-1"
                style={{ minHeight: 30 }}
              >
                {cert.title}
              </div>
              {dateStr && (
                <div
                  className="relative z-[1] font-mono text-[9px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {dateStr}
                </div>
              )}
            </button>
          )
        })}

        {locked.map((cert) => (
          <button
            key={cert.id}
            onClick={() => handleCertClick(cert)}
            className="flex-shrink-0 w-[140px] rounded-[14px] px-3 py-[14px] text-center transition-opacity"
            style={{
              background: '#F5F3EF',
              border: '1.5px dashed rgba(26,24,22,0.15)',
              opacity: 0.7,
            }}
          >
            <div className="flex justify-center mb-2">
              <LockIcon id={cert.id} />
            </div>
            <div className="text-[11px] font-medium text-i3 leading-[1.35]">
              {cert.title.replace('Chứng chỉ ', '')}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
