import type {
  AdminUser,
  AuthSession,
  LoginPayload,
  ApiResponse
} from '../../types/admin';

export interface IAuthService {
  login(payload: LoginPayload): Promise<ApiResponse<AuthSession>>;
  logout(): Promise<ApiResponse<{ success: boolean }>>;
  getCurrentUser(): Promise<ApiResponse<AdminUser>>;
  refreshToken(): Promise<ApiResponse<AuthSession>>;
}
