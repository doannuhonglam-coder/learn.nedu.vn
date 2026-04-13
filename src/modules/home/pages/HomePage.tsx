import { Spinner } from '../../../shared/components/ui/Spinner'
import { useHomeSummary, useContinueLearning } from '../hooks/useHomeData'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { StatsRow } from '../components/StatsRow'
import { PaymentAlertBanner } from '../components/PaymentAlertBanner'
import { HeroContinueWidget } from '../components/HeroContinueWidget'
import { BaZiStrip } from '../components/BaZiStrip'
import { UpcomingEventsList } from '../components/UpcomingEventsList'
import { AssignmentsList } from '../components/AssignmentsList'
import { RecentCoursesList } from '../components/RecentCoursesList'
import { toast } from '../../../shared/components/ui/Toast'

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useHomeSummary()
  const { data: continueLearning } = useContinueLearning()

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
        onCertificatesClick={() => toast('Chứng chỉ — sẽ mở modal ở Sprint 3', 'info')}
      />

      {summary.pending_payment && (
        <PaymentAlertBanner
          payment={summary.pending_payment}
          onPayClick={() => toast('Thanh toán — sẽ mở PaymentModal ở Sprint 2', 'info')}
        />
      )}

      {continueLearning && <HeroContinueWidget data={continueLearning} />}

      <BaZiStrip onOpen={() => toast('Hồ sơ siêu hình học — sẽ mở modal ở Sprint 3', 'info')} />

      <RecentCoursesList courses={summary.recent_courses} />

      <UpcomingEventsList events={summary.upcoming_events} />

      <AssignmentsList assignments={summary.pending_assignments} />
    </div>
  )
}
