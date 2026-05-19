import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { publicRoutes } from './routes/public.routes'
import { protectedRoutes } from './routes/protected.routes'
import { ToastContainer } from './shared/components/ui/Toast'
import { Spinner } from './shared/components/ui/Spinner'
import { analytics } from './shared/analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  ...publicRoutes,
  ...protectedRoutes,
])

// Analytics pageView tracking — subscribe ở module level, KHÔNG wrap routes
// (tránh đụng vào layout structure). Dedupe theo pathname+search để tránh
// fire nhiều lần cho cùng 1 navigation state machine event.
let lastTrackedKey = ''
router.subscribe((state) => {
  if (state.navigation.state !== 'idle') return
  const key = state.location.pathname + state.location.search
  if (key === lastTrackedKey) return
  lastTrackedKey = key
  analytics.pageView(key, document.title)
})

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
