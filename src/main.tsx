import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useAuthStore } from './shared/stores/auth.store'

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

async function boot() {
  // On localhost: start MSW service worker for mock API interception
  if (isLocalhost) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass' })
    } catch {
      // MSW failed — app will use real API or static fallback
    }
  }

  // Auto-login with mock user (bypass login page)
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

  // Render the app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

boot()
