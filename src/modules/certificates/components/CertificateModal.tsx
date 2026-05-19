import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { toast } from '../../../shared/components/ui/Toast'
import { CertificateCard } from './CertificateCard'
import { PrintableCertificate } from './PrintableCertificate'
import { certificatesService } from '../services/certificates.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
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
  const studentName = useAuthStore((s) => s.user?.full_name) ?? 'Học viên Nedu'

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
            <p className="font-display font-semibold text-brand-dark">{studentName}</p>
            <p className="text-xs text-gray-500 mt-1">đã hoàn thành xuất sắc khoá học</p>
            <p className="font-semibold text-sm text-brand-dark mt-1">{selected.course_name}</p>
          </div>
          <Button className="w-full" onClick={() => window.print()}>
            🖨️ Tải PDF
          </Button>
          <p className="text-[10px] text-i3 text-center -mt-2">
            Mở hộp thoại in · chọn <strong>"Lưu thành PDF"</strong>
          </p>
          <PrintableCertificate certificate={selected} studentName={studentName} />
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : !certificates || certificates.length === 0 ? (
        <div className="text-center py-10 px-4">
          <p className="text-5xl mb-3">🎓</p>
          <p className="text-sm font-semibold text-ink">Chưa có chứng chỉ nào</p>
          <p className="text-xs text-i3 mt-1.5 leading-relaxed">
            Hoàn thành khoá học để nhận chứng chỉ Nedu.<br />
            Mỗi chứng chỉ có mã định danh riêng, có thể tải PDF.
          </p>
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
