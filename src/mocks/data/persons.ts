// src/mocks/data/persons.ts
// Nguồn identity share cho mọi mock handler. KHÔNG edit rải rác.
export type Role = 'learner' | 'ops_admin' | 'founder'

export interface MockPerson {
  id: string                   // student_accounts.id (= student_id)
  person_id?: string           // Central Auth persons.id — nullable (DEV-2)
  email: string
  full_name: string
  student_code: string
  avatar_url?: string
  consultant_name?: string
  roles: Role[]
  primary_role: Role
  noi_status: 'active' | 'invited' | 'rebuilding' | null
  streak_weeks: number
}

export const MOCK_PERSONS: MockPerson[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    person_id: 'ca1b2c3d-e5f6-7890-abcd-ef1234500001',
    email: 'learner-01@nedu-learn.vn',
    full_name: 'Learner 01',
    student_code: 'ND-2026-001',
    consultant_name: 'Consultant 01',
    roles: ['learner'],
    primary_role: 'learner',
    noi_status: 'rebuilding',
    streak_weeks: 7,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    person_id: undefined,
    email: 'learner-02@nedu-learn.vn',
    full_name: 'Learner 02',
    student_code: 'ND-2026-002',
    roles: ['learner'],
    primary_role: 'learner',
    noi_status: null,
    streak_weeks: 2,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    person_id: undefined,
    email: 'learner-03@nedu-learn.vn',
    full_name: 'Learner 03',
    student_code: 'ND-2026-003',
    roles: ['learner'],
    primary_role: 'learner',
    noi_status: null,
    streak_weeks: 0,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    person_id: undefined,
    email: 'ops-admin-01@nedu-learn.vn',
    full_name: 'Ops Admin 01',
    student_code: 'ND-OPS-001',
    roles: ['ops_admin'],
    primary_role: 'ops_admin',
    noi_status: null,
    streak_weeks: 0,
  },
]
