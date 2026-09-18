import type { IAuthService } from '../interfaces/IAuthService';
import type {
  AdminUser,
  AuthSession,
  LoginPayload,
  ApiResponse
} from '../../types/admin';
import { ApiError, ValidationError } from '../../lib/api/errors';

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const MOCK_ADMIN_USER: AdminUser = {
  id: 'usr-admin-1',
  name: 'Pritom Chowdhury',
  email: 'admin@growkins.com',
  role: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  lastLoginAt: new Date().toISOString()
};

export class MockAuthService implements IAuthService {
  public async login(payload: LoginPayload): Promise<ApiResponse<AuthSession>> {
    await delay();

    if (!payload.email?.trim()) {
      throw new ValidationError('Email is required', { email: ['Email address is required'] });
    }
    if (!payload.password) {
      throw new ValidationError('Password is required', { password: ['Password is required'] });
    }

    // Accept admin@growkins.com or any valid email for mock demonstration
    if (payload.password.length < 4) {
      throw new ValidationError('Invalid password', {
        password: ['Password must be at least 4 characters long.']
      });
    }

    const session: AuthSession = {
      user: {
        ...MOCK_ADMIN_USER,
        email: payload.email.trim(),
        name: payload.email.split('@')[0].replace(/[._]/g, ' ').toUpperCase() || 'Admin User'
      },
      token: `mock-jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
    };

    localStorage.setItem('growkins_admin_session', JSON.stringify(session));

    return {
      success: true,
      data: session,
      message: 'Login successful.'
    };
  }

  public async logout(): Promise<ApiResponse<{ success: boolean }>> {
    await delay(100);
    localStorage.removeItem('growkins_admin_session');
    return { success: true, data: { success: true } };
  }

  public async getCurrentUser(): Promise<ApiResponse<AdminUser>> {
    await delay(100);
    const sessionStr = localStorage.getItem('growkins_admin_session');
    if (!sessionStr) throw new ApiError('Not authenticated.', 401);
    const session = JSON.parse(sessionStr) as AuthSession;
    return { success: true, data: session.user };
  }

  public async refreshToken(): Promise<ApiResponse<AuthSession>> {
    await delay(100);
    const sessionStr = localStorage.getItem('growkins_admin_session');
    if (!sessionStr) throw new ApiError('Not authenticated.', 401);
    const session = JSON.parse(sessionStr) as AuthSession;
    const refreshed: AuthSession = {
      ...session,
      token: `mock-jwt-${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
    };
    localStorage.setItem('growkins_admin_session', JSON.stringify(refreshed));
    return { success: true, data: refreshed };
  }
}

export const mockAuthService = new MockAuthService();
