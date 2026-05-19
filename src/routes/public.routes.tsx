import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'))
const CallbackPage = lazy(() => import('../modules/auth/pages/CallbackPage'))

// Phase 1: Google OAuth only. /activate + /forgot-password removed cùng
// password flow (Phase 2 sẽ re-introduce nếu cần).
export const publicRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <CallbackPage /> },
]
