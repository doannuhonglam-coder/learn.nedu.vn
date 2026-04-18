import type { LoginResponse, StudentProfile } from '../../../shared/types'

// Simulated Google OAuth flow. In production this would use
// supabase.auth.signInWithOAuth({ provider: 'google' }) which redirects
// to Google and back to /auth-callback.
//
// For demo/mock mode, we pick from a preset list of Gmail accounts.
// First-time users get auto-created with data derived from their email.

const KNOWN_USERS: Record<string, StudentProfile> = {
  // Existing learner account (comes with mock data)
  'minhanh@example.com': {
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
  },
}

// Derive a display name from email local-part (e.g. "john.doe" → "John Doe")
function deriveName(email: string): string {
  const local = email.split('@')[0] || 'Học viên'
  return local
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function generateStudentCode(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `NEDU-${year}-${rand}`
}

export interface GoogleSignInResult extends LoginResponse {
  is_new_account: boolean
}

export async function signInWithGoogle(gmail: string): Promise<GoogleSignInResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800))

  if (!gmail || !gmail.endsWith('@gmail.com')) {
    throw { code: 'INVALID_GMAIL', message: 'Vui lòng chọn tài khoản Gmail hợp lệ' }
  }

  const existing = KNOWN_USERS[gmail]
  const now = new Date()

  if (existing) {
    return {
      access_token: `mock-google-jwt-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      user: existing,
      is_new_account: false,
    }
  }

  // Auto-create new student account from Gmail
  const newUser: StudentProfile = {
    id: `stu-${Date.now()}`,
    full_name: deriveName(gmail),
    email: gmail,
    phone: null,
    avatar_url: null,
    student_code: generateStudentCode(),
    is_active: true,
    activated_at: now.toISOString(),
    created_at: now.toISOString(),
    consultant_name: null,
  }

  return {
    access_token: `mock-google-jwt-${Date.now()}`,
    refresh_token: `mock-refresh-${Date.now()}`,
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    user: newUser,
    is_new_account: true,
  }
}
