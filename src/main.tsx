import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { enableMocking } from './mocks/init'
import { useAuthStore } from './shared/stores/auth.store'

async function bootstrap() {
  await enableMocking()

  // Auto-login with mock user (bypass login page) — giữ cho UI cũ vẫn chạy
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

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
