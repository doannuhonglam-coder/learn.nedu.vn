import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'

interface StreakModalProps {
  open: boolean
  onClose: () => void
  currentStreakDays: number
}

const MILESTONES = [7, 30, 90] as const

export function StreakModal({ open, onClose, currentStreakDays }: StreakModalProps) {
  const nextMilestone = MILESTONES.find((m) => currentStreakDays < m) ?? MILESTONES[MILESTONES.length - 1]
  const reachedMilestones = MILESTONES.filter((m) => currentStreakDays >= m)

  let title = `Bạn đã giữ vững ${currentStreakDays} ngày!`
  let subtitle = `Tiếp tục để đạt mốc ${nextMilestone} ngày!`

  if (currentStreakDays >= 90) {
    title = `${currentStreakDays} ngày liên tiếp · Đỉnh!`
    subtitle = 'Bạn đã đạt cấp độ cao nhất. Hãy tiếp tục giữ vững thói quen!'
  } else if (currentStreakDays >= 30) {
    subtitle = `Thói quen đã vững vàng. Tiếp tục để đạt mốc ${nextMilestone} ngày!`
  } else if (currentStreakDays >= 7) {
    subtitle = `Thói quen bắt đầu hình thành. Tiếp tục để đạt mốc ${nextMilestone} ngày!`
  }

  const handleRemindMe = () => {
    toast(`📅 Sẽ nhắc bạn khi đạt mốc ${nextMilestone} ngày`, 'success')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="text-center pb-2">
        <div className="text-[28px] mb-3 leading-none">
          🎉 🎊 🎉
        </div>

        <div
          className="w-[88px] h-[88px] rounded-[20px] mx-auto flex flex-col items-center justify-center mb-2"
          style={{
            background: 'linear-gradient(135deg,#F5B731,#D4920A)',
            boxShadow: '0 8px 24px rgba(245,183,49,0.35)',
          }}
        >
          <div
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: 36 }}
          >
            {currentStreakDays}
          </div>
        </div>

        <div
          className="font-mono text-[10px] font-bold uppercase text-i3 mb-4"
          style={{ letterSpacing: '0.10em' }}
        >
          Ngày liên tiếp
        </div>

        <h2 className="font-display text-[18px] font-semibold text-ink mb-2 leading-tight px-4">
          {title}
        </h2>

        <p className="text-[12px] text-i2 leading-relaxed px-4 mb-4">
          {subtitle}
        </p>

        {/* Milestone dots */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          {MILESTONES.map((m, i) => {
            const isReached = reachedMilestones.includes(m)
            const isCurrent = m === nextMilestone && !isReached
            return (
              <div key={m} className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    background: isReached ? '#F5B731' : isCurrent ? '#FEF4D6' : '#F5F3EF',
                    color: isReached ? '#1A1816' : isCurrent ? '#D4920A' : '#8A8480',
                    border: isCurrent ? '1.5px solid #D4920A' : 'none',
                  }}
                >
                  {m}
                </div>
                {i < MILESTONES.length - 1 && (
                  <div
                    className="w-3 h-0.5 rounded-full"
                    style={{
                      background:
                        currentStreakDays >= MILESTONES[i + 1]
                          ? '#F5B731'
                          : 'rgba(26,24,22,0.10)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* CTAs */}
        <button
          onClick={handleRemindMe}
          className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity"
          style={{ background: '#1A1816', color: '#F5B731' }}
        >
          Tuyệt! Nhắc tôi mốc kế
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-[13px] font-semibold transition-colors mt-2"
          style={{
            background: 'transparent',
            color: '#1A1816',
            border: '1.5px solid rgba(26,24,22,0.15)',
          }}
        >
          Đóng
        </button>
      </div>
    </BottomSheet>
  )
}
