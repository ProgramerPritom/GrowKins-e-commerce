import type { ISettingsService } from '../interfaces/ISettingsService';
import type {
  DeliverySettings,
  StoreSettings,
  CheckoutSettings,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';
import {
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_STORE_SETTINGS,
  INITIAL_CHECKOUT_SETTINGS
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

const DELIVERY_CACHE_KEY = 'growkins_delivery_settings_cache';
const STORE_CACHE_KEY = 'growkins_store_settings_cache';
const CHECKOUT_CACHE_KEY = 'growkins_checkout_settings_cache';

export class ApiSettingsService implements ISettingsService {
  public async getDeliverySettings(): Promise<ApiResponse<DeliverySettings>> {
    try {
      const res = await apiClient.get<ApiResponse<DeliverySettings>>(API_ENDPOINTS.delivery.get);
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(DELIVERY_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}
      const merged = deepMerge(INITIAL_DELIVERY_SETTINGS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(DELIVERY_CACHE_KEY, JSON.stringify(merged));
      } catch {}
      return { success: true, data: merged };
    } catch {
      let local: DeliverySettings = INITIAL_DELIVERY_SETTINGS;
      try {
        const saved = localStorage.getItem(DELIVERY_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_DELIVERY_SETTINGS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateDeliverySettings(
    settings: Partial<DeliverySettings>
  ): Promise<ApiResponse<DeliverySettings>> {
    let current: DeliverySettings = INITIAL_DELIVERY_SETTINGS;
    try {
      const saved = localStorage.getItem(DELIVERY_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_DELIVERY_SETTINGS, JSON.parse(saved));
    } catch {}
    const updated = deepMerge(current, settings);
    try {
      localStorage.setItem(DELIVERY_CACHE_KEY, JSON.stringify(updated));
    } catch {}
    try {
      await apiClient.patch<ApiResponse<DeliverySettings>>(API_ENDPOINTS.delivery.update, updated);
    } catch (e) {
      console.warn(e);
    }
    return { success: true, data: updated, message: 'Delivery settings updated successfully.' };
  }

  public async getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
    try {
      const res = await apiClient.get<ApiResponse<StoreSettings>>(API_ENDPOINTS.settings.store);
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(STORE_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}
      const merged = deepMerge(INITIAL_STORE_SETTINGS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(merged));
      } catch {}
      return { success: true, data: merged };
    } catch {
      let local: StoreSettings = INITIAL_STORE_SETTINGS;
      try {
        const saved = localStorage.getItem(STORE_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_STORE_SETTINGS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateStoreSettings(
    settings: Partial<StoreSettings>
  ): Promise<ApiResponse<StoreSettings>> {
    let current: StoreSettings = INITIAL_STORE_SETTINGS;
    try {
      const saved = localStorage.getItem(STORE_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_STORE_SETTINGS, JSON.parse(saved));
    } catch {}
    const updated = deepMerge(current, settings);
    try {
      localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(updated));
    } catch {}
    try {
      await apiClient.patch<ApiResponse<StoreSettings>>(API_ENDPOINTS.settings.store, updated);
    } catch (e) {
      console.warn(e);
    }
    return { success: true, data: updated, message: 'Store settings updated successfully.' };
  }

  public async getCheckoutSettings(): Promise<ApiResponse<CheckoutSettings>> {
    try {
      const res = await apiClient.get<ApiResponse<CheckoutSettings>>(
        API_ENDPOINTS.settings.checkout
      );
      const rawData = res?.data || {};
      let cached: any = null;
      try {
        const saved = localStorage.getItem(CHECKOUT_CACHE_KEY);
        if (saved) cached = JSON.parse(saved);
      } catch {}
      const merged = deepMerge(INITIAL_CHECKOUT_SETTINGS, deepMerge(cached || {}, rawData));
      try {
        localStorage.setItem(CHECKOUT_CACHE_KEY, JSON.stringify(merged));
      } catch {}
      return { success: true, data: merged };
    } catch {
      let local: CheckoutSettings = INITIAL_CHECKOUT_SETTINGS;
      try {
        const saved = localStorage.getItem(CHECKOUT_CACHE_KEY);
        if (saved) local = deepMerge(INITIAL_CHECKOUT_SETTINGS, JSON.parse(saved));
      } catch {}
      return { success: true, data: local };
    }
  }

  public async updateCheckoutSettings(
    settings: Partial<CheckoutSettings>
  ): Promise<ApiResponse<CheckoutSettings>> {
    let current: CheckoutSettings = INITIAL_CHECKOUT_SETTINGS;
    try {
      const saved = localStorage.getItem(CHECKOUT_CACHE_KEY);
      if (saved) current = deepMerge(INITIAL_CHECKOUT_SETTINGS, JSON.parse(saved));
    } catch {}
    const updated = deepMerge(current, settings);
    try {
      localStorage.setItem(CHECKOUT_CACHE_KEY, JSON.stringify(updated));
    } catch {}
    try {
      await apiClient.patch<ApiResponse<CheckoutSettings>>(
        API_ENDPOINTS.settings.checkout,
        updated
      );
    } catch (e) {
      console.warn(e);
    }
    return { success: true, data: updated, message: 'Checkout settings updated successfully.' };
  }
}

export const apiSettingsService = new ApiSettingsService();
