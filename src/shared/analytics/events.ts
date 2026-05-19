// Event catalog — typed.
//
// Mỗi event có schema cố định. Khi thêm event mới: thêm key vào `EventMap`,
// sau đó dùng `analytics.track('name', { ...params })` ở consumer.
//
// Quy tắc params:
// - KHÔNG truyền PII (email, full_name, phone, payment info). Chỉ truyền ID.
// - Tên event: snake_case, dạng `domain_action[_result]`.

export interface EventMap {
  // placeholder — phase 1 chưa định nghĩa event domain.
  // Ví dụ sẽ thêm dần:
  // lesson_start: { course_id: string; lesson_id: string }
  // lesson_complete: { course_id: string; lesson_id: string }
  // exercise_submit: { course_id: string; lesson_id: string; exercise_id: string }
}

export type EventName = keyof EventMap
