import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useAuthStore } from './shared/stores/auth.store'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })

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
