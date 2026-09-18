export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'store_manager' | 'editor';
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}
