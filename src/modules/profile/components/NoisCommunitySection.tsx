import type { NoiStatus } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'

interface NoisCommunitySectionProps {
  noiStatus: NoiStatus | null
}

export function NoisCommunitySection({ noiStatus }: NoisCommunitySectionProps) {
  return (
    <div className="mx-4 mt-4">
      <h3 className="font-display font-semibold text-sm text-brand-dark mb-2">N-ơi Community</h3>
      {noiStatus ? (
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-brand-purple">{noiStatus.checkins}</p>
              <p className="text-[10px] text-gray-500">Check-in</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-purple">{noiStatus.ninety_day_percent}%</p>
              <p className="text-[10px] text-gray-500">90 ngày</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-purple">{noiStatus.streak_weeks}</p>
              <p className="text-[10px] text-gray-500">Tuần liên tiếp</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => toast('N-ơi là cộng đồng dành cho học viên tốt nghiệp Nedu · Sắp ra mắt', 'info')}
          className="w-full p-4 bg-gray-50 rounded-xl text-left"
        >
          <p className="text-sm text-gray-600">🔮 Khám phá N-ơi →</p>
          <p className="text-xs text-gray-400 mt-0.5">Cộng đồng dành cho học viên Nedu</p>
        </button>
      )}
    </div>
  )
}
