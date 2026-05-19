import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { publicRoutes } from './routes/public.routes'
import { protectedRoutes } from './routes/protected.routes'
import { ToastContainer } from './shared/components/ui/Toast'
import { Spinner } from './shared/components/ui/Spinner'
import { RouteTracker } from './shared/analytics/RouteTracker'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

// Root layout wrap toàn bộ routes — `<RouteTracker />` subscribe `useLocation()`
// để fire `analytics.pageView()` mỗi lần route đổi. Phải nằm trong router tree
// (React Router 7 data router) thay vì cạnh `<RouterProvider>`.
function RootLayout() {
  return (
    <>
      <RouteTracker />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      ...publicRoutes,
      ...protectedRoutes,
    ],
  },
])

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </QueryClientProvider>
  )
}
