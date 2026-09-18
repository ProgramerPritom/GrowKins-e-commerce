export const API_ENDPOINTS = {
  auth: {
    login: '/api/admin/auth/login',
    logout: '/api/admin/auth/logout',
    me: '/api/admin/auth/me',
    refresh: '/api/admin/auth/refresh',
  },
  products: {
    list: '/api/admin/products',
    create: '/api/admin/products',
    detail: (id: string) => `/api/admin/products/${id}`,
    update: (id: string) => `/api/admin/products/${id}`,
    delete: (id: string) => `/api/admin/products/${id}`,
    bulkStatus: '/api/admin/products/bulk-status',
  },
  categories: {
    list: '/api/admin/categories',
    create: '/api/admin/categories',
    detail: (id: string) => `/api/admin/categories/${id}`,
    update: (id: string) => `/api/admin/categories/${id}`,
    delete: (id: string) => `/api/admin/categories/${id}`,
  },
  collections: {
    list: '/api/admin/collections',
    create: '/api/admin/collections',
    detail: (id: string) => `/api/admin/collections/${id}`,
    update: (id: string) => `/api/admin/collections/${id}`,
    delete: (id: string) => `/api/admin/collections/${id}`,
  },
  orders: {
    list: '/api/admin/orders',
    detail: (id: string) => `/api/admin/orders/${id}`,
    updateStatus: (id: string) => `/api/admin/orders/${id}/status`,
    updatePayment: (id: string) => `/api/admin/orders/${id}/payment`,
  },
  customers: {
    list: '/api/admin/customers',
    detail: (id: string) => `/api/admin/customers/${id}`,
  },
  reviews: {
    list: '/api/admin/reviews',
    detail: (id: string) => `/api/admin/reviews/${id}`,
    updateStatus: (id: string) => `/api/admin/reviews/${id}/status`,
    delete: (id: string) => `/api/admin/reviews/${id}`,
  },
  media: {
    list: '/api/admin/media',
    upload: '/api/admin/media/upload',
    delete: (id: string) => `/api/admin/media/${id}`,
  },
  content: {
    homepage: '/api/admin/content/homepage',
    navigation: '/api/admin/content/navigation',
    footer: '/api/admin/content/footer',
  },
  delivery: {
    get: '/api/admin/delivery',
    update: '/api/admin/delivery',
  },
  settings: {
    store: '/api/admin/settings/store',
    checkout: '/api/admin/settings/checkout',
  },
  dashboard: {
    summary: '/api/admin/dashboard/summary',
  }
} as const;
