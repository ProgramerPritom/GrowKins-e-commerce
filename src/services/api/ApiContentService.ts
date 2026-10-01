import type { IContentService } from '../interfaces/IContentService';
import type {
  HomepageCMS,
  NavigationCMS,
  FooterCMS,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';
import {
  INITIAL_HOMEPAGE_CMS,
  INITIAL_NAVIGATION_CMS,
  INITIAL_FOOTER_CMS
} from '../../lib/mockDb/seedData';

function deepMerge<T extends Record<string, any>>(target: T, source?: any): T {
  if (!source || typeof source !== 'object') return { ...target };
  const output = { ...target } as any;
  for (const key of Object.keys(target)) {
    if (source[key] === undefined || source[key] === null) {
      continue;
    }
    if (
      typeof target[key] === 'object' &&
      !Array.isArray(target[key]) &&
      target[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  for (const key of Object.keys(source)) {
    if (!(key in target) && source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

const HOMEPAGE_CACHE_KEY = 'growkins_homepage_cms_cache';
const NAVIGATION_CACHE_KEY = 'growkins_navigation_cms_cache';
const FOOTER_CACHE_KEY = 'growkins_footer_cms_cache';

export class ApiContentService implements IContentService {
  public async getHomepage(): Promise<ApiResponse<HomepageCMS>> {
    try {
      const res = await apiClient.get<ApiResponse<HomepageCMS>>(API_ENDPOINTS.content.homepage);
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(HOMEPAGE_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}

      const merged = deepMerge(INITIAL_HOMEPAGE_CMS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(HOMEPAGE_CACHE_KEY, JSON.stringify(merged));
      } catch {}

      return { success: true, data: merged };
    } catch (err) {
      console.warn('Failed to fetch remote homepage CMS, using cache/defaults:', err);
      let local: HomepageCMS = INITIAL_HOMEPAGE_CMS;
      try {
        const saved = localStorage.getItem(HOMEPAGE_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_HOMEPAGE_CMS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateHomepage(cms: Partial<HomepageCMS>): Promise<ApiResponse<HomepageCMS>> {
    let current: HomepageCMS = INITIAL_HOMEPAGE_CMS;
    try {
      const saved = localStorage.getItem(HOMEPAGE_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_HOMEPAGE_CMS, JSON.parse(saved));
    } catch {}

    const updated = deepMerge(current, cms);
    try {
      localStorage.setItem(HOMEPAGE_CACHE_KEY, JSON.stringify(updated));
    } catch {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('growkins:content-updated', {
          detail: { type: 'homepage', data: updated }
        })
      );
    }

    try {
      const res = await apiClient.patch<ApiResponse<HomepageCMS>>(
        API_ENDPOINTS.content.homepage,
        updated
      );
      return {
        success: true,
        data: updated,
        message: res?.message || 'Homepage content updated successfully.'
      };
    } catch (err) {
      console.warn('Remote sync failed, updated locally:', err);
      return { success: true, data: updated, message: 'Settings saved locally.' };
    }
  }

  public async getNavigation(): Promise<ApiResponse<NavigationCMS>> {
    try {
      const res = await apiClient.get<ApiResponse<NavigationCMS>>(API_ENDPOINTS.content.navigation);
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(NAVIGATION_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}
      const merged = deepMerge(INITIAL_NAVIGATION_CMS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(NAVIGATION_CACHE_KEY, JSON.stringify(merged));
      } catch {}
      return { success: true, data: merged };
    } catch {
      let local: NavigationCMS = INITIAL_NAVIGATION_CMS;
      try {
        const saved = localStorage.getItem(NAVIGATION_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_NAVIGATION_CMS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateNavigation(cms: Partial<NavigationCMS>): Promise<ApiResponse<NavigationCMS>> {
    let current: NavigationCMS = INITIAL_NAVIGATION_CMS;
    try {
      const saved = localStorage.getItem(NAVIGATION_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_NAVIGATION_CMS, JSON.parse(saved));
    } catch {}
    const updated = deepMerge(current, cms);
    try {
      localStorage.setItem(NAVIGATION_CACHE_KEY, JSON.stringify(updated));
    } catch {}
    try {
      await apiClient.patch<ApiResponse<NavigationCMS>>(API_ENDPOINTS.content.navigation, updated);
    } catch (e) {
      console.warn(e);
    }
    return { success: true, data: updated, message: 'Navigation updated successfully.' };
  }

  public async getFooter(): Promise<ApiResponse<FooterCMS>> {
    try {
      const res = await apiClient.get<ApiResponse<FooterCMS>>(API_ENDPOINTS.content.footer);
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(FOOTER_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}
      const merged = deepMerge(INITIAL_FOOTER_CMS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(FOOTER_CACHE_KEY, JSON.stringify(merged));
      } catch {}
      return { success: true, data: merged };
    } catch {
      let local: FooterCMS = INITIAL_FOOTER_CMS;
      try {
        const saved = localStorage.getItem(FOOTER_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_FOOTER_CMS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateFooter(cms: Partial<FooterCMS>): Promise<ApiResponse<FooterCMS>> {
    let current: FooterCMS = INITIAL_FOOTER_CMS;
    try {
      const saved = localStorage.getItem(FOOTER_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_FOOTER_CMS, JSON.parse(saved));
    } catch {}
    const updated = deepMerge(current, cms);
    try {
      localStorage.setItem(FOOTER_CACHE_KEY, JSON.stringify(updated));
    } catch {}
    try {
      await apiClient.patch<ApiResponse<FooterCMS>>(API_ENDPOINTS.content.footer, updated);
    } catch (e) {
      console.warn(e);
    }
    return { success: true, data: updated, message: 'Footer content updated successfully.' };
  }
}

export const apiContentService = new ApiContentService();
