import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import type { MetaphysicalProfile } from '../../../shared/types'

interface MetaphysicalModalProps {
  open: boolean
  onClose: () => void
  profile: MetaphysicalProfile | null
  studentName: string
  studentCode: string | null
}

export function MetaphysicalModal({ open, onClose, profile, studentName, studentCode }: MetaphysicalModalProps) {
  if (!profile) {
    return (
      <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
          <p className="text-xs text-gray-400 mt-1">Liên hệ Nedu Team để tạo hồ sơ</p>
        </div>
      </BottomSheet>
    )
  }

  const handleDownloadPdf = () => {
    toast('Đang tạo hồ sơ PDF...', 'success')
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-sm font-semibold text-brand-dark">{studentName}</p>
            <p className="text-xs text-gray-500">{studentCode}</p>
            <p className="text-[11px] text-gray-400">Phân tích 5 hệ thống</p>
          </div>
        </div>

        {/* BaZi */}
        {profile.bazi && (
          <Section icon="🀄" title="BaZi · Tứ Trụ" subtitle={profile.bazi.day_master}>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bazi.summary}</p>
          </Section>
        )}

        {/* Nine Star Ki */}
        {profile.nine_star_ki && (
          <Section icon="⭐" title="Nine Star Ki" subtitle={profile.nine_star_ki.star_name}>
            <p className="text-xs text-brand-purple mb-1">{profile.nine_star_ki.energy_pattern}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.nine_star_ki.summary}</p>
          </Section>
        )}

        {/* MBTI / Enneagram */}
        {profile.mbti && (
          <Section icon="🧠" title="MBTI" subtitle={profile.mbti.type}>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.mbti.summary}</p>
          </Section>
        )}

        {profile.enneagram && (
          <Section icon="🔄" title="Enneagram" subtitle={`Type ${profile.enneagram.type}${profile.enneagram.wing ? `w${profile.enneagram.wing}` : ''}`}>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.enneagram.summary}</p>
          </Section>
        )}

        {/* Numerology */}
        {profile.numerology && (
          <Section icon="🔢" title="Numerology" subtitle={`Life Path ${profile.numerology.life_path}`}>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.numerology.summary}</p>
          </Section>
        )}

        {/* Recommended path */}
        {profile.recommended_path_note && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-medium text-amber-700 mb-1">💡 Ghi chú từ Nedu Team</p>
            <p className="text-sm text-amber-900 leading-relaxed">{profile.recommended_path_note}</p>
          </div>
        )}

        <Button className="w-full" onClick={handleDownloadPdf}>
          Tải Hồ Sơ PDF ↓
        </Button>
      </div>
    </BottomSheet>
  )
}

function Section({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <div>
          <p className="text-sm font-semibold text-brand-dark">{title}</p>
          <p className="text-xs text-brand-purple font-medium">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
