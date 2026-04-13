interface ProgressBarProps {
  percent: number
  showLabel?: boolean
  color?: string
  className?: string
}

export function ProgressBar({ percent, showLabel = false, color = 'bg-brand-gold', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{clamped}%</span>
      )}
    </div>
  )
}
