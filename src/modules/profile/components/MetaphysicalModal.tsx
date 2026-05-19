import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import type { MetaphysicalProfile } from '../../../shared/types'

interface MetaphysicalModalProps {
  open: boolean
  onClose: () => void
  profile: MetaphysicalProfile | null
  studentName: string
  studentCode: string | null
}

// 5 vault facets — high-level metadata cho list view. Detail rendering
// (BaZi pillars, Tử Vi mệnh disc, ...) defer pdf download — vault output
// shape rich + system-specific, FE không inline render trong modal.
const FACET_META: Array<{
  key: keyof MetaphysicalProfile['facets']
  icon: string
  title: string
  description: string
}> = [
  { key: 'bazi', icon: '🀄', title: 'BaZi · Tứ Trụ', description: 'Ngũ hành ngày sinh, tứ trụ bát tự' },
  { key: 'nine_star_ki', icon: '⭐', title: 'Nine Star Ki', description: 'Cửu tinh năng lượng cá nhân' },
  { key: 'tu_vi', icon: '🌙', title: 'Tử Vi', description: 'Đẩu số cung Mệnh + Thân' },
  { key: 'numerology', icon: '🔢', title: 'Numerology', description: 'Con số chủ đạo (Life Path / Expression)' },
  { key: 'western_astrology', icon: '♈', title: 'Cung Hoàng Đạo', description: 'Mặt trời / mặt trăng / rising' },
]

export function MetaphysicalModal({
  open,
  onClose,
  profile,
  studentName,
  studentCode,
}: MetaphysicalModalProps) {
  // Trường hợp 1: chưa load xong
  if (!profile) {
    return (
      <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm text-gray-500">Đang tải hồ sơ…</p>
        </div>
      </BottomSheet>
    )
  }

  // Trường hợp 2: chưa có data (background job chưa populate)
  if (!profile.is_available) {
    return (
      <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm text-gray-500">Đang phân tích hồ sơ siêu hình…</p>
          <p className="text-xs text-gray-400 mt-1">
            Nedu Team sẽ hoàn thiện trong vài ngày tới. Liên hệ nếu cần gấp.
          </p>
        </div>
      </BottomSheet>
    )
  }

  // PDF export deferred Phase 2 (P2 spec NL-LEARN-API-PLAN-001) — UI button
  // disabled, không call BE để tránh 404 noise trên prod.

  return (
    <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-sm font-semibold text-brand-dark">{studentName}</p>
            <p className="text-xs text-gray-500">{studentCode}</p>
            <p className="text-[11px] text-gray-400">
              Phân tích 5 hệ thống · cập nhật{' '}
              {profile.cached_at
                ? new Date(profile.cached_at).toLocaleDateString('vi-VN')
                : 'gần đây'}
              {profile.is_stale && ' · đang refresh'}
            </p>
          </div>
        </div>

        {/* Facets — high-level badge per system */}
        <div className="space-y-2">
          {FACET_META.map((meta) => {
            const facet = profile.facets[meta.key]
            const available = facet !== null
            return (
              <div
                key={meta.key}
                className={`rounded-xl p-4 ${available ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark">{meta.title}</p>
                    <p className="text-xs text-gray-500">{meta.description}</p>
                  </div>
                  {available ? (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      đã có
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">đang phân tích</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-700 mb-1">💡 Mẹo</p>
          <p className="text-sm text-amber-900 leading-relaxed">
            Chi tiết từng hệ thống sẽ có trong file PDF. Liên hệ Nedu Team
            nếu cần đọc kỹ hoặc tư vấn lộ trình.
          </p>
        </div>

        <Button
          className="w-full"
          disabled
          title="Tính năng đang được hoàn thiện"
        >
          Tải Hồ Sơ PDF · Sắp ra mắt
        </Button>
      </div>
    </BottomSheet>
  )
}
