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
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
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
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-display font-semibold text-xl text-brand-dark">Lịch Học</h2>
      </div>

      <CalendarMonth
        year={year}
        month={month}
        events={events || []}
        selectedDate={selectedDay}
        onSelectDate={handleSelectDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="mt-4">
        <EventTimeline
          events={events || []}
          selectedDay={selectedDay}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
