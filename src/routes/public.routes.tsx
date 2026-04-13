import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'))
const ActivationPage = lazy(() => import('../modules/auth/pages/ActivationPage'))
const ForgotPasswordPage = lazy(() => import('../modules/auth/pages/ForgotPasswordPage'))

export const publicRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/activate', element: <ActivationPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
]
