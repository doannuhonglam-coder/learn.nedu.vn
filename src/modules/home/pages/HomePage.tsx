import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useHomeSummary, useContinueLearning } from '../hooks/useHomeData'
import { useAssignments } from '../../assignments/hooks/useAssignments'
import { useScheduleEvents } from '../../schedule/hooks/useSchedule'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { HeroContinueWidget } from '../components/HeroContinueWidget'
import { RecentCoursesList } from '../components/RecentCoursesList'
import { UpcomingEventsList } from '../components/UpcomingEventsList'
import { AssignmentsList } from '../components/AssignmentsList'
import { CourseModal } from '../../courses/components/CourseModal'
import { SubmitModal } from '../../assignments/components/SubmitModal'
import { EventModal } from '../../schedule/components/EventModal'
import type { AssignmentDetail, ScheduleEvent } from '../../../shared/types'

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useHomeSummary()
  const { data: continueLearning } = useContinueLearning()
  const { data: allAssignments } = useAssignments()
  const now = new Date()
  const { data: allEvents } = useScheduleEvents(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  )

  const [courseModalId, setCourseModalId] = useState<string | null>(null)
  const [courseModalTab, setCourseModalTab] = useState<string | undefined>()
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDetail | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)

  const handleOpenCourse = (courseId: string, tab?: string) => {
    setCourseModalId(courseId)
    setCourseModalTab(tab)
  }

  const handleOpenAssignment = (assignmentId: string) => {
    const assignment = allAssignments?.find((a) => a.id === assignmentId)
    if (assignment) setSelectedAssignment(assignment)
  }

  const handleOpenEvent = (eventId: string) => {
    const event = allEvents?.find((e) => e.id === eventId)
    if (event) setSelectedEvent(event)
  }

  if (summaryLoading || !summary) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="pb-6">
      <WelcomeHeader
        fullName={summary.student.full_name}
        activeCourses={summary.stats.active_courses}
        completionPercent={summary.stats.completion_percent}
      />

      {continueLearning && (
        <div className="mt-3">
          <HeroContinueWidget
            data={continueLearning}
            onStartLesson={(courseId) => handleOpenCourse(courseId, 'lessons')}
          />
        </div>
      )}

      <RecentCoursesList
        courses={summary.recent_courses}
        onOpenCourse={handleOpenCourse}
      />

      <UpcomingEventsList
        events={summary.upcoming_events}
        onOpenEvent={handleOpenEvent}
      />

      <AssignmentsList
        assignments={summary.pending_assignments}
        onOpenAssignment={handleOpenAssignment}
      />

      <CourseModal
        runId={courseModalId}
        initialTab={courseModalTab}
        onClose={() => { setCourseModalId(null); setCourseModalTab(undefined) }}
      />
      <SubmitModal
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
