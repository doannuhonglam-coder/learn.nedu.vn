import { toast } from '../../../shared/components/ui/Toast'

interface ComingSoonItem {
  icon: string
  iconBg: string
  name: string
  sub: string
  toastMsg: string
}

const items: ComingSoonItem[] = [
  {
    icon: '🗺️',
    iconBg: '#FEF4D6',
    name: 'Hành Trình Học Tập',
    sub: '7 ngày → 3 tháng → Lifestyle',
    toastMsg: '🗺️ Hành Trình Học Tập · Đang phát triển',
  },
  {
    icon: '🗓️',
    iconBg: '#F5F3EF',
    name: 'Micro-Learning 30 Ngày',
    sub: 'Phân theo 11 nhóm năng lượng',
    toastMsg: '🗓️ Micro-Learning · Đang phát triển',
  },
  {
    icon: '📊',
    iconBg: '#F5F3EF',
    name: 'Benchmark Theo Tuổi',
    sub: 'Bạn đang ở đâu trong nhóm 26–30',
    toastMsg: '📊 Benchmark · Đang phát triển',
  },
  {
    icon: '🏅',
    iconBg: '#FEF4D6',
    name: 'Streak Milestone',
    sub: 'Huy hiệu 7 / 30 / 90 ngày học liên tiếp',
    toastMsg: '🏅 Streak Milestone · Đang phát triển',
  },
  {
    icon: '📚',
    iconBg: '#FFFBEB',
    name: 'Chương Trình CSCB',
    sub: 'Curriculum đầy đủ · Dự kiến Q3/2026',
    toastMsg: '📚 CSCB · Dự kiến Q3/2026',
  },
]

export function ComingSoonSection() {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">
          Sắp Ra Mắt
        </h2>
        <span
          className="text-[9px] font-bold px-2 py-[3px] rounded-[10px]"
          style={{
            color: '#D4920A',
            background: '#FEF4D6',
            border: '1px solid rgba(245,183,49,0.30)',
            letterSpacing: '0.04em',
          }}
        >
          EPIC 13
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => toast(item.toastMsg, 'info')}
            className="bg-surface rounded-[14px] px-4 py-[14px] flex items-center gap-3 text-left transition-transform active:scale-[.97]"
            style={{
              border: '1px solid rgba(26,24,22,0.10)',
              boxShadow: '0 2px 16px rgba(26,24,22,0.08)',
            }}
          >
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] flex-shrink-0"
              style={{ background: item.iconBg }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink">{item.name}</div>
              <div className="text-[11px] text-i3 mt-0.5">{item.sub}</div>
            </div>
            <span className="text-[18px] text-i3">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
