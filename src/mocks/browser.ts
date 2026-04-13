import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth.handlers'
import { homeHandlers } from './handlers/home.handlers'
import { coursesHandlers } from './handlers/courses.handlers'
import { scheduleHandlers } from './handlers/schedule.handlers'
import { paymentsHandlers } from './handlers/payments.handlers'
import { assignmentsHandlers } from './handlers/assignments.handlers'
import { notificationsHandlers } from './handlers/notifications.handlers'
import { profileHandlers } from './handlers/profile.handlers'
import { certificatesHandlers } from './handlers/certificates.handlers'

export const worker = setupWorker(
  ...authHandlers,
  ...homeHandlers,
  ...coursesHandlers,
  ...scheduleHandlers,
  ...paymentsHandlers,
  ...assignmentsHandlers,
  ...notificationsHandlers,
  ...profileHandlers,
  ...certificatesHandlers,
)
