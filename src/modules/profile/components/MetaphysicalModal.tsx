import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import type { MetaphysicalProfile } from '../../../shared/types'
import { PiiCollectionForm } from './PiiCollectionForm'
import { PrintableProfile } from './PrintableProfile'

interface MetaphysicalModalProps {
  open: boolean
  onClose: () => void
  profile: MetaphysicalProfile | null
  studentName: string
  studentCode: string | null
}

// 5 vault facets canonical keys (snake_case VN) — match BE shape.
const FACET_META: Array<{
  key: 'bat_tu' | 'cuu_tinh' | 'tu_vi' | 'than_so_hoc' | 'cung_hoang_dao'
  icon: string
  title: string
  description: string
}> = [
  {
    key: 'bat_tu',
    icon: '🀄',
    title: 'BaZi · Tứ Trụ',
    description: 'Ngũ hành ngày sinh, tứ trụ bát tự',
  },
  {
    key: 'cuu_tinh',
    icon: '⭐',
    title: 'Nine Star Ki · Cửu Tinh',
    description: 'Cửu tinh năng lượng cá nhân',
  },
  {
    key: 'tu_vi',
    icon: '🌙',
    title: 'Tử Vi · Mệnh Cục',
    description: 'Đẩu số cung Mệnh + Thân',
  },
  {
    key: 'than_so_hoc',
    icon: '🔢',
    title: 'Thần Số Học · Numerology',
    description: 'Con số chủ đạo (Life Path)',
  },
  {
    key: 'cung_hoang_dao',
    icon: '♈',
    title: 'Cung Hoàng Đạo · Astrology',
    description: 'Mặt trời / mặt trăng / rising',
  },
]

export function MetaphysicalModal({
  open,
  onClose,
  profile,
  studentName,
  studentCode,
}: MetaphysicalModalProps) {
  // State 1: chưa load xong
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

  // State 2: chưa nhập PII → show wizard
  if (profile.is_pii_missing) {
    return (
      <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
        <PiiCollectionForm onDone={() => { /* keep modal open to show results */ }} />
      </BottomSheet>
    )
  }

  // State 3: có PII nhưng compute pending (vault down hoặc đang chạy)
  if (!profile.is_available) {
    return (
      <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm text-gray-500">Đang phân tích hồ sơ siêu hình…</p>
          <p className="text-xs text-gray-400 mt-1">
            Hệ thống đang xử lý. Đóng modal và mở lại sau ít phút.
          </p>
        </div>
      </BottomSheet>
    )
  }

  // State 4: có data → render
  const summary = profile.facets.summary as
    | {
        core_personality?: string
        communication_dos?: string[]
        communication_donts?: string[]
        real_need?: string
        timing_2026?: string
        opening_suggestion?: string
      }
    | null

  return (
    <BottomSheet open={open} onClose={onClose} title="Hồ Sơ Siêu Hình Học">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-sm font-semibold text-brand-dark">{studentName}</p>
            {studentCode && <p className="text-xs text-gray-500">{studentCode}</p>}
            <p className="text-[11px] text-gray-400">
              Phân tích 5 hệ thống · cập nhật{' '}
              {profile.cached_at
                ? new Date(profile.cached_at).toLocaleDateString('vi-VN')
                : 'gần đây'}
              {profile.is_stale && ' · đang refresh'}
            </p>
          </div>
        </div>

        {/* Core personality summary (vault payload extra context) */}
        {summary?.core_personality && (
          <div
            className="rounded-xl p-4"
            style={{
              background: '#FEF4D6',
              border: '1px solid rgba(245,183,49,0.25)',
            }}
          >
            <p
              className="font-mono text-[10px] font-bold uppercase mb-2"
              style={{ color: '#8B5A15', letterSpacing: '0.06em' }}
            >
              Đặc tính cốt lõi
            </p>
            <p className="text-[13px] text-i2 leading-relaxed whitespace-pre-line">
              {summary.core_personality}
            </p>
          </div>
        )}

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
                {available && facet && (
                  <div className="text-[12px] text-i3 mt-2 ml-7 space-y-0.5">
                    {Object.entries(facet)
                      .filter(([k]) => k !== 'label')
                      .map(([k, v]) => (
                        <div key={k}>
                          <span className="text-i3">{k}:</span>{' '}
                          <span className="text-ink font-medium">{String(v)}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Communication tips từ summary */}
        {summary?.communication_dos && summary.communication_dos.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 mb-2">
              ✓ Nên giao tiếp
            </p>
            <ul className="text-[13px] text-emerald-900 space-y-1">
              {summary.communication_dos.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary?.communication_donts && summary.communication_donts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-700 mb-2">
              ✗ Tránh
            </p>
            <ul className="text-[13px] text-red-900 space-y-1">
              {summary.communication_donts.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Save as PDF — open native print dialog (works on iOS Safari "Save to Files",
            Android Chrome "Save as PDF", desktop browsers "Microsoft Print to PDF" / etc).
            PrintableProfile sibling element được render bên dưới, hidden khỏi normal view
            nhưng show khi browser enter print media query. */}
        <Button
          className="w-full"
          onClick={() => window.print()}
        >
          🖨️ Tải Hồ Sơ PDF
        </Button>
        <p className="text-[10px] text-i3 text-center mt-1.5">
          Mở hộp thoại in · chọn <strong>"Lưu thành PDF"</strong>
        </p>
      </div>

      {/* Printable view — hidden trong normal render, visible only @media print.
          Render outside scroll container để window.print() bắt đúng full layout. */}
      <PrintableProfile
        profile={profile}
        studentName={studentName}
        studentCode={studentCode}
      />
    </BottomSheet>
  )
}
