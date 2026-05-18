// Auth service facade — delegate sang auth-central-client (L1 D1: FE login
// direct với auth-central, KHÔNG qua nedu-backend).
import { authCentralClient } from '../../../shared/config/auth-central-client'

export const authService = {
  login: (email: string, password: string) =>
    authCentralClient.login(email, password),

  /**
   * Activation học viên mới: token từ email + password → auto-login.
   * Auth-central endpoint thật: POST /auth/invite/accept.
   */
  activate: (token: string, password: string) =>
    authCentralClient.activate(token, password),

  forgotPassword: (email: string) =>
    authCentralClient.forgotPassword(email),

  resetPassword: (token: string, password: string) =>
    authCentralClient.resetPassword(token, password),

  me: (accessToken: string) => authCentralClient.me(accessToken),

  refresh: (refreshToken: string) => authCentralClient.refresh(refreshToken),

  logout: (
    accessToken: string,
    options?: { refresh_token?: string; all_devices?: boolean },
  ) => authCentralClient.logout(accessToken, options),
}
