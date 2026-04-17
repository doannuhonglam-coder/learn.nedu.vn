import type { NoiStatus } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'

interface NoisCommunitySectionProps {
  noiStatus: NoiStatus | null
}

export function NoisCommunitySection({ noiStatus }: NoisCommunitySectionProps) {
  return (
    <div className="px-4">
      <button
        onClick={() => toast('🔮 N-ơi Community · Sắp ra mắt', 'info')}
        className="w-full relative overflow-hidden rounded-[14px] px-[18px] py-4 text-left"
        style={{
          background: 'linear-gradient(135deg,#6B3FA0,#4A2870)',
          boxShadow: '0 4px 20px rgba(107,63,160,0.2)',
        }}
      >
        <div
          className="absolute -top-[30px] -right-[20px] w-[100px] h-[100px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        <div className="relative z-[1] flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            🔮
          </div>
          <div>
            <div
              className="font-mono text-[10px] font-bold uppercase mb-[3px]"
              style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}
            >
              N-ơi · Cộng Đồng
            </div>
            <div className="font-display text-[15px] font-semibold text-white">
              {noiStatus ? noiStatus.label : 'Khám phá'}
            </div>
          </div>
        </div>

        {noiStatus && (
          <div className="relative z-[1] flex gap-2">
            <div
              className="flex-1 rounded-lg px-2.5 py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <div className="font-display text-[15px] font-bold text-white">{noiStatus.checkins}</div>
              <div
                className="text-[9px] uppercase mt-0.5"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                Check-in
              </div>
            </div>
            <div
              className="flex-1 rounded-lg px-2.5 py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <div className="font-display text-[15px] font-bold text-white">
                {noiStatus.streak_weeks}
              </div>
              <div
                className="text-[9px] uppercase mt-0.5"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                Tuần liên tiếp
              </div>
            </div>
            <div
              className="flex-1 rounded-lg px-2.5 py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <div className="font-display text-[15px] font-bold text-white">
                {noiStatus.ninety_day_percent}%
              </div>
              <div
                className="text-[9px] uppercase mt-0.5"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                90 ngày
              </div>
            </div>
          </div>
        )}
      </button>
    </div>
  )
}
