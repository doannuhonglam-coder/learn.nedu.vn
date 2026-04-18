// src/shared/config/env.ts
// Validate import.meta.env bằng Zod — fail-fast khi thiếu env var.
import { z } from 'zod'

const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_URL: z.string().url(),
  VITE_ENABLE_MOCKING: z.enum(['true', 'false']).default('false'),
})

const parsed = EnvSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_ENABLE_MOCKING: import.meta.env.VITE_ENABLE_MOCKING,
})

if (!parsed.success) {
  console.error('[env] Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables — check .env.local')
}

export const env = parsed.data
