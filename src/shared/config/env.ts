// src/shared/config/env.ts
// Validate import.meta.env bằng Zod — fail-fast khi thiếu env var.
import { z } from 'zod'

const EnvSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_AUTH_CENTRAL_URL: z.string().url(),
  VITE_ENABLE_MOCKING: z.enum(['true', 'false']).default('false'),
  VITE_GA4_ID: z.string().default(''),
  VITE_CLARITY_ID: z.string().default(''),
})

const parsed = EnvSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_AUTH_CENTRAL_URL: import.meta.env.VITE_AUTH_CENTRAL_URL,
  VITE_ENABLE_MOCKING: import.meta.env.VITE_ENABLE_MOCKING,
  VITE_GA4_ID: import.meta.env.VITE_GA4_ID,
  VITE_CLARITY_ID: import.meta.env.VITE_CLARITY_ID,
})

if (!parsed.success) {
  console.error('[env] Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables — check .env.local')
}

const MODE = import.meta.env.MODE

export const env = {
  ...parsed.data,
  IS_DEV: MODE !== 'production',
  IS_PROD: MODE === 'production',
  IS_MOCK: parsed.data.VITE_ENABLE_MOCKING === 'true',
}
