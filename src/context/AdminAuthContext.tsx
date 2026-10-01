import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AdminUser, LoginPayload } from '../types/admin';
import { authService } from '../services';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      // Clear legacy/mock keys from previous sessions
      const sessionStr = localStorage.getItem('growkins_admin_session');
      if (!sessionStr) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(sessionStr);
      const email = (parsed?.user?.email || '').toLowerCase().trim();
      if (email !== 'growkins-admin@gmail.com' || !parsed?.token) {
        localStorage.removeItem('growkins_admin_session');
        setUser(null);
        setIsLoading(false);
        return;
      }

      const res = await authService.getCurrentUser();
      if (res?.data?.email?.toLowerCase().trim() === 'growkins-admin@gmail.com') {
        setUser(res.data);
      } else {
        localStorage.removeItem('growkins_admin_session');
        setUser(null);
      }
    } catch {
      localStorage.removeItem('growkins_admin_session');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('growkins_admin_session');
      sessionStorage.clear();
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
