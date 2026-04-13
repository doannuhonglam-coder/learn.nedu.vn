import { useQuery } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { toast } from '../../../shared/components/ui/Toast'
import { CertificateCard } from './CertificateCard'
import { certificatesService } from '../services/certificates.service'
import type { CertificateSummary } from '../../../shared/types'

interface CertificateModalProps {
  open: boolean
  onClose: () => void
}

export function CertificateModal({ open, onClose }: CertificateModalProps) {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificatesService.getCertificates,
    enabled: open,
  })

  const handleSelect = (cert: CertificateSummary) => {
    if (cert.is_locked) {
      toast(cert.unlock_condition || 'Chứng chỉ chưa được mở khóa', 'info')
      return
    }
    toast('Xem chứng chỉ — Tải PDF đang phát triển (P2)', 'info')
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Chứng chỉ">
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : !certificates || certificates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">Chưa có chứng chỉ nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </BottomSheet>
  )
}
