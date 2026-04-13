import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useHomeSummary, useContinueLearning } from '../hooks/useHomeData'
import { useMetaphysical } from '../../profile/hooks/useProfile'
import { useAssignments } from '../../assignments/hooks/useAssignments'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { StatsRow } from '../components/StatsRow'
import { PaymentAlertBanner } from '../components/PaymentAlertBanner'
import { HeroContinueWidget } from '../components/HeroContinueWidget'
import { BaZiStrip } from '../components/BaZiStrip'
import { UpcomingEventsList } from '../components/UpcomingEventsList'
import { AssignmentsList } from '../components/AssignmentsList'
import { RecentCoursesList } from '../components/RecentCoursesList'
import { CertificateModal } from '../../certificates/components/CertificateModal'
import { PaymentModal } from '../../payments/components/PaymentModal'
import { MetaphysicalModal } from '../../profile/components/MetaphysicalModal'
import { CourseModal } from '../../courses/components/CourseModal'
import { SubmitModal } from '../../assignments/components/SubmitModal'
import type { AssignmentDetail } from '../../../shared/types'

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useHomeSummary()
  const { data: continueLearning } = useContinueLearning()
  const { data: metaphysical } = useMetaphysical()
  const { data: allAssignments } = useAssignments()
  const user = useAuthStore((s) => s.user)

  const [certOpen, setCertOpen] = useState(false)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [metaOpen, setMetaOpen] = useState(false)
  const [courseModalId, setCourseModalId] = useState<string | null>(null)
  const [courseModalTab, setCourseModalTab] = useState<string | undefined>()
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDetail | null>(null)

  const handleOpenCourse = (courseId: string, tab?: string) => {
    setCourseModalId(courseId)
    setCourseModalTab(tab)
  }

  const handleOpenAssignment = (assignmentId: string) => {
    const assignment = allAssignments?.find((a) => a.id === assignmentId)
    if (assignment) setSelectedAssignment(assignment)
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
        statusLabel={summary.student.status_label}
        noiStatus={summary.noi_status}
      />

      <StatsRow
        activeCourses={summary.stats.active_courses}
        completionPercent={summary.stats.completion_percent}
        certificatesCount={summary.stats.certificates_count}
        onCertificatesClick={() => setCertOpen(true)}
      />

      {summary.pending_payment && (
        <PaymentAlertBanner
          payment={summary.pending_payment}
          onPayClick={() => setPaymentId(summary.pending_payment!.payment_id)}
        />
      )}

      {continueLearning && (
        <HeroContinueWidget
          data={continueLearning}
          onStartLesson={(courseId) => handleOpenCourse(courseId, 'lessons')}
        />
      )}

      <BaZiStrip onOpen={() => setMetaOpen(true)} />

      <RecentCoursesList
        courses={summary.recent_courses}
        onOpenCourse={(courseId) => handleOpenCourse(courseId)}
      />

      <UpcomingEventsList events={summary.upcoming_events} />

      <AssignmentsList
        assignments={summary.pending_assignments}
        onOpenAssignment={handleOpenAssignment}
      />

      <CertificateModal open={certOpen} onClose={() => setCertOpen(false)} />
      <PaymentModal paymentId={paymentId} onClose={() => setPaymentId(null)} />
      <MetaphysicalModal
        open={metaOpen}
        onClose={() => setMetaOpen(false)}
        profile={metaphysical || null}
        studentName={user?.full_name || ''}
        studentCode={user?.student_code || null}
      />
      <CourseModal
        courseId={courseModalId}
        initialTab={courseModalTab}
        onClose={() => { setCourseModalId(null); setCourseModalTab(undefined) }}
      />
      <SubmitModal
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
    </div>
  )
}
