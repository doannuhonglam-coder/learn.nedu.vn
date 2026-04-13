import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'
import { AppShell } from '../shared/components/layout/AppShell'

const HomePage = lazy(() => import('../modules/home/pages/HomePage'))
const CoursesPage = lazy(() => import('../modules/courses/pages/CoursesPage'))
const SchedulePage = lazy(() => import('../modules/schedule/pages/SchedulePage'))
const ProfilePage = lazy(() => import('../modules/profile/pages/ProfilePage'))
const PaymentsPage = lazy(() => import('../modules/payments/pages/PaymentsPage'))

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/courses', element: <CoursesPage /> },
          { path: '/schedule', element: <SchedulePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/payments', element: <PaymentsPage /> },
        ],
      },
    ],
  },
]
