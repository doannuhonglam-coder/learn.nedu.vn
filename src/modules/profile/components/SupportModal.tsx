import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { SUPPORT } from '../../../shared/constants/support.constants'

interface SupportModalProps {
  open: boolean
  onClose: () => void
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Liên hệ Nedu">
      <div className="space-y-3">
        <p className="text-[13px] text-i2 leading-relaxed">
          Đội ngũ Nedu sẵn sàng hỗ trợ bạn qua các kênh sau:
        </p>

        <a
          href={SUPPORT.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl transition-colors active:bg-s2"
          style={{ background: '#F0F7FF', border: '1px solid rgba(59,130,246,0.20)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
            style={{ background: '#0084FF', color: 'white' }}
          >
            💬
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">Zalo</p>
            <p className="text-[11px] text-i3 mt-0.5">Chat trực tuyến · Phản hồi nhanh nhất</p>
          </div>
          <span className="text-i3 text-[14px]">→</span>
        </a>

        <a
          href={`mailto:${SUPPORT.email}`}
          className="flex items-center gap-3 p-4 rounded-xl transition-colors active:bg-s2"
          style={{ background: '#F5F3EF', border: '1px solid rgba(26,24,22,0.08)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#60A5FA,#1D4ED8)',
              color: 'white',
            }}
          >
            📧
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">Email</p>
            <p className="text-[11px] text-i3 mt-0.5 truncate">{SUPPORT.email}</p>
          </div>
          <span className="text-i3 text-[14px]">→</span>
        </a>

        <a
          href={`tel:${SUPPORT.hotline.replace(/\s/g, '')}`}
          className="flex items-center gap-3 p-4 rounded-xl transition-colors active:bg-s2"
          style={{ background: '#F5F3EF', border: '1px solid rgba(26,24,22,0.08)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#34D399,#059669)',
              color: 'white',
            }}
          >
            📞
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">Hotline</p>
            <p className="text-[11px] text-i3 mt-0.5">{SUPPORT.hotline}</p>
          </div>
          <span className="text-i3 text-[14px]">→</span>
        </a>

        <p
          className="text-[11px] text-i3 text-center pt-2 font-mono"
          style={{ letterSpacing: '0.04em' }}
        >
          {SUPPORT.hours}
        </p>
      </div>
    </BottomSheet>
  )
}
