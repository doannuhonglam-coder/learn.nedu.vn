// Auth service facade — delegate sang auth-central-client (L1 D1: FE login
// direct với auth-central, KHÔNG qua nedu-backend).
//
// Phase 1: Google OAuth only — KHÔNG có email/password, KHÔNG có activation
// (xem auth-central-client.ts header).
import { authCentralClient } from '../../../shared/config/auth-central-client'

export const authService = {
  googleLoginUrl: (returnTo: string) => authCentralClient.googleLoginUrl(returnTo),

  me: (accessToken: string) => authCentralClient.me(accessToken),

  refresh: (refreshToken: string) => authCentralClient.refresh(refreshToken),

  logout: (
    accessToken: string,
    options?: { refresh_token?: string; all_devices?: boolean },
  ) => authCentralClient.logout(accessToken, options),
}
