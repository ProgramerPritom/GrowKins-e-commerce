import type { IAuthService } from '../interfaces/IAuthService';
import type {
  AdminUser,
  AuthSession,
  LoginPayload,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiAuthService implements IAuthService {
  public async login(payload: LoginPayload): Promise<ApiResponse<AuthSession>> {
    const res = await apiClient.post<ApiResponse<AuthSession>>(API_ENDPOINTS.auth.login, payload);
    if (res.data?.token) {
      localStorage.setItem('growkins_admin_session', JSON.stringify(res.data));
    }
    return res;
  }

  public async logout(): Promise<ApiResponse<{ success: boolean }>> {
    try {
      await apiClient.post<ApiResponse<{ success: boolean }>>(API_ENDPOINTS.auth.logout);
    } finally {
      localStorage.removeItem('growkins_admin_session');
    }
    return { success: true, data: { success: true } };
  }

  public getCurrentUser(): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<ApiResponse<AdminUser>>(API_ENDPOINTS.auth.me);
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
