import { ApiError, ValidationError } from './errors';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
  }

  private getAuthToken(): string | null {
    try {
      const session = localStorage.getItem('growkins_admin_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.token || null;
      }
    } catch {
      // fallback
    }
    return null;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${this.baseUrl}${cleanEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += (url.includes('?') ? '&' : '?') + queryStr;
      }
    }

    return url;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers: customHeaders, ...restOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers = new Headers(customHeaders);
    if (!headers.has('Content-Type') && !(restOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    const token = this.getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...restOptions,
        headers,
      });
    } catch (networkError: any) {
      throw new ApiError(
        networkError.message || 'Unable to connect to backend service. Please check your network.',
        0
      );
    }

    let data: any = null;
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      if (response.status === 422 && data?.errors) {
        throw new ValidationError(data.message || 'Validation failed', data.errors);
      }
      throw new ApiError(
        data?.message || `Request failed with status ${response.status}`,
        response.status,
        data?.errors
      );
    }

    return data as T;
  }

  public get<T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, ...options });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  }

  public put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  }

  public patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient();
