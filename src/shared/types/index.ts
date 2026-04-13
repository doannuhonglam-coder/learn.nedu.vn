// ── Auth ────────────────────────────────────────────────────
export interface StudentProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  student_code: string | null
  is_active: boolean
  activated_at: string | null
  created_at: string
  consultant_name: string | null
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_at: string
  user: StudentProfile
}

// ── Home ────────────────────────────────────────────────────
export interface HomeSummary {
  student: { id: string; full_name: string; status_label: string }
  stats: { active_courses: number; completion_percent: number; certificates_count: number }
  noi_status: NoiStatus | null
  pending_payment: PendingPaymentAlert | null
  upcoming_events: UpcomingEventSummary[]
  pending_assignments: PendingAssignmentSummary[]
  recent_courses: CourseSummary[]
}

export interface NoiStatus {
  status: 'invited' | 'active' | 'rebuilding'
  label: string
  checkins: number
  streak_weeks: number
  ninety_day_percent: number
}

export interface ContinueLearning {
  enrollment_id: string
  course_id: string
  course_name: string
  course_type: 'on_demand' | 'cohort'
  instructor_name: string
  current_module: string
  progress_percent: number
  next_lesson: { id: string; title: string }
}

// ── Course ───────────────────────────────────────────────────
export type CourseType = 'retreat' | 'cohort' | 'on_demand' | 'coaching'

export interface CourseSummary {
  id: string
  name: string
  slug: string
  course_type: CourseType
  status: 'draft' | 'published' | 'archived'
  instructor_name: string
  thumbnail_url: string | null
  retreat_date: string | null
  retreat_countdown_seconds: number | null
  cohort_start_date: string | null
  cohort_end_date: string | null
  coaching_sessions_completed: number | null
  coaching_sessions_total: number | null
  metaphysical_match_score: number | null
}

export interface CourseDetail extends CourseSummary {
  description: string
  program: { id: string; name: string } | null
  modules: ModuleSummary[]
  retreat_location: string | null
  retreat_prep_checklist: PrepChecklistItem[] | null
  retreat_schedule: RetreatDaySchedule[] | null
}

export interface ModuleSummary {
  id: string
  title: string
  order_index: number
  lessons_count: number
  lessons_completed: number
  is_locked: boolean
}

export interface PrepChecklistItem {
  id: string
  title: string
  description: string | null
  due_date: string | null
  is_checked: boolean
}

export interface RetreatDaySchedule {
  day_number: number
  date: string
  title: string
  activities: Array<{ time: string; title: string }>
}

// ── Lesson ───────────────────────────────────────────────────
export interface LessonSummary {
  id: string
  title: string
  order_index: number
  duration_minutes: number | null
  is_preview: boolean
  is_locked: boolean
  is_completed: boolean
  completed_at: string | null
  unlock_condition: string | null
}

export interface LessonDetail extends LessonSummary {
  module_id: string
  module_title: string
  description: string | null
  video: {
    cloudflare_stream_id: string
    thumbnail_url: string
    signed_token: string
    duration_seconds: number
  } | null
  materials: CourseMaterial[]
  notes: string | null
}

export interface LessonProgressResponse {
  lesson_id: string
  is_completed: boolean
  watch_percent: number
  completed_at: string | null
  course_progress_updated: {
    progress_percent: number
    is_course_completed: boolean
    certificate_unlocked: boolean
  }
}

// ── Enrollment ───────────────────────────────────────────────
export interface EnrollmentSummary {
  id: string
  course: CourseSummary
  status: 'active' | 'completed' | 'expired' | 'cancelled'
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
  progress_percent: number
  enrolled_at: string
  expired_at: string | null
}

export interface EnrollmentDetail extends EnrollmentSummary {
  modules_completed: number
  modules_total: number
  lessons_completed: number
  lessons_total: number
  certificates: CertificateSummary[]
  payments: PaymentSummary[]
}

// ── Payment ──────────────────────────────────────────────────
export interface PendingPaymentAlert {
  payment_id: string
  enrollment_id: string
  course_name: string
  installment_label: string
  amount: number
  due_date: string
  status: 'pending' | 'awaiting_verification'
  status_label: string
}

