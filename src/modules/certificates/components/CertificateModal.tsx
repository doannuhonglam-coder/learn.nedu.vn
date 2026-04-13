import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
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
  const [selected, setSelected] = useState<CertificateSummary | null>(null)

  const handleSelect = (cert: CertificateSummary) => {
    if (cert.is_locked) {
      toast(cert.unlock_condition || 'Chứng chỉ chưa được mở khóa', 'info')
      return
    }
    setSelected(cert)
  }

  return (
    <BottomSheet open={open} onClose={() => { setSelected(null); onClose() }} title="Chứng chỉ">
      {selected ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="text-xs text-brand-gold font-medium">← Quay lại</button>
          <div className="text-center py-4">
            <p className="text-5xl mb-3">🎓</p>
            <p className="font-display font-bold text-lg text-brand-dark">{selected.title}</p>
            <p className="text-sm text-gray-500 mt-1">{selected.course_name}</p>
            {selected.certificate_no && (
              <p className="text-xs text-gray-400 mt-2">Mã: {selected.certificate_no}</p>
            )}
            {selected.issued_at && (
              <p className="text-xs text-gray-400">Cấp ngày: {new Date(selected.issued_at).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="font-display font-semibold text-brand-dark">Nguyễn Minh Anh</p>
            <p className="text-xs text-gray-500 mt-1">đã hoàn thành xuất sắc khoá học</p>
            <p className="font-semibold text-sm text-brand-dark mt-1">{selected.course_name}</p>
          </div>
          <Button className="w-full" onClick={() => toast('PDF đang được tạo...', 'success')}>
            Tải PDF ↓
          </Button>
        </div>
      ) : isLoading ? (
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
