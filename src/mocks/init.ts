// src/mocks/init.ts
// Gate MSW bằng VITE_ENABLE_MOCKING. Call từ main.tsx TRƯỚC render.
export async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKING !== 'true') return
  const { worker } = await import('./browser')
  // bypass: Supabase auth + static assets không đi qua MSW
  return worker.start({ onUnhandledRequest: 'bypass' })
}
