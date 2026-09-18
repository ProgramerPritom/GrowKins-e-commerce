import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminRouterContextType {
  path: string;
  navigate: (to: string, replace?: boolean) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const AdminRouterContext = createContext<AdminRouterContextType | null>(null);

export const AdminRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => window.location.pathname || '/admin/dashboard');

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setPath(to.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute params based on standard patterns
  const extractParams = (currentPath: string): Record<string, string> => {
    const params: Record<string, string> = {};
    const segments = currentPath.split('/').filter(Boolean);

    // /admin/products/:id/edit or /admin/products/:id
    if (segments[0] === 'admin' && segments[1] === 'products' && segments[2] && segments[2] !== 'new') {
      params.id = segments[2];
      if (segments[3] === 'edit') {
        params.action = 'edit';
      }
    }

    // /admin/categories/:id/edit
    if (segments[0] === 'admin' && segments[1] === 'categories' && segments[2] && segments[2] !== 'new') {
      params.id = segments[2];
      if (segments[3] === 'edit') params.action = 'edit';
    }

    // /admin/collections/:id
    if (segments[0] === 'admin' && segments[1] === 'collections' && segments[2]) {
      params.id = segments[2];
    }

    // /admin/orders/:id
    if (segments[0] === 'admin' && segments[1] === 'orders' && segments[2]) {
      params.id = segments[2];
    }

    // /admin/customers/:id
    if (segments[0] === 'admin' && segments[1] === 'customers' && segments[2]) {
      params.id = segments[2];
    }

    return params;
  };

  const params = extractParams(path);
  const searchParams = new URLSearchParams(window.location.search);

  return (
    <AdminRouterContext.Provider value={{ path, navigate, params, searchParams }}>
      {children}
    </AdminRouterContext.Provider>
  );
};

export const useAdminRouter = () => {
  const context = useContext(AdminRouterContext);
  if (!context) {
    throw new Error('useAdminRouter must be used within an AdminRouterProvider');
  }
  return context;
};
