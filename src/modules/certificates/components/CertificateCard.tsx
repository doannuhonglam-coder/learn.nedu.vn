import type { CertificateSummary } from '../../../shared/types'

interface CertificateCardProps {
  certificate: CertificateSummary
  onSelect: (cert: CertificateSummary) => void
}

export function CertificateCard({ certificate, onSelect }: CertificateCardProps) {
  return (
    <button
      onClick={() => onSelect(certificate)}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors
        ${certificate.is_locked ? 'opacity-60 border-gray-100 bg-gray-50' : 'border-amber-200 bg-amber-50 hover:bg-amber-100'}`}
    >
      <span className="text-2xl flex-shrink-0">
        {certificate.is_locked ? '🔒' : '🎓'}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${certificate.is_locked ? 'text-gray-500' : 'text-brand-dark'}`}>
          {certificate.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{certificate.course_name}</p>
        {certificate.issued_at && (
          <p className="text-[11px] text-gray-400 mt-0.5">
            Cấp ngày: {new Date(certificate.issued_at).toLocaleDateString('vi-VN')}
          </p>
        )}
        {certificate.is_locked && certificate.unlock_condition && (
          <p className="text-[11px] text-amber-600 mt-0.5">{certificate.unlock_condition}</p>
        )}
      </div>
    </button>
  )
}
