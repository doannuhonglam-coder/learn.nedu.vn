import type { RetreatDaySchedule } from '../../../shared/types'

interface RetreatScheduleProps {
  schedule: RetreatDaySchedule[]
}

export function RetreatSchedule({ schedule }: RetreatScheduleProps) {
  return (
    <div className="space-y-4">
      {schedule.map((day) => (
        <div key={day.day_number} className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50">
            <p className="text-sm font-semibold text-brand-dark">{day.title}</p>
            <p className="text-[11px] text-gray-400">
              {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="px-4 py-2">
            {day.activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-brand-gold font-medium whitespace-nowrap mt-0.5">{activity.time}</span>
                <p className="text-sm text-gray-700">{activity.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
