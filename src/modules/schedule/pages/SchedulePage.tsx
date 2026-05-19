import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useScheduleEvents } from '../hooks/useSchedule'
import { CalendarMonth } from '../components/CalendarMonth'
import { EventTimeline } from '../components/EventTimeline'
import { EventModal } from '../components/EventModal'
import type { ScheduleEvent } from '../../../shared/types'

export default function SchedulePage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const { data: events, isLoading } = useScheduleEvents(monthStr)

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDay(null)
  }

  const handleJumpToday = () => {
    const t = new Date()
    setYear(t.getFullYear())
    setMonth(t.getMonth())
    setSelectedDay(null)
  }

  const handleSelectDate = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-5 pb-1">
        <h1 className="font-display font-semibold text-[22px] text-ink">Lịch Học</h1>
        <p className="text-[12px] text-i3 mt-0.5">
          Tất cả lịch học, coaching, và sự kiện
        </p>
      </div>

      <CalendarMonth
        year={year}
        month={month}
        events={events || []}
        selectedDate={selectedDay}
        onSelectDate={handleSelectDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onJumpToday={handleJumpToday}
      />

      <EventTimeline
        events={events || []}
        year={year}
        month={month}
        selectedDay={selectedDay}
        onSelectEvent={setSelectedEvent}
      />

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
