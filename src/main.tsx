import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useAuthStore } from './shared/stores/auth.store'

async function enableMocking() {
  // Always enable mock mode until real API is ready
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  // Only start MSW worker on localhost (it won't work on deployed hosts)
  if (isLocalhost) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
    } catch (e) {
      console.warn('[MSW] Failed to start worker:', e)
    }
  }

  // Auto-login with mock user so we skip the login page
  useAuthStore.getState().setSession('mock-jwt-token-123', {
    id: 'stu-001',
    full_name: 'Nguyễn Minh Anh',
    email: 'minhanh@example.com',
    phone: '0901234567',
    avatar_url: null,
    student_code: 'NEDU-2026-001234',
    is_active: true,
    activated_at: '2026-01-15T10:00:00Z',
    created_at: '2026-01-10T08:00:00Z',
    consultant_name: 'Chị Nhí',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
