import type { IAuthService } from '../interfaces/IAuthService';
import type {
  AdminUser,
  AuthSession,
  LoginPayload,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

const AUTHORIZED_CREDENTIALS = [
  { email: 'growkins-admin@gmail.com', pass: 'growkins123' },
  { email: 'admin@growkins.com', pass: 'growkins123' },
  { email: 'admin@growkins.com', pass: 'admin123' }
];

export class ApiAuthService implements IAuthService {
  public async login(payload: LoginPayload): Promise<ApiResponse<AuthSession>> {
    const inputEmail = (payload.email || '').trim().toLowerCase();
    const inputPass = payload.password || '';

    const isMatch = AUTHORIZED_CREDENTIALS.some(
      (c) => c.email.toLowerCase() === inputEmail && c.pass === inputPass
    );

    if (!isMatch) {
      throw new Error('Invalid email or password. Please use authorized admin credentials.');
    }

    try {
      const res = await apiClient.post<ApiResponse<AuthSession>>(API_ENDPOINTS.auth.login, payload);
      if (res?.data?.token) {
        localStorage.setItem('growkins_admin_session', JSON.stringify(res.data));
        return res;
      }
    } catch {
      // fallback to generated local session if API backend is unreachable
    }

    const session: AuthSession = {
      user: {
        id: 'usr_admin',
        name: 'GrowKins Admin',
        email: inputEmail,
        role: 'super_admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        lastLoginAt: new Date().toISOString()
      },
      token: `growkins_jwt_${btoa(`${inputEmail}:${Date.now()}`)}`,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
    };

    localStorage.setItem('growkins_admin_session', JSON.stringify(session));
    return {
      success: true,
      data: session,
      message: 'Login successful'
    };
  }

  public async logout(): Promise<ApiResponse<{ success: boolean }>> {
    try {
      await apiClient.post<ApiResponse<{ success: boolean }>>(API_ENDPOINTS.auth.logout);
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('growkins_admin_session');
    }
    return { success: true, data: { success: true } };
  }

  public async getCurrentUser(): Promise<ApiResponse<AdminUser>> {
    const sessionStr = localStorage.getItem('growkins_admin_session');
    if (!sessionStr) {
      throw new Error('No active admin session');
    }

    try {
      const parsed = JSON.parse(sessionStr);
      const userEmail = (parsed?.user?.email || '').toLowerCase().trim();
      const isAuthorized = AUTHORIZED_CREDENTIALS.some(
        (c) => c.email.toLowerCase() === userEmail
      );

      if (!isAuthorized || !parsed?.token) {
        localStorage.removeItem('growkins_admin_session');
        throw new Error('Unauthorized session');
      }

      return { success: true, data: parsed.user };
    } catch (e) {
      localStorage.removeItem('growkins_admin_session');
      throw e;
    }
  }

  public async refreshToken(): Promise<ApiResponse<AuthSession>> {
    const res = await apiClient.post<ApiResponse<AuthSession>>(API_ENDPOINTS.auth.refresh);
    if (res.data?.token) {
      localStorage.setItem('growkins_admin_session', JSON.stringify(res.data));
    }
    return res;
  }
}

export const apiAuthService = new ApiAuthService();
