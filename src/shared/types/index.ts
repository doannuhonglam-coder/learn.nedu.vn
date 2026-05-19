// ── Auth ────────────────────────────────────────────────────
// StudentProfile = full profile sau khi hydrate qua GET /api/learn/me.
// Login response từ auth-central trả về AuthUser (subset) — xem
// `shared/config/auth-central-client.ts`. Learn-specific fields nullable
// vì có thể chưa hydrate khi vừa login.
export interface StudentProfile {
  id: string
  person_id: string
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  student_code: string | null
  is_active: boolean
  activated_at: string | null
  created_at: string
  consultant_name: string | null
}

// ── Home ────────────────────────────────────────────────────
export interface HomeSummary {
  student: { id: string; full_name: string; status_label: string }
  stats: { active_courses: number; completion_percent: number; certificates_count: number }
  noi_status: NoiStatus | null
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
  retreat_end_date?: string | null
  retreat_countdown_seconds: number | null
  cohort_start_date: string | null
  cohort_end_date: string | null
  coaching_sessions_completed: number | null
  coaching_sessions_total: number | null
  current_module?: number | null
  total_modules?: number | null
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
}

// ── Payment / installment ────────────────────────────────────
// Removed: Nedu đã bỏ trả góp (A8 payment bridge dropped). FE không còn
// render alert "đến hạn thanh toán" / portal /payments. Payment events
// đơn lẻ (refund / purchase confirmation) vẫn fire qua notifications
// type='payment'.

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
  module_title?: string | null
  agenda?: string[]
  prep_items?: string[]
  meeting_id?: string | null
  meeting_passcode?: string | null
  will_be_recorded?: boolean
  recording_url?: string | null
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
// Match BE /api/learn/coaching/sessions DTO.
export interface CoachingSession {
  id: string
  enrollment_id: string | null
  course_run_id: string
  course_id: string
  course_name: string
  course_slug: string
  session_number: number | null
  sessions_total: number
  title: string
  description: string | null
  scheduled_at: string
  end_at: string | null
  duration_minutes: number | null
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  is_joinable: boolean
  meeting_url: string | null
  meeting_id: string | null
  meeting_passcode: string | null
  recording_url: string | null
  has_notes: boolean
}

export interface CoachingNote {
  summary_text: string | null
  homework_items: string[]
  written_at: string
}

export interface CoachingSessionDetail extends CoachingSession {
  note: CoachingNote | null
}

// ── Mission (challenge content_kind) ─────────────────────────
// Match BE /api/learn/missions DTO.
export type MissionStatus =
  | 'locked'
  | 'not_submitted'
  | 'submitted'
  | 'reviewed'
  | 'overdue'

export interface MissionSubmission {
  id: string
  content: string
  file_url: string | null
  submitted_at: string
  review_text: string | null
  rating: number | null
  reviewed_at: string | null
}

export interface Mission {
  id: string
  course_run_id: string
  course_id: string
  course_name: string
  course_slug: string
  day_number: number
  title: string
  description: string | null
  video_provider: string | null
  video_ref: string | null
  task_description: string | null
  unlock_at: string
  deadline_at: string
  is_locked: boolean
  is_overdue: boolean
  status: MissionStatus
  submission: MissionSubmission | null
}

// ── Push Subscription (Web Push API) ─────────────────────────
// Match BE /api/learn/push/* DTOs.
export interface PushSubscribePayload {
  endpoint: string
  p256dh_key: string
  auth_key: string
  user_agent?: string
}

export interface PushSubscribeResponse {
  id: string
  created_at: string
}

export interface PushUnsubscribePayload {
  endpoint: string
}

export interface PushUnsubscribeResponse {
  deleted: boolean
}

export interface PushSubscriptionInfo {
  id: string
  user_agent: string | null
  created_at: string
  updated_at: string
}

// ── Metaphysical ─────────────────────────────────────────────
// 5-system vault facets cache passthrough — match BE
// /api/learn/profile/metaphysical contract. Mỗi facet là opaque
// Record vì vault output shape rich + system-specific (BaZi pillars,
// Tử Vi mệnh disc, etc.) — FE chỉ render high-level "available" indicator
// + defer detail to PDF download.
//
// Note: drop MBTI + Enneagram (không phải vault 5-system). Add Tử Vi +
// Western Astrology (cung hoàng đạo) thay thế.
export interface MetaphysicalProfile {
  user_id: string
  facets: {
    bazi: Record<string, unknown> | null
    nine_star_ki: Record<string, unknown> | null
    tu_vi: Record<string, unknown> | null
    numerology: Record<string, unknown> | null
    western_astrology: Record<string, unknown> | null
  }
  cached_at: string | null
  is_stale: boolean
  is_available: boolean
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
