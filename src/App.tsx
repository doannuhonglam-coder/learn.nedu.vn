import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { publicRoutes } from './routes/public.routes'
import { protectedRoutes } from './routes/protected.routes'
import { ToastContainer } from './shared/components/ui/Toast'
import { Spinner } from './shared/components/ui/Spinner'

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
