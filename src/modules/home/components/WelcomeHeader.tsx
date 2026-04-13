import type { NoiStatus } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'
import { toast } from '../../../shared/components/ui/Toast'

interface WelcomeHeaderProps {
  fullName: string
  statusLabel: string
  noiStatus: NoiStatus | null
}

export function WelcomeHeader({ fullName, statusLabel, noiStatus }: WelcomeHeaderProps) {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleNoiClick = () => {
    toast('N-ơi là cộng đồng dành cho học viên tốt nghiệp Nedu · Sắp ra mắt', 'info')
  }

  return (
    <div className="px-4 pt-4">
      <p className="text-lg font-semibold text-brand-dark">
        Chào {fullName} 👋
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{today}</p>
      <div className="flex items-center gap-2 mt-2">
        <Badge>{statusLabel}</Badge>
        <button onClick={handleNoiClick}>
          <Badge variant="match">
            {noiStatus ? `🔮 ${noiStatus.label}` : '🔮 N-ơi · Khám phá →'}
          </Badge>
        </button>
      </div>
    </div>
  )
}