export interface PaymentSummary {
  id: string
  enrollment_id: string
  course_name: string
  installment_number: number
  installment_label: string
  amount: number
  status: 'pending' | 'awaiting_verification' | 'paid' | 'overdue' | 'waived'
  due_date: string
  paid_at: string | null
}

export interface PaymentDetail extends PaymentSummary {
  bank_info: {
    bank_name: string
    account_number: string
    account_name: string
    transfer_content: string
    qr_code_url: string
  }
}

// ── Schedule ─────────────────────────────────────────────────
export interface UpcomingEventSummary {
  id: string
  title: string
  event_type: 'online' | 'offline' | 'retreat'
  start_time: string
  end_time: string
  platform: string | null
  location: string | null
}

export interface ScheduleEvent extends UpcomingEventSummary {
  course_id: string
  course_name: string
  instructor_name: string
  description: string | null
  meeting_url: string | null
  is_joinable: boolean
  join_available_in_seconds: number | null
  ical_url: string
}

// ── Assignment ───────────────────────────────────────────────
export interface PendingAssignmentSummary {
  id: string
  title: string
  course_name: string
  due_date: string
  status: 'not_submitted' | 'submitted' | 'graded' | 'overdue'
  is_urgent: boolean
}

export interface AssignmentDetail extends PendingAssignmentSummary {
  course_id: string
  description: string
  max_file_size_mb: number
  allowed_file_types: string[]
  submission: SubmissionDetail | null
}

export interface SubmissionDetail {
  id: string
  content: string
  file_url: string | null
  submitted_at: string
  grade: number | null
  feedback: string | null
  graded_at: string | null
}

// ── Certificate ──────────────────────────────────────────────
export interface CertificateSummary {
  id: string
  certificate_no: string | null
  title: string
  course_name: string
  issued_at: string | null
  is_locked: boolean
  unlock_condition: string | null
}

export interface CertificateDetail extends CertificateSummary {
  student_name: string
  pdf_url: string | null
}

// ── Coaching ─────────────────────────────────────────────────
export interface CoachingSessionSummary {
  id: string
  session_number: number
  title: string
  scheduled_at: string | null
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  coach_name: string
}

export interface CoachingSessionDetail extends CoachingSessionSummary {
  enrollment_id: string
  course_name: string
  meeting_url: string | null
  is_joinable: boolean
  notes: string | null
  homework: Array<{ title: string; description: string; due_date: string | null }> | null
}

// ── Metaphysical ─────────────────────────────────────────────
export interface MetaphysicalProfile {
  student_id: string
  bazi: { day_master: string; element: string; summary: string; pillars: object } | null
  nine_star_ki: { main_star: number; star_name: string; energy_pattern: string; summary: string } | null
  numerology: { life_path: number; expression: number; soul_urge: number; summary: string } | null
  mbti: { type: string; summary: string } | null
  enneagram: { type: string; wing: string | null; summary: string } | null
  recommended_path_note: string | null
  last_updated_at: string
}

// ── Streak ───────────────────────────────────────────────────
export interface StreakStats {
  current_streak_weeks: number
  longest_streak_weeks: number
  total_lessons_completed: number
  last_activity_at: string | null
}

// ── Notification ─────────────────────────────────────────────
export interface NotificationSummary {
  id: string
  type: 'payment' | 'assignment' | 'schedule' | 'certificate' | 'system'
  icon: string
  title: string
  body: string
  created_at: string
  is_read: boolean
  action_url: string | null
}

export interface NotificationPreferences {
  push_enabled: boolean
  email_enabled: boolean
  push_schedule: boolean
  push_assignment: boolean
  push_payment: boolean
}

// ── Course Material ──────────────────────────────────────────
export interface CourseMaterial {
  id: string
  title: string
  file_type: 'pdf' | 'docx' | 'xlsx' | 'image' | 'other'
  file_size_bytes: number
  signed_url: string
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
  has_next: boolean
}

export interface ErrorResponse {
  code: string
  message: string
  details?: object
  request_id: string
}
